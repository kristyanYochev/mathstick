# For Flask
from flask import Flask, render_template, request, redirect, session, jsonify
from config import HOST, PORT

# For Database
import pymysql
from passlib.hash import sha256_crypt as sha256
from config import DATABASE_HOST, \
    DATABASE_USER, DATABASE_PASSWORD, DATABASE_DATABASE

db = pymysql.connect(
    host=DATABASE_HOST,
    user=DATABASE_USER,
    password=DATABASE_PASSWORD,
    database=DATABASE_DATABASE,
    cursorclass=pymysql.cursors.DictCursor
)

app = Flask(__name__)
app.config["SECRET_KEY"] = "fjwwuhf72te8tr$^E$RIYT^E#%@$_))&^$W@>><GHtdwygif37ytr68fr3yhuiahfi7ybw7b"


@app.route("/")
def index():
    return render_template("LoginRegister.html")


@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]

    INVALID_USERNAME_OR_EMAIL_ERROR = "Username or email exists!"

    with db.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM users WHERE username = %s OR email = %s',
            (username, email)
        )
        user_data = cursor.fetchone()

        if user_data is None:
            cursor.execute(
                'INSERT INTO users (username, password, email) VALUES (%s, %s, %s)',
                (username, sha256.hash(password), email)
            )
            db.commit()
        else:
            return INVALID_USERNAME_OR_EMAIL_ERROR

        cursor.execute(
            'SELECT * FROM users WHERE username = %s OR email = %s',
            (username, email)
        )
        user_data = cursor.fetchone()

    session["id"] = user_data["id"]
    session["username"] = username

    return redirect("/game")


@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]
    
    INVALID_EMAIL_ERROR = "Email is invalid!"
    INVALID_PASSWORD_ERROR = "Password is invalid!"

    with db.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM users WHERE email = %s',
            (email)
        )

        user_data = cursor.fetchone()

        if user_data is None:
            return INVALID_EMAIL_ERROR

        if sha256.verify(password, user_data['password']) != 1:
            return INVALID_PASSWORD_ERROR

    session["username"] = user_data["username"]
    session["id"] = user_data["id"]

    return redirect("/game")


@app.route("/game")
def game():
    return render_template("game.html", name=session["username"], id=session["id"])


if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=int(PORT))

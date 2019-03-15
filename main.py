# For Flask
from flask import Flask, render_template, request, redirect, session, jsonify
from config import HOST, PORT

# For Database
import pymysql
from passlib.hash import sha256_crypt as sha256
from config import DATABASE_HOST, \
    DATABASE_USER, DATABASE_PASSWORD, DATABASE_DATABASE

# Sockets
from flask_socketio import SocketIO, join_room, leave_room, emit

# Utils
from validate_email import validate_email
import random
import uuid

app = Flask(__name__)
app.config["SECRET_KEY"] = "fjwwuhf72te8tr$^E$RIYT^E#%@$_))&^$W@>><GHtdwygif37ytr6fi7ybw7b"
socketio = SocketIO(app)

'''
---------- Utils ----------
'''

def get_unique_id():
    unique_id = str(uuid.uuid4())
    return unique_id[-6:]

def get_equations(number_of_equations, user_ids):
    sql_users = ""

    for user_id in user_ids:
        sql_users += str(user_id) + ", "

    sql_users = sql_users[:-2]

    sql_query = '''
        SELECT * 
        FROM equations 
        WHERE id NOT IN 
        (
            SELECT equation_id 
            FROM completed 
            WHERE user_id IN ({})
        ) 
        ORDER BY RAND() LIMIT {}
        '''.format(
        pymysql.escape_string(sql_users),
        pymysql.escape_string(str(number_of_equations))
    )

    with db.cursor() as cursor:
        cursor.execute(sql_query)
        equations = cursor.fetchall()

    return equations


'''
---------- Sockets ----------
'''

@socketio.on("craete_room")
def on_create_room(data):
    room_id = get_unique_id()

    user_id = data["user_id"]
    max_players = data["max_players"]

    join_room(room_id)

    with db.cursor() as cursor:
        cursor.execute(
            'INSERT INTO rooms (room_id, max_players) VALUES (%s, %s)',
            (room_id, max_players)
        )

        cursor.execute(
            'INSERT INTO players (room_id, user_id) VALUES (%s, %s)',
            (room_id, user_id)
        )
        db.commit()

    emit("created_room", {"room_id": room_id}, room=room_id)


@socketio.on("join_room")
def on_join_room(data):
    room_id = data["room_id"]
    username = data["username"]
    user_id = data["user_id"]

    with db.cursor() as cursor:
        cursor.execute(
            'INSERT INTO players (room_id, user_id) VALUES (%s, %s)',
            (room_id, user_id)
        )
        db.commit()

        cursor.execute(
            'SELECT COUNT(*) AS count FROM players WHERE room_id = %s',
            (room_id)
        )
        current_players = cursor.fetchone()["count"]

        cursor.execute(
            'SELECT max_players AS count FROM rooms WHERE room_id = %s',
            (room_id)
        )
        max_players = cursor.fetchone()["max_players"]

    if current_players == max_players:
        join_room(room_id)
        emit("joined_room", {"username": username, "user_id": user_id}, room=room_id)
        emit("room_full", room=room_id)
    elif current_players > max_players:
        emit("room_full", room=room_id)
    else:
        join_room(room_id)
        emit("joined_room", {"username": username, "user_id": user_id}, room=room_id)


@socketio.on("start_game")
def on_start_game(data):
    room_id = data["room_id"]
    user_ids = data["user_ids"]
    equations_count = int(data["equations_count"])

    equations = get_equations(equations_count, user_ids)

    emit("starting_game", {"equations": equations}, room=room_id)


@socketio.on("finish_game")
def on_finish_game(data):
    room_id = data["room_id"]
    user_id = data["user_id"]
    time = data["time"]

    with db.cursor() as cursor:
        cursor.execute(
            "UPDATE players SET time_finished = %s WHERE room_id = %s AND user_id = %s",
            (time, room_id, user_id)
        )
        db.commit()

        cursor.execute(
            "select COUNT(*) AS count players WHERE room_id = %s AND time_finished != 0",
            (room_id)
        )
        current_finished = cursor.fetchone()["count"]

        cursor.execute(
            'SELECT max_players AS count FROM rooms WHERE room_id = %s',
            (room_id)
        )
        max_players = cursor.fetchone()["max_players"]

    emit("finished_game", {"user_id": user_id, "time": time}, room=room_id)

    if current_finished == max_players:
        emit("all_players_are_finished", room=room_id)


@socketio.on("leave_room")
def on_leave_room(data):
    # TODO: delete user from db
    room_id = data["room_id"]
    leave_room(room_id)


'''
---------- Routes ----------
'''

@app.route("/")
def index():
    return render_template("LoginRegister.html")


@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]

    INVALID_USERNAME_OR_EMAIL_ERROR = "Username or email exists!"
    INVALID_EMAIL_ERROR = "Email is invalid!"

    if validate_email(email) != True:
        return render_template("LoginRegister.html", register_error=INVALID_EMAIL_ERROR)


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
            return render_template("LoginRegister.html", register_error=INVALID_USERNAME_OR_EMAIL_ERROR)

        cursor.execute(
            'SELECT * FROM users WHERE username = %s OR email = %s',
            (username, email)
        )
        user_data = cursor.fetchone()

    session["id"] = user_data["id"]
    session["username"] = username

    return redirect("/setings")


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
            return render_template("LoginRegister.html", login_error=INVALID_EMAIL_ERROR)

        if sha256.verify(password, user_data['password']) != 1:
            return render_template("LoginRegister.html", login_error=INVALID_PASSWORD_ERROR)

    session["username"] = user_data["username"]
    session["id"] = user_data["id"]

    return redirect("/setings")


@app.route("/game/<str:mode>")
def game(mode):
    return render_template("game.html", name=session["username"], id=session["id"], mode=mode)

@app.route("/setings", methods=["GET", "POST"])
def setings():
    if request.method == "GET":
        return render_template("index.html")
    else:
        return redirect("/game/singleplayer")


@app.route("/get/equation", methods=["POST"])
def get_equation():
    json_data = request.get_json()
    id = json_data["id"]

    with db.cursor() as cursor:
        cursor.execute(
            'SELECT * FROM equations WHERE id NOT IN (SELECT equation_id FROM completed WHERE user_id = %s) ORDER BY RAND() LIMIT 1',
            (id)
        )

        equation = cursor.fetchone()

    return jsonify(equation)


@app.route("/complete", methods=["POST"])
def completed():
    json_data = request.get_json()
    user_id = json_data["user_id"]
    equation_id = json_data["equation_id"]
    time = json_data["time"]

    with db.cursor() as cursor:
        # TODO: Add time to table and use it
        cursor.execute(
            'INSERT INTO completed (user_id, equation_id) VALUES (%s, %s)',
            (user_id, equation_id)
        )

        db.commit()
    
    return jsonify(success=1)


if __name__ == "__main__":
    db = pymysql.connect(
        host=DATABASE_HOST,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        database=DATABASE_DATABASE,
        cursorclass=pymysql.cursors.DictCursor
    )

    socketio.run(app, debug=True, host=HOST, port=int(PORT))
    

        
    

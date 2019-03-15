from flask import Flask, render_template, request, redirect, session, jsonify

import pymysql

app = Flask(__name__)
app.config["SECRET_KEY"] = "fjwwuhf72te8tr$^E$RIYT^E#%@$_))&^$W@>><GHtdwygif37ytr68fr3yhuiahfi7ybw7b"


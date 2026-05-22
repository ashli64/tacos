# Isabel Zheng, Veronika Duvanova, Ashley Li, and Naomi Kurian
# Tacos
# SoftDev
# P05 -- Le Fin
# 2026-05-13

import sqlite3
import random
from flask import Flask, render_template
from flask import session, request, redirect
import os
#import requests


# Flask
app = Flask(__name__)
app.secret_key = 'wegjedfoigshseiudf'

# SQLite

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "data.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

db = get_db()
c = db.cursor()


c.execute("""
CREATE TABLE IF NOT EXISTS users (
    username TEXT UNIQUE,
    password TEXT,
    contributions TEXT,
    ingredients TEXT,
    favorites TEXT,
    highscore REAL
)
""")


c.execute("""
CREATE TABLE IF NOT EXISTS recipes (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   author TEXT,
   name TEXT,
   description TEXT,
   ingredients TEXT,
   pic TEXT,
   difficulty TEXT,
   instructions TEXT
)
""")



db.commit()
db.close()






@app.route('/', methods=["GET"])
def homepage():
    if "username" not in session:
        return redirect("/login")
 
    new = fetch('recipes', True, 'COUNT(*)')[0][0]
    recipes = fetch('recipes', True, 'id, name, author, description')

    recipeSearch = []
    for recipe in recipes:
        recipeSearch.append(recipe[1])

    return render_template("home.html",new=new,recipes=recipes,recipeSearch=recipeSearch, username = session['username'])

@app.route('/results', methods=["GET"])
def results():
    if "username" not in session:
        return redirect("/login")

    search = request.args.get("search", "").strip()
    if search == "":
        return redirect("/")

    db = get_db()
    c = db.cursor()
    c.execute("""
        SELECT id, name, author, description
        FROM recipes
        WHERE LOWER(name) LIKE ?
    """, ('%' + search.lower() + '%',))
    matches = c.fetchall()
    db.close()

    return render_template("results.html", recipes=matches,search=search)


@app.route('/create/<rid>', methods=["GET", "POST"])
def create(rid):
    if not 'username' in session:
        return redirect("/login")
    if rid in fetch('users', 'username = ?', 'contributions', (session['username'],))[0][0].split(','):
        return redirect(f"/recipe/{rid}")
    if int(rid) > fetch('recipes', True, 'COUNT(*)')[0][0]:
        return redirect("/")

    ings = []
    if request.method == "POST":
        if request.form["addIng"]:
            ings += [request.form["addIng"]]
            return render_template("create.html", ings = ings)

        else:

            db = get_db()
            c = db.cursor()

            query = "INSERT INTO recipes (author, name, description, ingredients, pic, difficulty, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)"
            params = (session["username"], request.form["name"], request.form["description"], request.form["ingredients"], '', request.form["diff"], request.form["instructions"],)
            c.execute(query, params)

            db.commit()
            db.close()
            return redirect("/")

    return render_template("create.html", ings = ings)


@app.route('/recipe/<rid>', methods=["GET", "POST"])
def recipe(rid):
    if not 'username' in session:
        return redirect("/login")
    if int(rid) > fetch('recipes', True, 'COUNT(*)')[0][0]:
        return redirect("/")
    description = fetch("recipes", "id = ?", "description", (rid,))[0][0]
    name = fetch("recipes", "id = ?", "name", (rid,))[0][0]
    ingredients = fetch("recipes", "id = ?", "ingredients", (rid,))[0][0]
    author = fetch("recipes", "id = ?", "author", (rid,))[0][0]
    difficulty = fetch("recipes", "id = ?", "difficulty", (rid,))[0][0]
    instructions = fetch("recipes", "id = ?", "instructions", (rid,))[0][0]

    return render_template("recipe.html", name = name, description = description, ingredients = ingredients, author = author, difficulty = difficulty, instructions = instructions)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    session.clear()
    return redirect("/login")



@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        usernames = [row[0] for row in fetch("users", "TRUE", "username")]
        if not request.form["username"] in usernames:
            return render_template("login.html", error="Wrong &nbsp username &nbsp or &nbsp password!<br><br>")
        elif (request.form["password"] != fetch("users", "username = ?", "password", (request.form["username"],))[0][0]):
            return render_template("login.html", error="Wrong &nbsp username &nbsp or &nbsp password!<br><br>")
        else:
            session["username"] = request.form["username"]

    if "username" in session:
        return redirect("/")

    return render_template("login.html")



@app.route('/register', methods=["GET", "POST"])
def register():
    if "username" in session:
        return redirect("/")

    if request.method == "POST" and request.form:
        usernames = [row[0] for row in fetch("users", "TRUE", "username")]

        if request.form["username"] in usernames:
            return render_template("register.html", error="Username already taken, please try again! <br><br>")
        elif request.form["password"] != request.form["confirm"]:
            return render_template("register.html", error="Passwords don't match <br><br>")

        else:
            db = sqlite3.connect(DB_FILE)
            c = db.cursor()
            c.execute(
                "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
                (
                    request.form["username"],
                    request.form["password"],
                    '',
                    '',
                    '',
                    0,

                )
            )
            db.commit()
            db.close()
            session["username"] = fetch("users", "username = ?", "username", (request.form["username"],))[0][0]
            return redirect("/")

    return render_template("register.html")


@app.route("/profile/<pid>", methods=["GET", "POST"])
def profile(pid):
    if "username" not in session:
        return redirect("/login")
    mine = fetch('recipes','author = ?', 'id', (session['username'],))
    mineNames = fetch('recipes','author = ?', 'name', (session['username'],))
    recipes = []
    for i in range(len(mine)):
        recipes += [mineNames[i], mine[i]]
    return render_template("profile.html", user = session["username"], mine = mine, recipes = recipes)




def fetch(table, criteria, data, params=()):
    db = get_db()
    c = db.cursor()
    query = f"SELECT {data} FROM {table} WHERE {criteria}"
    c.execute(query, params)
    data = c.fetchall()
    db.commit()
    db.close()
    return data

@app.route("/game", methods=["GET", "POST"])
def game():
    if "username" not in session:
        return redirect("/login")
    return render_template("game.html", user = session["username"])



if __name__=='__main__':
    app.debug = True
    app.run()

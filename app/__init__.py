# Isabel Zheng, Veronika Duvanova, Ashley Li, and Naomi Kurian
# Tacos
# SoftDev
# P05 -- Le Fin
# 2026-05-13

import sqlite3
import random
from flask import Flask, render_template
from flask import session, request, redirect, jsonify
import os
import urllib.request
import urllib.parse
import json
from werkzeug.utils import secure_filename
from werkzeug.utils import secure_filename

allowed = {"png", "jpg", "jpeg", "gif"}



# Flask
app = Flask(__name__)
app.secret_key = 'inbuifnrexctfyviuutbfr5rbdtbfnjgytbf76tygvy'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

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
   instructions TEXT,
   lat REAL,
   long REAL
)
""")

c.execute("""
CREATE TABLE IF NOT EXISTS reviews (
   author TEXT,
   stars INT,
   summary TEXT,
   recipe INT,
   title TEXT
)
""")



db.commit()
db.close()


def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in allowed
    )



@app.route('/', methods=["GET"])
def homepage():
    if "username" not in session:
        return redirect("/login")

    recipes = fetch('recipes', True, 'id, name, author, description, pic')

    recipeSearch = []
    for recipe in recipes:
        recipeSearch.append(recipe[1])

        

    return render_template("home.html",recipes=recipes,recipeSearch=recipeSearch, username = session['username'])

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

    return render_template("results.html", recipes=matches, search=search, username=session["username"])


@app.route('/map', methods=["GET", "POST"])
def map():
    if not 'username' in session:
        return redirect("/login")
    stuff = [list(r) for r in fetch("recipes", True, "id, name, pic, lat, long")]
    return render_template("map.html", username = session['username'], recipes = stuff)

@app.route('/searchIngs', methods=["GET", "POST"])
def searchIngs():
    if not 'username' in session:
        return redirect("/login")

    results = []

    if request.method == "POST":
        submitted = request.form.get("ingredients", "").strip().lower()

        if submitted:
            sub = [i.strip() for i in submitted.split(",")]

            filt = []
            params = []

            for s in sub:
                filt.append("LOWER(ingredients) LIKE ?")
                params.append(f"%{s}%")

            filt2 = " OR ".join(filt)

            results = fetch("recipes",filt2,"id, name, author, description",tuple(params))

    return render_template("searching.html",username=session['username'], stuff=results)

@app.route('/create', methods=["GET", "POST"])
def create():
    if not 'username' in session:
        return redirect("/login")
    rid = fetch('recipes', True, 'COUNT(*)')[0][0]


    if request.method == "POST":

        db = get_db()
        c = db.cursor()

        query = "INSERT INTO recipes (author, name, description, ingredients, pic, difficulty, instructions, lat, long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        params = (session["username"], request.form["name"], request.form["description"], request.form.get("ingredients"), '', request.form["diff"], request.form["instructions"], request.form.get("lt"), request.form.get("lg"))
        c.execute(query, params)

        recipeId = c.lastrowid

        photo = request.files.get("pic")
        filename = ''
        if photo and photo.filename != "" and allowed_file(photo.filename):

            curr = os.path.splitext(photo.filename)[1]
            filename = f"{rid}{curr}"
            upload_path = os.path.join(
                app.static_folder,
                "uploads",
                filename
            )

            photo.save(upload_path)
        else:
            filename = "taco.jpeg"

        c.execute(
            "UPDATE recipes SET pic = ? WHERE id = ?",
            (filename, recipeId)
        )

        db.commit()
        db.close()
        return redirect("/")

    return render_template("create.html", username = session['username'])

@app.route('/review/<rid>', methods=["GET", "POST"])
def review(rid):
    author = session['username']
    recipeId = rid

    if request.method == "POST":
        db = get_db()
        c = db.cursor()

        query = "INSERT INTO reviews (author, stars, summary, recipe, title) VALUES (?, ?, ?, ?, ?)"

        stars = request.form.get('stars', default=0, type=int)
        params = (author, stars, request.form["summary"], recipeId, request.form['ttl'])
        c.execute(query, params)

        db.commit()
        db.close()

        return redirect("/")


    return render_template("review.html", username = author)


@app.route('/recipe/<rid>', methods=["GET", "POST"])
def recipe(rid):
    if not 'username' in session:
        return redirect("/login")
    amt = fetch('recipes', True, 'COUNT(*)')[0][0]
    if int(rid) > amt:
        return redirect("/")
    description = fetch("recipes", "id = ?", "description", (rid,))[0][0]
    name = fetch("recipes", "id = ?", "name", (rid,))[0][0]
    ingredients = fetch("recipes", "id = ?", "ingredients", (rid,))[0][0]
    author = fetch("recipes", "id = ?", "author", (rid,))[0][0]
    difficulty = fetch("recipes", "id = ?", "difficulty", (rid,))[0][0]
    instructions = fetch("recipes", "id = ?", "instructions", (rid,))[0][0]
    if author == session['username']:
        rev = False
    else:
        rev = True
    if fetch("recipes", "id = ?", "pic", (rid,)):
        pic = fetch("recipes", "id = ?", "pic", (rid,))[0][0]
    else:
        pic = ''

    s = fetch('reviews', 'recipe = ?', "author, stars, summary, title", (rid,))

    return render_template("recipe.html", rev = rev, name=name, description=description, ingredients=ingredients, author=author, difficulty=difficulty, instructions=instructions, username=session['username'], pic=pic, rid = rid, stuff = s)


@app.route("/edit/<rid>", methods=["GET", "POST"])
def edit(rid):
    if not 'username' in session:
        return redirect("/login")
    description = fetch("recipes", "id = ?", "description", (rid,))[0][0]
    name = fetch("recipes", "id = ?", "name", (rid,))[0][0]
    ingredients = fetch("recipes", "id = ?", "ingredients", (rid,))[0][0]
    if "," in ingredients:
        ingredients = ingredients.split(",")
    author = fetch("recipes", "id = ?", "author", (rid,))[0][0]
    difficulty = fetch("recipes", "id = ?", "difficulty", (rid,))[0][0]
    instructions = fetch("recipes", "id = ?", "instructions", (rid,))[0][0]
    if author != session['username']:
        return redirect("/")
#if no pic, leave alone
#take code from create
#if map not clicked, leave alone
#add map to recipes?
    return render_template("edit.html", description = description, name = name, ings = ingredients, author = author, difficulty = difficulty, instructions = instructions)


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


@app.route("/profile/<pid>")
def profile(pid):
    if "username" not in session:
        return redirect("/login")
    db = get_db()
    c = db.cursor()
    c.execute ("""
        SELECT id, name, description, pic, difficulty, author
        FROM recipes
        WHERE author = ?
    """, (pid,))
    recipes = c.fetchall()
    db.close()
    return render_template ("profile.html", user=pid, recipes=recipes)




def fetch(table, criteria, data, params=()):
    db = get_db()
    c = db.cursor()
    query = f"SELECT {data} FROM {table} WHERE {criteria}"
    c.execute(query, params)
    data = c.fetchall()
    db.commit()
    db.close()
    return data

foodss = {
    "taco": "mexican", "tacos": "mexican", "burrito": "mexican", "mexican": "mexican",
    "sushi": "sushi", "ramen": "ramen", "japanese": "japanese",
    "pizza": "italian", "italian": "italian", "pasta": "italian",
    "burger": "burger", "burgers": "burger", "american": "american",
    "chinese": "chinese", "noodle": "chinese", "noodles": "chinese", "dumpling": "chinese",
    "indian": "indian", "curry": "indian",
    "thai": "thai", "pad thai": "thai",
    "korean": "korean", "bbq": "barbecue", "barbecue": "barbecue",
    "mediterranean": "mediterranean", "falafel": "middle_eastern", "shawarma": "middle_eastern",
    "greek": "greek", "french": "french", "vietnamese": "vietnamese", "pho": "vietnamese",
    "sandwich": "sandwich", "salad": "salad", "vegan": "vegan", "vegetarian": "vegetarian",
    "seafood": "seafood", "fish": "seafood", "chicken": "chicken",
}

@app.route("/api/nearby", methods=["GET"])
def nearby():
    if "username" not in session:
        return redirect("/")

    query = request.args.get("query", "").strip().lower()
    lat = request.args.get("lat", "")
    lg = request.args.get("lng", "")

    if not query or not lat or not lg:
        return jsonify([])
    radius = 5000
    cuisine = foodss.get(query)
    if cuisine:
        rf = f'["amenity"="restaurant"]["cuisine"="{cuisine}"]'
        fff = f'["amenity"="fast_food"]["cuisine"="{cuisine}"]'
    else:
        rf = '["amenity"="restaurant"]'
        fff = '["amenity"="fast_food"]'

    oq = f"""
    [out:json][timeout:10];
    (
    node{rf}(around:{radius},{lat},{lg});
    node{fff}(around:{radius},{lat},{lg});
    node["shop"="supermarket"](around:{radius},{lat},{lg});
    node["shop"="grocery"](around:{radius},{lat},{lg});
    );
    out body 20;
    """

    url = "https://overpass-api.de/api/interpreter"
    data = urllib.parse.urlencode({"data": oq}).encode()
    req = urllib.request.Request(url, data=data, headers={"User-Agent": "tacos-app/1.0"})

    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            result = json.loads(resp.read().decode())
    except Exception:
        return jsonify([])

    seen = set()
    places = []
    for e in result.get("elements", []):
        tags = e.get("tags", {})
        name = tags.get("name")
        if not name or name.lower() in seen:
            continue
        seen.add(name.lower())
        kind = tags.get("amenity") or tags.get("shop", "")
        pTyp = "restaurant" if kind in ("restaurant", "fast_food") else "grocery store"
        places.append({
            "name": name,
            "type": pTyp,
            "lat": e.get("lat"),
            "lng": e.get("lon"),
        })

    return jsonify(places[:15])


@app.route("/game", methods=["GET", "POST"])
def game():
    if "username" not in session:
        return redirect("/login")
    return render_template("game.html", username = session["username"])



if __name__=='__main__':
    app.debug = False
    app.run()

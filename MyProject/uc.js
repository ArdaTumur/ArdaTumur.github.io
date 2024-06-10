const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");

app.use(bodyParser());
app.use(express.json());
app.use(cors({
    "Access-Control-Allow-Origin": "*"
}));

mongoose.connect('mongodb://127.0.0.1:27017/boncuk').then(() => console.log("Connected"));

const userSchema = new mongoose.Schema({
    username: String,
    surname: String,
    email: String,
    phone: String,
    password: String
})

const movieSchema = new mongoose.Schema({
    name: String,
    year: String,
    imdb: String,
    director: String
})

const users = mongoose.model('users', userSchema);
const movies = mongoose.model("movies", movieSchema);

let isLoggedIn = false;
app.post("/register", async (req, res) => {
    if (req.body.name == null) { return res.status(400).send("Username not entered"); }

    if (req.body.password != req.body.rePassword) {
        return res.send("Confirmation password is invalid.");
    }
    const abc = await users.findOne({ email: req.body.email })
    if (!abc) {
        let hashPassword = crypto.MD5(req.body.password);
        let user = new users({
            username: req.body.name,
            surname: req.body.surname,
            phone: req.body.phoneNum,
            email: req.body.email,
            password: hashPassword
        });
        const newUser = await user.save();

        return res.json({
            _id: newUser._id
        })
    } else {
        return res.status(409).send("This username is already taken.");
    }
})

app.post("/login", async (req, res) => {
    let hashPassword = crypto.MD5(req.body.password);
    const user = await users.findOne({ email: req.body.email, password: hashPassword });
    if (isLoggedIn) {
        res.json({
            message: "already logged in"
        })
    }
    else if (user) {
        var token = await jwt.sign({ email: req.body.email }, "4t3şl1_p4tl1c4n", {
            expiresIn: "1h"
        });
        res.json({
            token: token
        });
    }
    else {
        res.json({
            message: "failed"
        })
    }
})

app.delete("/logout", async (req, res) => {
    isLoggedIn = false;
    res.json({
        message: "logged out"
    })
})

app.post("/movies", async (req, res) => {
    if (!jwt.verify(req.headers.token, "4t3şl1_p4tl1c4n")) { return res.status(409).send("UNAUTHORIZED") }
    if (!req.body.name) { return res.status(400).send("All fields must be filled") }
    if (!req.body.year) { return res.status(400).send("All fields must be filled") }
    if (!req.body.imdb) { return res.status(400).send("All fields must be filled") }
    if (!req.body.director) { return res.status(400).send("All fields must be filled") }

    let movie = new movies({
        name: req.body.name,
        year: req.body.year,
        imdb: req.body.imdb,
        director: req.body.director
    })

    const newMovie = await movie.save();

    return res.send(newMovie);
})
app.delete("/movies", async (req, res) => {
    if (!jwt.verify(req.headers.token, "4t3şl1_p4tl1c4n")) { return res.status(409).send("UNAUTHORIZED") }
    await movies.deleteOne(req.body)
    return res.send("Deleted " + req.body.name)
})
app.patch("/boncuk/:id", async (req, res) => {
    if (!jwt.verify(req.headers.token, "4t3şl1_p4tl1c4n")) { return res.status(409).send("UNAUTHORIZED") }
    if (!req.body.name) { return res.status(400).send("All fields must be filled") }
    if (!req.body.year) { return res.status(400).send("All fields must be filled") }
    if (!req.body.imdb) { return res.status(400).send("All fields must be filled") }
    if (!req.body.director) { return res.status(400).send("All fields must be filled") }
    await movies.updateOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
            name: req.body.name,
            year: req.body.year,
            imdb: req.body.imdb,
            director: req.body.director
        })
    return res.status(200).send("Updated " + req.params.id);
})
let value = 1;
app.get("/movies", async (req, res) => {
    value *= Number(req.query.sortOrder) || 1
    let sorter = {
        [req.query.sortBy || 'name']: value
    }
    try {
        if (!req.query.sortBy && !req.query.sortOrder) {
            return res.status(200).json(await movies.find({}))
        };

        if (jwt.verify(req.headers.token, "4t3şl1_p4tl1c4n")) {
            res.status(200).json(await movies.find({}).sort(sorter))
        }
    }
    catch (err) {
        console.log(err)
        res.status(409).send("Proivide valid login informations")
    }
})

app.get("/boncuk/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "not valid id" })
    }
    const movie = await movies.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

    res.status(200).json(movie);
})

app.listen(3001); 
/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Loveneet Kaur   Student ID: 150002210    Date: January 17th,2022
*  Cyclic Link:   https://lively-bonnet-duck.cyclic.app/
********************************************************************************/ 

const express = require("express");
const bodyparser = require("body-parser");
const app = express();
var cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
require('dotenv').config();

app.get("/", (req, res) => {
    res.json({ message: 'API Listening' });
});

app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/api/movies", (req, res) => {
    var page = req.query.page;
    var perPage = req.query.perPage;
    var title = req.query.title;
    db.getAllMovies(page, perPage, title).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/api/movies/:_id", (req, res) => {
    db.getMovieById(req.params._id).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.put("/api/movie/:_id", (req, res) => {
    db.updateMovieById(req.body, req.params._id).then((data) => {
        console.log("Successfully updated a movie!");
    }).catch((err) => {
        console.log(err);
    })
});

app.delete("/api/movies/:_id", (req, res) => {
    db.deleteMovieById(req.params._id).then((data) => {
        console.log("Successfully deleted a movie!");
    }).catch((err) => {
        console.log(err);
    })
});

app.use(function(req,res){
    res.status(404).send("Resource not found");
});

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT);
    }).catch((err) => {
        console.log(err);
    });
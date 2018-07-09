/* global __dirname */

const express = require("express");
const multer = require("multer");
const parse = require("csv-parse");
const MongoClient = require('mongodb').MongoClient;
const converter = require("./converter.js");
const isValid = require("./filter.js");

var upload = multer();
const app = express();

function a(req, res, next) {}

function b(req, res, next) {}

function c(req, res, next) {
    res.sendFile(`${__dirname}/public/index.html`);
}

function d(req, res, next) {
    var tsvData = req.file.buffer.toString();

    function e(err, output) {
        if (err) {
            throw new Error("tsv parser error");
        } else if (isValid(output[0])) {
            let docs = converter(output);

            function i(mongoClient) {
                return mongoClient.db().collection("cards").insertMany(docs);
            }

            function j(result) {
                console.log(result.result);
                res.send("good upload");
            }

            function k(error) {
                console.log("failed", error);
                res.send("bad upload");
            }

            MongoClient.connect("mongodb://localhost/flashcards").then(i).then(j).catch(k);
        } else {
            res.send("Invalid");
        }
    }
    parse(tsvData, {delimiter: "\t"}, e);
}

function f() {
    console.log("Started listening on port 3000!");
}

function g(req, res, next) {
    res.status(404).send("Sorry can't find that!");
}

function h(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
}

app.get("/", c);
app.get("/library", a);
app.get("/library/:bookId", b);
app.post("/library", upload.single("fileToUpload"), d);
app.use(express.static("public"));
app.use(g);
app.use(h);
app.listen(3000, f);
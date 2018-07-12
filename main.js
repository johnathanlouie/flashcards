/* global __dirname */

const express = require("express");
const multer = require("multer");
const parse = require("csv-parse");
const lodash = require("lodash");
const converter = require("./converter.js");
const isValid = require("./filter.js");
const db = require("./database.js");

const upload = multer();
const app = express();

function a(req, res, next) {}

function b(req, res, next) {}

function c(req, res, next) {
    res.sendFile(`${__dirname}/public/index.html`);
}

function d(req, res, next) {

    function e(error, vocabTsv) {

        function j(error, bookTsv) {

            function l(error, results) {
                if (error) {
                    res.json(error);
                } else {
                    res.json(results);
                }
            }

            function k(error, results) {
                if (error) {
                    res.json(error);
                } else {
                    var bookJson = converter(bookTsv)[0];
                    bookJson.chapters = Object.values(results.insertedIds);
                    console.log(bookJson);
                    db.insertOne("books", bookJson, l);
                }
            }

            function i(error, results) {
                if (error) {
                    res.json(error);
                } else {
                    var sorted = lodash.groupBy(results.ops, card => card.chapter);
                    var chapters = [];
                    for (let chapNum in sorted) {
                        chapters.push({ordinal: chapNum, vocab: sorted[chapNum].map(card => card._id)});
                    }
                    db.insertMany("chapters", chapters, k);
                }
            }

            if (error) {
                res.json(error);
            } else if (isValid(vocabTsv[0])) {
                db.insertMany("cards", converter(vocabTsv), i);
            } else {
                res.json({});
            }
        }

        if (error) {
            res.json(error);
        } else {
            parse(req.files.book[0].buffer.toString(), {delimiter: "\t"}, j);
        }
    }

    parse(req.files.vocab[0].buffer.toString(), {delimiter: "\t"}, e);
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
app.post("/library", upload.fields([{name: "book"}, {name: "vocab"}]), d);
app.use(express.static("public"));
app.use(g);
app.use(h);
app.listen(3000, f);
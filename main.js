/* global __dirname */

const express = require("express");
const multer = require("multer");
const parse = require("csv-parse");
const lodash = require("lodash");
const mongo = require("mongodb");
const converter = require("./converter.js");
const isValid = require("./filter.js");
const db = require("./database.js");

const upload = multer();
const app = express();

function serverMsg(code, msg, data) {
    return {code: code, msg: msg, data: data};
}

serverMsg.OK = 0;
serverMsg.ERROR = 1;
serverMsg.DB_CONNECTION_ERR = 2;
serverMsg.DB_READ_ERR = 3;
serverMsg.DB_WRITE_ERR = 4;

function a(req, res, next) {
    function x(error, documents) {
        if (error) {
            res.json(serverMsg(serverMsg.ERROR, ""));
        } else {
            res.json(serverMsg(serverMsg.OK, "", documents));
        }
    }
    db.find("books", {}, {chapters: 0}, x);
}

function b(req, res, next) {

    function y(error, result) {
        if (error) {
            res.json(serverMsg(serverMsg.ERROR, ""));
        } else {
            res.json(serverMsg(serverMsg.OK, "", result));
        }
    }

    function x(error, book) {
        if (error) {
            res.json(serverMsg(serverMsg.ERROR, ""));
        } else {
            db.find("chapters", {_id: {$in: book.chapters}}, {ordinal: 1}, y);
        }
    }

    db.findOne("books", {_id: new mongo.ObjectID(req.params.bookId)}, {chapters: 1}, x);
}

function c(req, res, next) {
    res.sendFile(`${__dirname}/public/index.html`);
}

function d(req, res, next) {

    function e(error, vocabTsv) {

        function j(error, bookTsv) {

            function l(error, results) {
                if (error) {
                    res.json(serverMsg(serverMsg.ERROR, ""));
                } else {
                    res.json(serverMsg(serverMsg.OK, "", results));
                }
            }

            function k(error, results) {
                if (error) {
                    res.json(serverMsg(serverMsg.ERROR, ""));
                } else {
                    var bookJson = converter(bookTsv)[0];
                    bookJson.chapters = Object.values(results.insertedIds);
                    console.log(bookJson);
                    db.insertOne("books", bookJson, l);
                }
            }

            function i(error, results) {
                if (error) {
                    res.json(serverMsg(serverMsg.ERROR, ""));
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
                res.json(serverMsg(serverMsg.ERROR, ""));
            } else if (isValid(vocabTsv[0])) {
                db.insertMany("cards", converter(vocabTsv), i);
            } else {
                res.json(serverMsg(serverMsg.ERROR, ""));
            }
        }

        if (error) {
            res.json(serverMsg(serverMsg.ERROR, ""));
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
    res.status(500).json(serverMsg(serverMsg.ERROR, ""));
}

function i(req, res, next) {

    function y(error, result) {
        if (error) {
            res.json(serverMsg(serverMsg.ERROR, ""));
        } else {
            res.json(serverMsg(serverMsg.OK, "", result));
        }
    }

    function x(error, chapter) {
        if (error) {
            res.json(serverMsg(serverMsg.ERROR, ""));
        } else {
            db.find("cards", {_id: {$in: chapter.vocab}}, {}, y);
        }
    }

    db.findOne("chapters", {_id: new mongo.ObjectID(req.params.chapterId)}, {vocab: 1}, x);
}

app.get("/", c);
app.get("/library", a);
app.get("/library/book/:bookId", b);
app.get("/library/chapter/:chapterId", i);
app.post("/library", upload.fields([{name: "book"}, {name: "vocab"}]), d);
app.use(express.static("public"));
app.use(g);
app.use(h);
app.listen(3000, f);
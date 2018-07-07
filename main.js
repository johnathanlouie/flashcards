/* global __dirname */

const express = require("express");
const multer = require("multer");
const parse = require("csv-parse");
const converter = require("./converter.js");

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
        } else {
            res.send(JSON.stringify(converter(output)));
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
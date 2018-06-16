/* global __dirname */

const express = require("express");
const multer = require("multer");
const parse = require("csv-parse");
const converter = require("./converter.js");
var upload = multer();
const app = express();

function a(req, res) {}

function b(req, res) {}

function c(req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
}

function d(req, res) {
    var tsvData = req.file.buffer.toString();
    function e(err, output) {
        console.log(output[0]);
        res.send("");
    }
    parse(tsvData, {delimiter: "\t"}, e);
}

function f() {
    console.log("Started listening on port 3000!");
}

function g(req, res, next) {
    res.status(404).send("Sorry can't find that!");
    next();
}

function h(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    next();
}

app.get("/library", a);
app.get("/library/:bookId", b);
app.post("/library", upload.single("fileToUpload"), d);
app.get("/", c);
app.use(express.static("public"));
app.use(g);
app.use(h);

app.listen(3000, f);
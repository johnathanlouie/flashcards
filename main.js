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
    parse(tsvData, {delimiter: "\t"}, e);
    res.send("");
}

function e(err, output) {
    console.log(output[0]);
}

function f() {
    console.log("Started listening on port 3000!");
}

app.get("/library", a);

app.get("/library/:bookId", b);

app.post("/library", upload.single("fileToUpload"), d);

app.get("/", c);

app.use(express.static("client"));

app.listen(3000, f);
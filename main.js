/* global __dirname */

const express = require("express");
const multer = require("multer");
const parse = require("csv-parse");
const converter = require("./server/converter.js");
var upload = multer();
const app = express();

function a(req, res) {}

app.get("/library", a);

function b(req, res) {}

app.get("/library/:bookId", b);

function e(err, output) {
    console.log(output[0]);
}

function d(req, res) {
    var tsvData = req.file.buffer.toString();
    parse(tsvData, {delimiter: "\t"}, e);
    res.send("");
}

app.post("/library", upload.single("fileToUpload"), d);

function c(req, res) {
    res.sendFile(`${__dirname}/client/index.html`);
}

app.get("/", c);

app.use(express.static("client"));

function f() {
    console.log("Started listening on port 3000!");
}

app.listen(3000, f);
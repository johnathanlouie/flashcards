/* global __dirname */

const express = require("express");
const app = express();

app.get("/library", function (req, res) {});
app.get("/library/:bookId", function (req, res) {});

app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/client/index.html`);
});

app.use(express.static("client"));

app.listen(3000, function () {
    console.log("Started listening on port 3000!");
});
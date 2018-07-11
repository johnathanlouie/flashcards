const MongoClient = require("mongodb").MongoClient;

const MONGODB_URL = "mongodb://localhost/flashcards";

var database = {};

database.insertMany = function (collection, data, callback) {
    function a1(client) {

        function b1(result) {
            callback(undefined, result);
        }

        function b2(error) {
            callback(error);
        }

        function c() {
            return client.close();
        }

        return client.db().collection(collection).insertMany(data).then(b1, b2).then(c);
    }

    function a2(error) {
        callback(error);
    }

    MongoClient.connect(MONGODB_URL).then(a1, a2);
};

module.exports = database;
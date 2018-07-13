const MongoClient = require("mongodb").MongoClient;

const MONGODB_URL = "mongodb://localhost/flashcards";

var database = {};

database.find = function (collection, query, callback) {

    function a1(client) {

        function b(error, documents) {
            if (error) {
                callback(error);
            } else {
                callback(undefined, documents);
            }
            client.close();
        }

        client.db().collection(collection).find(query).toArray(b);
    }

    function a2(error) {
        callback(error);
    }

    MongoClient.connect(MONGODB_URL).then(a1, a2);
};

database.insertOne = function (collection, data, callback) {

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

        return client.db().collection(collection).insertOne(data).then(b1, b2).then(c);
    }

    function a2(error) {
        callback(error);
    }

    MongoClient.connect(MONGODB_URL).then(a1, a2);
};

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
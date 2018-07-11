const MongoClient = require("mongodb").MongoClient;

const MONGODB_URL = "mongodb://localhost/flashcards";

var database = {};

database.insertMany = function (collection, data, callback) {
    function i(mongoClient) {
        return mongoClient.db().collection(collection).insertMany(data);
    }

    function j(result) {
        callback(undefined, result);
    }

    function k(error) {
        callback(error);
    }

    MongoClient.connect(MONGODB_URL).then(i).then(j).catch(k);
};

module.exports = database;
/* eslint-disable no-console */
/* eslint-disable no-undef */
var mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
require('dotenv').load();
const dbName = process.env.db_name;
const collectionName = process.env.order_collection_name;
const product_collectionName = process.env.product_collection_name;
var url = process.env.mongo_url;

const product_model = require('./product.model');

var findAllDocuments = function (db, callback) {
    var collection = db.collection(collectionName)
    // bad way of doing it
    /* collection.find().toArray(function(err,docs){
        console.log(docs);
        callback;
    }); */
    // better way of making calls .... cannot have projection with 1 and 0 values except for _id
    //var stream = collection.find({},{projection:{symbol:1,_id:0,date:0}}).stream();  ... does not work
    var stream = collection.find({}, { projection: { symbol: 1, _id: 0 } }).stream();
    var data = [];
    stream.on("data", function (item) { console.log(item); data.push(item) });
    stream.on("end", function () { return callback(data) });
}
module.exports.findAllOrders = function (req, res) {
    //changes in mongodb driver ^3.0
    mongoClient.connect(url, function (err, client) {
        findAllDocuments(client.db(dbName), function (data) {
            client.close();
            res.send(data);
        });

    });
}



var create = function (document, db, callback) {
    var collection = db.collection(collectionName);
    var product = document.product;
   // connectToProducts(product);
    collection.insert(document, { w: 1 }, function (err, result) {
        if (err === null)
            callback(result);
        else return callback(err);
    });

}
module.exports.createOrder = function (req, res) {

    mongoClient.connect(url, function (err, client) {
        create(req.body, client.db(dbName), function (result) {
            client.close();
            res.send(result);
        });
    });
}




/* eslint-disable no-console */
/* eslint-disable no-undef */

var mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
require('dotenv').load();
const dbName = process.env.db_name;
const collectionName = process.env.product_collection_name;
var url = process.env.mongo_url;
// takes too long need to fix
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
module.exports.findAll = function (req, res) {
    //changes in mongodb driver ^3.0
    mongoClient.connect(url, function (err, client) {
        findAllDocuments(client.db(dbName), function (data) {
            client.close();
            res.send(data);
        });

    });
}
var findByKey = function (query, db, callback) {
    var collection = db.collection(collectionName);
    var stream = collection.find(query).stream();
    var data = [];
    stream.on('data', function (item) {
        console.log(item);
        data.push(item);
    })
    stream.on('end', function () {
        return callback(data);
    })
}


module.exports.findByKey = function (req, res) {
    var query = {};
    query[req.params.key] = req.params.val;
    
    mongoClient.connect(url, function (err, client) {
        findByKey(query, client.db(dbName), function (data) {
            client.close();
            res.send(data);
        });
    });

}
var create = function (document, db, callback) {
    var collection = db.collection(collectionName);
    collection.insert(document, { w: 1 }, function (err, result) {
        if (err === null)
            callback(result);
        else return callback(err);
    });

}
module.exports.create = function (req, res) {

    mongoClient.connect(url, function (err, client) {
        create(req.body, client.db(dbName), function (result) {
            client.close();
            res.send(result);
        });
    });
}

var deleteByKey = function (key, val, db, callback) {
    var collection = db.collection(collectionName);
    var query = {};
    query[key] = val;
    collection.remove(query, { w: 1 }, function (err, result) {

        if (err !== null) {
            //console.log('failed to delete');
            callback(err);
        }
        else {
            callback(result);
        }
    });

}
module.exports.delete = function (req, res) {
    mongoClient.connect(url, function (err, client) {
        if (err !== null)
            res.send('could not connect to MongoDB server');
        deleteByKey(req.params.key, req.params.val, client.db(dbName), function (result) {
            client.close();
            res.send(result);
        })

    });

}

var update = function (productName,col, db, callback) {
    var collection = db.collection(collectionName);
    var query = {};
    query['product'] = productName;
    
    collection.updateOne(query, { $set:  col  },  function (err, result) {
        if (err === null) {
            callback(result);
        }
        else
            callback(err);
    })

}


module.exports.update = function (req, res) {
    mongoClient.connect(url, function (err, client) {
        //console.log(req.body);
        //console.log(err);
        if (err === null) {
            update(req.params.product, req.body, client.db(dbName), function (result) {
                client.close();
                res.send(result);
            });
        }
    });



}
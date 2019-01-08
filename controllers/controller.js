/* eslint-disable no-undef */
const product_model = require('../models/product.model');
const order_model = require('../models/order.model');
exports.test = function (req, res) {
    res.send('greetings from test controller');
}


exports.findAllProducts = function (req, res) {
    product_model.findAll(req, res);
}

exports.findByKeyProducts = function (req, res) {
    product_model.findByKey(req,res);
}

exports.createProduct= function(req,res){
    product_model.create(req,res);
}

exports.updateProduct = function(req,res){
    product_model.update(req,res);
}

exports.deleteProduct = function(req,res){
    product_model.delete(req,res);
}


exports.findAllOrders = function (req, res) {
    order_model.findAllOrders(req, res);
}


exports.createOrder= function(req,res){
    order_model.createOrder(req,res);
}




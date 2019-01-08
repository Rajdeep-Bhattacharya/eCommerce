/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

//all routes start with /products/
router.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});
router.get('/test', controller.test);
router.get('/findAllProducts', controller.findAllProducts);
router.get('/findByKeyProducts/:key/:val', (req, res) => {
    controller.findByKeyProducts(req, res);
});

router.post('/createProduct', controller.createProduct);
router.post('/updateProduct/:product', controller.updateProduct);
router.get('/deleteByKeyProduct/:key/:val', controller.deleteProduct);

router.post('/createOrder',controller.createOrder);
router.get('/findAllOrder',controller.findAllOrders);


module.exports = router;
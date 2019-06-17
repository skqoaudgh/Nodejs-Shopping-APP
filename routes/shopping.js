const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    if(!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    const cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/add-to-cart/:id', async (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
  
    const product = await Product.findById(productId);
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect('/');
});

router.get('/reduce/:id', (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping');
});

router.get('/remove/:id', (req, res, next) => {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping');
});

module.exports = router;
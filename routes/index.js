const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const Product = require('../models/product');


isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

/* GET home page. */
router.get('/', (req, res, next) => {
  const successMsg = req.flash('success')[0];
  Product.find((err, products) => {
    let productChunks = [];
    const chunkSize = 3;
    for(let i=0; i<products.length; i+=chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', async (req, res, next) => {
  const productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  const product = await Product.findById(productId);
  cart.add(product, product.id);
  req.session.cart = cart;
  res.redirect('/');
});

router.get('/shopping-cart', (req, res, next) => {
  if(!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/reduce/:id', (req, res, next) => {
  const productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', (req, res, next) => {
  const productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

module.exports = router;
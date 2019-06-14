var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find((err, products) => {
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0; i<products.length; i+=chunkSize) {
      productChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if(err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];

  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  const stripe = require('stripe')('sk_test_APKRsqZ3qyn9Hqsf5wkOz6A3006JMtLXVt');

  (async () => {
    const charge = await stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'usd',
      description: "Test Charge",
      source: req.body.stripeToken,
    }, function(err, charge) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      req.flash('success', 'Successfully bought product!!');
      req.session.cart = null;
      res.redirect('/');
    });
  })();
});

module.exports = router;

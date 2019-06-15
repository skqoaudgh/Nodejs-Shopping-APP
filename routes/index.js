const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

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

router.get('/checkout', isLoggedIn, (req, res, next) => {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];

  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, async (req, res, next) => {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);

  const stripe = require('stripe')('sk_test_APKRsqZ3qyn9Hqsf5wkOz6A3006JMtLXVt');

  (async () => {
    const charge = await stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'usd',
      description: "Test Charge",
      source: req.body.stripeToken,
    })
    .then(async (charge) => {
      const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
      });
      try {
        await order.save();
        req.flash('success', 'Successfully bought product!!');
        req.session.cart = null;
        res.redirect('/');        
      }
      catch(err) {
        res.redirect('/');
      }
    })
    .catch(err => {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    });
  })();
});

module.exports = router;
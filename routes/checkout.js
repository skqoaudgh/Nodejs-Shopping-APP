const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const Cart = require('../models/cart');

router.get('/', isLoggedIn, (req, res, next) => {
    if(!req.session.cart) {
      return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);
    const errMsg = req.flash('error')[0];
  
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});
  
router.post('/', isLoggedIn, async (req, res, next) => {
    if(!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    console.log(1);

    const cart = new Cart(req.session.cart);
    const stripe = require('stripe')('sk_test_APKRsqZ3qyn9Hqsf5wkOz6A3006JMtLXVt');

    (async () => {
        const charge = await stripe.charges.create({
            amount: cart.totalPrice * 100,
            currency: 'usd',
            description: "Test Charge",
            source: req.body.stripeToken,
        });
        const order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        await order.save();
        req.flash('success', 'Successfully bought product!!');
        req.session.cart = null;
        res.redirect('/');
    })();
});

module.exports = router;

const express = require('express');
const router = express.Router();

const Product = require('../models/product');

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

module.exports = router;
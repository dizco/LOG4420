const express = require('express');
const router = express.Router();
const { body, checkSchema } = require('express-validator/check');

const Product = require('../lib/product');

//Get all products
router.get('/', (req, res) => {
  Product.find({})
    .then((products) =>  res.json(products))
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({success: false, error: err})
    });
});

//Get product by id
router.get('/:id', (req, res) => {
  Product.find({id: req.params.id})
    .then((products) => {
      if (products && products.length > 0) {
        res.json(products[0]);
      }
      res.status(404).json({success: false, error: 'Product not found'});
    })
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({success: false, error: err})
    });
});

//Create new product
router.post("/", (req, res) => {
  let product = new Product({
    ...req.body
  });
  product.save((err) => {
    if (err) {
      throw err;
    }
    res.json({success: true});
  });
});

//Delete product by id
router.delete('/:id', (req, res) => {
  Product.findOneAndRemove({id: req.params.id})
    .then(() => res.json({success: true}))
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({success: false, error: err})
    });
});

//Delete all products
router.delete('/', (req, res) => {
  Product.remove({})
    .then(() => res.json({success: true}))
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({success: false, error: err})
    });
});

module.exports = router;

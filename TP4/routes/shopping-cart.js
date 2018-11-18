const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const Product = require('../lib/product');
const checkValidationResult = require('../lib/check-validation-result');

//Get all items in the shopping-cart
router.get('/', (req, res) => {
  res.json(req.session.shoppingCart || []);
});

//Get a product by id
router.get('/:productId', (req, res) => {
  req.session.shoppingCart = req.session.shoppingCart || [];
  const item = req.session.shoppingCart.find(item => item.productId === parseInt(req.params.productId));
  if (item) {
    res.json(item);
  }
  else {
    res.status(404).json({ success: false, error: 'Page non trouvée!' });
  }
});

//Add an item in the shopping cart
router.post('/', [
  body('productId').isInt().withMessage('Product id must be an integer')
    .custom((value, { req }) => {
      if (req.session.shoppingCart && req.session.shoppingCart.find(item => item.productId === value)) {
        return Promise.reject('Product is already in shopping cart');
      }
      return Promise.resolve();
    })
    .custom(value => {
      return Product.find({ id: value })
        .then(product => {
          if (!product || product.length === 0) {
            return Promise.reject('Product id does not exist');
          }
        })
    }),
  body('quantity').isInt({ min: 1 }).withMessage('Product quantity must be an integer greater than 0'),
], checkValidationResult, (req, res) => {
  req.session.shoppingCart = req.session.shoppingCart || [];
  req.session.shoppingCart.push({ productId: req.body.productId, quantity: req.body.quantity });
  res.status(201).json({ success: true });
});

//Change quantity of a product in the shopping cart
router.put('/:productId', [
  body('quantity').isInt({ min: 1 }).withMessage('Product quantity must be an integer greater than 0'),
], checkValidationResult, (req, res) => {
  req.session.shoppingCart = req.session.shoppingCart || [];
  const item = req.session.shoppingCart.find(item => item.productId === parseInt(req.params.productId));
  if (item) {
    item.quantity = req.body.quantity;
    return res.status(204).send();
  }
  else {
    res.status(404).json({ success: false, error: 'Page non trouvée!' });
  }
});

//Remove an item by id
router.delete('/:productId', (req, res) => {
  req.session.shoppingCart = req.session.shoppingCart || [];
  const itemIndex = req.session.shoppingCart.findIndex(item => item.productId === parseInt(req.params.productId));
  if (itemIndex !== -1) {
    req.session.shoppingCart.splice(itemIndex, 1);
    res.status(204).send();
  }
  else {
    res.status(404).json({ success: false, error: 'Page non trouvée!' });
  }
});

//Remove all items from the shopping cart
router.delete('/', (req, res) => {
  req.session.shoppingCart = [];
  res.status(204).send();
});

module.exports = router;

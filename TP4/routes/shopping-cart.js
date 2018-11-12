const express = require('express');
const router = express.Router();

//Get all items in the shopping-cart
router.get('/', (req, res) => {
  res.json({});
});

//Get a product by id
router.get('/:productId', (req, res) => {
  res.json({});
});

//Add an item in the shopping cart
router.post('/', (req, res) => {
  res.json({});
});

//Change quantity of a product in the shopping cart
router.put('/:productId', (req, res) => {
  res.json({});
});

//Remove an item by id
router.delete('/:productId', (req, res) => {
  res.json({});
});

//Remove all items from the shopping cart
router.delete('/', (req, res) => {
  res.json({});
});

module.exports = router;

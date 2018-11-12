const express = require('express');
const router = express.Router();

//Get all orders
router.get('/', (req, res) => {
  res.json({});
});

//Get order by id
router.get('/:id', (req, res) => {
  res.json({});
});

//Create new order
router.post('/', (req, res) => {
  res.json({});
});

//Delete order by id
router.delete('/:id', (req, res) => {
  res.json({});
});

//Delete all orders
router.delete('/', (req, res) => {
  res.json({});
});

module.exports = router;

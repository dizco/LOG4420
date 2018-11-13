const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator/check');
const Product = require('../lib/product');
const QueryError = require('../lib/query-error');
const checkValidationResult = require('../lib/check-validation-result');

//Get all products
router.get('/', [
  query('category').optional().isIn(['cameras', 'computers', 'consoles', 'screens']).withMessage('Category must be one of: cameras, computers, consoles, screens'),
  query('criteria').optional().isIn(['alpha-asc', 'alpha-dsc', 'price-asc', 'price-dsc']).withMessage('Criteria must be one of: alpha-asc, alpha-dsc, price-asc, price-dsc'),
], checkValidationResult, (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  let sort = { price: 1 };
  switch (req.query.criteria) {
    case 'alpha-asc':
      sort = { name: 1 };
      break;
    case 'alpha-dsc':
      sort = { name: -1 };
      break;
    case 'price-dsc':
      sort = { price: -1 };
      break;
  }
  Product.find(filter, { _id: 0 })
    .collation({ locale:'en', strength: 2 })
    .sort(sort)
    .then((products) =>  res.json(products))
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({ success: false, error: err })
    });
});

//Get product by id
router.get('/:id', (req, res) => {
  findProductById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => {
      console.error('Error fetching product by id', err);
      res.status(err.statusCode || 500).json({ success: false, error: err.message })
    });
});

//Create new product
router.post('/', [
  body('id').isInt().withMessage('Id must be an integer').custom(value => {
    return Product.find({ id: value })
      .then(product => {
        if (product && product.length > 0) {
          return Promise.reject('Id already in use');
        }
      });
  }),
  body('name').isString().withMessage('Name must be a string').isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('price').isNumeric().withMessage('Price must be numeric'),
  body('image').isString().withMessage('Image must be a string').isLength({ min: 1 }).withMessage('Image cannot be empty'),
  body('category').isIn(['cameras', 'computers', 'consoles', 'screens']).withMessage('Category must be one of: cameras, computers, consoles, screens'),
  body('description').isString().withMessage('Description must be a string').isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('features').isArray().withMessage('Features must be an array'),
  body('features.*').isString().withMessage('Features must be strings').isLength({ min: 1}).withMessage('A feature cannot be empty'),
], checkValidationResult, (req, res) => {
  let product = new Product({
    ...req.body
  });
  product.save((err) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ success: true });
  });
});

//Delete product by id
router.delete('/:id', (req, res) => {
  findProductById(req.params.id)
    .then((product) => {
      product.remove()
        .then(() => res.status(204).send())
        .catch((err) => {
          console.error('Error deleting product by id', err);
          res.status(err.statusCode || 500).json({ success: false, error: err.message })
        });
    })
    .catch((err) => {
      console.error('Error fetching product by id', err);
      res.status(err.statusCode || 500).json({ success: false, error: err.message })
    });
});

//Delete all products
router.delete('/', (req, res) => {
  Product.remove({})
    .then(() => res.status(204).send())
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({ success: false, error: err })
    });
});

function findProductById(id) {
  return Product.find({ id: id }, { _id: 0 })
    .sort({ 'id': 1 })
    .limit(1)
    .then((products) => {
      if (products && products.length > 0) {
        return products[0];
      }
      throw new QueryError('Product not found', 404);
    });
}

module.exports = router;

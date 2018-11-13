const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const Order = require('../lib/order');
const Product = require('../lib/product');
const QueryError = require('../lib/query-error');
const checkValidationResult = require('../lib/check-validation-result');

//Get all orders
router.get('/', (req, res) => {
  Order.find({}, { _id: 0 })
    .then((orders) =>  res.json(orders))
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({ success: false, error: err });
    });
});

//Get order by id
router.get('/:id', (req, res) => {
  findOrderById(req.params.id, true)
    .then((order) => res.json(order))
    .catch((err) => {
      console.error('Error fetching order by id', err);
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    });
});

//Create new order
router.post('/', [
  body('id').isInt().withMessage('Id must be an integer').custom(value => {
    return Order.find({ id: value })
      .then(order => {
        if (order && order.length > 0) {
          return Promise.reject('Id already in use');
        }
      });
  }),
  body('firstName').isString().withMessage('First name must be a string').isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').isString().withMessage('Last name must be a string').isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('email').isEmail(),
  body('phone').matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).withMessage('Phone number must be valid'), //See https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s02.html
  body('products').isArray().withMessage('Products must be an array'),
  body('products.*.id').isInt().withMessage('Product id must be an integer').custom(value => {
    return Product.find({ id: value })
      .then(product => {
        if (!product || product.length === 0) {
          return Promise.reject('Product id does not exist');
        }
      })
  }),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Product quantity must be an integer greater than 0'),
], checkValidationResult, (req, res) => {
  let order = new Order({
    ...req.body
  });
  order.save((err) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ success: true });
  });
});

//Delete order by id
router.delete('/:id', (req, res) => {
  findOrderById(req.params.id)
    .then((order) => {
      order.remove()
        .then(() => res.status(204).send())
        .catch((err) => {
          console.error('Error deleting order by id', err);
          res.status(err.statusCode || 500).json({ success: false, error: err.message });
        });
    })
    .catch((err) => {
      console.error('Error fetching order by id', err);
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    });
});

//Delete all orders
router.delete('/', (req, res) => {
  Order.remove({})
    .then(() => res.status(204).send())
    .catch((err) => {
      console.error('Error executing mongoose', err);
      res.json({ success: false, error: err });
    });
});

function findOrderById(id, removeObjectId = false) {
  const projection = (removeObjectId) ? { _id: 0 } : {};
  return Order.find({ id: id }, projection)
    .sort({ 'id': 1 })
    .limit(1)
    .then((orders) => {
      if (orders && orders.length > 0) {
        return orders[0];
      }
      throw new QueryError('Order not found', 404);
    });
}

module.exports = router;

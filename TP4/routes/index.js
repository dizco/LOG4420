const express = require('express');
const router = express.Router();
const Product = require('../lib/product');
const Order = require('../lib/order');
const QueryError = require('../lib/query-error');
const request = require('request');
const { body } = require('express-validator/check');
const checkValidationResult = require('../lib/check-validation-result');

router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/accueil', (req, res) => {
  res.render('index', { title: 'Accueil', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/produits', (req, res) => {
  loadProducts().then((products) => {
    res.render('products', { title: 'Produits', cartCount: countCart(req.session.shoppingCart), products: products, priceFn: formatPrice, error: false });
  })
    .catch((err) => {
      res.render('products', { title: 'Produits', cartCount: countCart(req.session.shoppingCart), products: [], priceFn: formatPrice, error: true });
    });
});

router.get('/produits/:id', (req, res) => {
  loadProductById(req.params.id, true).then((product) => {
    res.render('product', { title: 'Produit', cartCount: countCart(req.session.shoppingCart), product: product, priceFn: formatPrice });
  })
    .catch((err) => {
      res.render('error', { error: err });
    });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/panier', (req, res) => {
  loadShoppingCart(req.session.shoppingCart).then((sortedCart) => {
    res.render('shopping-cart', { title: 'Panier', cartCount: countCart(req.session.shoppingCart), cart: sortedCart, cartTotal: cartTotal(sortedCart), priceFn: formatPrice });
  })
    .catch((err) => {
      res.render('error', { error: err });
    });

});

router.get('/commande', (req, res) => {
  if (countCart(req.session.shoppingCart) < 1) {
    res.redirect('/panier');
  }
  else {
    res.render('order', { title: 'Commande', cartCount: countCart(req.session.shoppingCart) });
  }
});

router.get('/confirmation', (req, res) => {
  res.redirect('/panier');
});

router.post('/confirmation', (req, res) => {
  getLastOrder(req.body['first-name'], req.body['last-name']).then((order) => {
    res.render('confirmation', { title: 'Confirmation', cartCount: countCart(req.session.shoppingCart), name: order.firstName + " " + order.lastName, number: order.id });
  })
    .catch((err) => {
      res.render('error', { error: err });
    });
});

function countCart(cart) {
  let count = 0;
  if (cart) {
    cart.forEach(element => {
      count += element.quantity;
    });
  }
  return count;
}

function cartTotal(cart) {
  let total = 0;
  if (cart) {
    cart.forEach(element => {
      total += element.quantity * element.price;
    })
  }
  return total;
}

function loadProducts() {
  return Product.find({}, { _id: 0 })
    .collation({ locale: 'en', strength: 2 })
    .sort({ price: 1 })
    .then((products) => { return products; })
    .catch((err) => { console.error('Error executing mongoose', err); throw err; });
}

function loadProductById(id, removeObjectId = false) {
  const projection = (removeObjectId) ? { _id: 0 } : {};
  return Product.find({ id: id }, projection)
    .sort({ 'id': 1 })
    .limit(1)
    .then((products) => {
      if (products && products.length > 0) {
        return products[0];
      }
      throw new QueryError('Page non trouvée!', 404);
    });
}

function loadShoppingCart(shoppingCart) {
  return validateShoppingCart(shoppingCart).then((products) => {
    products.forEach((product) => {
      corresponding = shoppingCart.find((shopProduct) => shopProduct.productId == product.id);
      if (corresponding) {
        product.quantity = corresponding.quantity;
      }
      else {
        product.quantity = 0;
      }
    });

    return products.sort((a, b) => { return a.name.localeCompare(b.name) });

  })
    .catch((err) => {
      console.error('Error loading products in cart', err); throw err;
    });
}

function validateShoppingCart(shoppingCart) {
  let promises = [];
  if (shoppingCart) {
    shoppingCart.forEach((item) => {
      const promise = loadProductById(item.productId, true);
      promises.push(promise);
    });
  }
  return Promise.all(promises);
}

function getLastOrder(firstname, lastname) {
  return Order.find({ firstName: firstname, lastName: lastname }, {})
    .sort({ $natural: -1 })
    .limit(1)
    .then((orders) => {
      if (orders && orders.length > 0) {
        return orders[0];
      }
      throw new QueryError('Order not found', 404);
    });
}

function formatPrice(price) {
  return price.toFixed(2).replace(".", ",") + "&thinsp;$"
}

module.exports = router;

//const request = require('request');
const express = require('express');
const router = express.Router();
const Product = require('../lib/product');
const QueryError = require('../lib/query-error');

router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/accueil', (req, res) => {
  res.render('index', { title: 'Accueil', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/produits', (req, res) => {
  loadProducts().then((products) => {
    res.render('products', { title: 'Produits', cartCount: countCart(req.session.shoppingCart), products: products, priceFn: formatPrice, error:false });
  })
  .catch((err) => {
    res.render('products', { title: 'Produits', cartCount: countCart(req.session.shoppingCart), products: [], priceFn: formatPrice, error:true });
  });
});

router.get('/produits/:id', (req, res) => {
  loadProductById(req.params.id, true).then((product) => {
    res.render('product', { title: 'Produit', cartCount: countCart(req.session.shoppingCart), product: product, priceFn : formatPrice});
  })
  .catch((err) => {
    res.render('error', {error: err});
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/panier', (req, res) => {
  loadShoppingCart(req.session.shoppingCart).then((sortedCart) => {
    res.render('shopping-cart', { title: 'Panier', cartCount: countCart(req.session.shoppingCart), cart: sortedCart, priceFn: formatPrice });
  })
  .catch((err) => {
    res.render('shopping-cart', { title: 'Panier', cartCount: countCart(req.session.shoppingCart), cart: [], priceFn: formatPrice });
  });
  
});

router.get('/commande', (req, res) => {
  res.render('order', { title: 'Commande', cartCount: countCart(req.session.shoppingCart) });
});

// Attention à changer ça en POST comme du monde
router.get('/confirmation', (req, res) => {
  res.render('confirmation', { title: 'Confirmation', cartCount: countCart(req.session.shoppingCart) });
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
      throw new QueryError('Product not found', 404);
    });
}

function loadShoppingCart(shoppingCart) {
  let promises = [];
  if (shoppingCart)
  {
    shoppingCart.forEach((item) => {
      const promise = loadProductById(item.productId, true);
      promises.push(promise);
    });
  }
  return Promise.all(promises).then((products) => {
    products.forEach((product) => {
      corresponding = shoppingCart.find((shopProduct) => shopProduct.productId == product.id);
      if (corresponding)
      {
        product.quantity = corresponding.quantity;
      }
      else
      {
        product.quantity = 0;
      }
    });

    return products.sort((a, b) => { return a.name.localeCompare(b.name) });

  })
  .catch((err) => {
    console.error('Error validating products in cart', err); throw err;
  });
}

function formatPrice(price)
{
  return price.toFixed(2).replace(".", ",") + "&thinsp;$"
}

module.exports = router;

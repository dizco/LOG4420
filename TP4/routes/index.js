//const request = require('request');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/accueil', (req, res) => {
  res.render('index', { title: 'Accueil', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/produits', (req, res) => {
  res.render('products', { title: 'Produits', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/produits/:id', (req, res) => {
  res.render('product', { title: 'Produit', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/panier', (req, res) => {
  res.render('shopping-cart', { title: 'Panier', cartCount: countCart(req.session.shoppingCart) });
});

router.get('/commande', (req, res) => {
  res.render('order', { title: 'Commande', cartCount: countCart(req.session.shoppingCart) });
});

// Attention à changer ça en POST comme du monde
router.get('/confirmation', (req, res) => {
  res.render('confirmation', { title: 'Confirmation', cartCount: countCart(req.session.shoppingCart) });
});

function countCart(cart)
{
  let count = 0;
  if (cart)
  {
    cart.forEach(element => {
      count += element.quantity;
    });
  }
  return count;
}

module.exports = router;

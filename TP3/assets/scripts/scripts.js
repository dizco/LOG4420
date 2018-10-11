'use strict';

$(document).ready(function() {
  shoppingCart.update();
});

const PRODUCTS_KEY = 'shopping_cart_products';

const shoppingCart = {
  size: () => {
    let products = shoppingCart.products();

    return products.length;
  },
  products: () => {
    let serializedProducts = localStorage.getItem(PRODUCTS_KEY);
    let products = [];
    if (serializedProducts) {
      products = JSON.parse(serializedProducts);
    }

    return products;
  },
  add: (quantity, productId) => {
    console.log('add', quantity, productId);
    let products = shoppingCart.products();
    let productFound = products.find((p) => p.id === productId);
    if (productFound) {
      productFound.quantity += quantity;
    }
    else {
      products.push({id: productId, quantity: quantity});
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    shoppingCart.update();
  },
  removeOne: (productId) => {
    let products = shoppingCart.products();
    let productFound = products.find((p) => p.id === productId);
    if (productFound) {
      productFound.quantity--;
      if (productFound.quantity <= 1) {
        //TODO: Disable button to decrement on the shopping cart page
      }
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    shoppingCart.update();
  },
  removeAll: (productId) => {
    let products = shoppingCart.products();
    products = products.filter((p) => p.id !== productId);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    shoppingCart.update();
  },
  update: () => {
    shoppingCart.updateBadge();
    //TODO: Update shopping cart display?
  },
  updateBadge: () => {
    const $shoppingCartBadge = $('.shopping-cart .count');
    const shoppingCartSize = shoppingCart.size();
    if ($shoppingCartBadge && $shoppingCartBadge.length > 0 && shoppingCartSize > 0) {
      $shoppingCartBadge.show();
      $shoppingCartBadge[0].innerText = shoppingCartSize;
    }
    else {
      $shoppingCartBadge.hide();
    }
  },
};


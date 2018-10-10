'use strict';

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
  add: (quantity, product) => {
    console.log('add', quantity, product);
    let products = shoppingCart.products();
    for (let i = 0; i < quantity; i++) {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    shoppingCart.updateBadge();
  },
  remove: (product) => {
    let products = shoppingCart.products();
    products = products.filter((p) => p !== product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    shoppingCart.updateBadge();
  },
  updateBadge() {
    const $shoppingCartBadge = $('.shopping-cart .count');
    if ($shoppingCartBadge && $shoppingCartBadge.length > 0) {
      $shoppingCartBadge[0].innerText = shoppingCart.size();
    }
  },
};


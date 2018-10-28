'use strict';

$(document).ready(function() {
  shoppingCart.update();
});

const PRODUCTS_KEY = 'shopping_cart_products';
const ORDERS_KEY = 'orders';

const shoppingCart = {
  size: () => {
    let products = shoppingCart.products();
    let totalSize = 0;
    products.forEach((product) => totalSize += parseInt(product.quantity));
    return totalSize;
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
    let products = shoppingCart.products();
    // Weak comparison to allow comparing p.id string and productId int
    let productFound = products.find((p) => p.id == productId);
    if (productFound) {
      productFound.quantity = parseInt(productFound.quantity) + quantity;
    }
    else {
      products.push({id: productId, quantity: quantity});
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    shoppingCart.update();
  },
  removeEverything: () => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify([]));
    shoppingCart.update();
  },
  removeOne: (productId) => {
    let products = shoppingCart.products();
    // Weak comparison to allow comparing p.id string and productId int
    let productFound = products.find((p) => p.id == productId);
    if (productFound && productFound.quantity > 1) {
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
    // Weak comparison to allow comparing p.id string and productId int
    products = products.filter((p) => p.id != productId);
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
      $shoppingCartBadge.text(shoppingCartSize);
    }
    else {
      $shoppingCartBadge.hide();
    }
  },
};

const completedOrders = {
  orders: () => {
    let serializedOrders = localStorage.getItem(ORDERS_KEY);
    let orders = [];
    if (serializedOrders) {
      orders = JSON.parse(serializedOrders);
    }

    return orders;
  },
  add: (firstName, lastName) => {
    let orders = completedOrders.orders();

    orders.push({id: orders.length + 1, firstName: firstName, lastName: lastName});

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },
  getLast: () => {
    let orders = completedOrders.orders();
    if (orders.length > 0) {
      return orders[orders.length - 1];
    }
    else {
      return {id: 0, firstName: "Unknown", lastName: "User"};
    }
  }
};


/* HELPERS */

function urlParam(name) {
  //Source: https://www.sitepoint.com/url-parameters-jquery/
  let results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  else {
    return results[1] || 0;
  }
}

function formatPrice(price) {
  const parsedFloat = parseFloat(price);
  //return parsedFloat.toLocaleString('fr-CA');
  // Espace insécable entre le prix et le symbole de dollars.
  return parsedFloat.toFixed(2).replace('.', ',') + "\xA0$";
}

function parsePrice(price) {
  return parseFloat(price.replace(',', '.').replace(/[^0-9.]+/g, ""));
}

function fetchProduct(productId) {
  return fetchProducts()
    .then((products) => {
      return products.find((p) => parseInt(p.id) === parseInt(productId));
    });
}

function fetchProducts() {
  return window.fetch(`/data/products.json`)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error while fetching products', error);
    });
}

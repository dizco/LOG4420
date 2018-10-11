'use strict';

$(document).ready(function() {
  loadProducts();

  async function loadProducts() {
    let products = await fetchProducts();
    displayProductsCount(products.length);
    displayProductsList(products);
  }

  function displayProductsCount(count) {
    const text = '' + count + ' produit'  + ((count > 1) ? 's' : '');
    $('#products-count').text(text);
  }

  function displayProductsList(products) {
    const PRODUCTS_PER_ROW = 3;
    const $productsList = $('#products-list');

    $productsList.empty();

    let row = createRowElement();
    for (let i = 0; i < products.length; i++) {
      let product = createProductElement(products[i]);

      row.append(product);

      if ((i + 1) % PRODUCTS_PER_ROW === 0) {
        $productsList.append(row);
        row = createRowElement();
      }
    }

    $productsList.append(row);
  }

  function createRowElement() {
    let row = document.createElement('div');
    row.className = 'flex-row flex-no-pad';
    return row;
  }

  function createProductElement(product) {
    const title = document.createElement('h2');
    title.appendChild(document.createTextNode(product.name));

    const image = document.createElement('img');
    image.src = 'assets/img/' + product.image;
    image.alt = product.name;

    const imageContainer = document.createElement('div');
    imageContainer.className = 'img-container';
    imageContainer.appendChild(image);

    const price = document.createElement('p');
    price.appendChild(document.createTextNode('Prix '));
    const strongPrice = document.createElement('strong');
    strongPrice.appendChild(document.createTextNode(formatPrice(product.price) + '$'));
    price.appendChild(strongPrice);

    const link = document.createElement('a');
    link.href = 'product.html?id=' + product.id;
    link.appendChild(title);
    link.appendChild(imageContainer);
    link.appendChild(price);

    const article = document.createElement('article');
    article.appendChild(link);
    return article;
  }

  function formatPrice(price) {
    const parsedFloat = parseFloat(price);
    //return parsedFloat.toLocaleString('fr-CA');
    return parsedFloat.toFixed(2).replace('.', ',');
  }
});

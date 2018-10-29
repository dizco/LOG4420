'use strict';

$(document).ready(function () {
  let products = [];
  loadProducts();

  $('#product-categories button').click(function () {
    removeSelections($('#product-categories'));
    $(this).addClass('selected');

    updateProductsList();
  });

  $('#product-criteria button').click(function () {
    removeSelections($('#product-criteria'));
    $(this).addClass('selected');

    updateProductsList();
  });

  function updateProductsList() {
    const filter = $('#product-categories button.selected').data('filter');
    const filteredProducts = products.filter((product) => product.category.includes(filter));

    const sort = $('#product-criteria button.selected').data('sort');
    const sortAlgorithm = chooseSortAlgorithm(sort);
    const sortedProducts = filteredProducts.sort(sortAlgorithm);
    displayProductsCount(sortedProducts.length);
    displayProductsList(sortedProducts);
  }

  function chooseSortAlgorithm(type) {
    if (type === 'price-low') {
      return (product1, product2) => product1.price - product2.price;
    }
    else if (type === 'price-high') {
      return (product1, product2) => product2.price - product1.price;
    }
    else if (type === 'alphabetical') {
      return (product1, product2) => product1.name.localeCompare(product2.name);
    }
    else if (type === 'reverse-alphabetical') {
      return (product1, product2) => product2.name.localeCompare(product1.name);
    }
    return () => 0; //Leave unchanged...
  }

  function removeSelections(wrapper) {
    $(wrapper).find('button').removeClass('selected');
  }

  async function loadProducts() {
    products = await fetchProducts();
    updateProductsList();
  }

  function displayProductsCount(count) {
    const text = '' + count + ' produit' + ((count > 1) ? 's' : '');
    $('#products-count').text(text);
  }

  function displayProductsList(products) {
    const $productsList = $('#products-list');

    $productsList.empty();

    for (let i = 0; i < products.length; i++) {
      let product = createProductElement(products[i]);
      $productsList.append(product);
    }
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
    strongPrice.appendChild(document.createTextNode(formatPrice(product.price)));
    price.appendChild(strongPrice);

    const link = document.createElement('a');
    link.href = 'product.html?id=' + product.id;
    link.appendChild(title);
    link.appendChild(imageContainer);
    link.appendChild(price);

    const container = document.createElement('div');
    container.className = "product";
    container.appendChild(link);
    return container;
  }
});

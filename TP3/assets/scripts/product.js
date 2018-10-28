'use strict';

$(document).ready(function() {
  $('#dialog').hide();
  loadProduct();

  let timeout;

  const $addProductForm = $('#add-to-cart-form');
  if ($addProductForm) {
    $addProductForm.submit(function(event) {
      event.preventDefault();
      const quantity = parseInt($addProductForm.find('#qtyField').val());
      shoppingCart.add(quantity || 1, urlParam('id'));

      //Show notification for 5 seconds
      clearTimeout(timeout);
      $('#dialog').show();
      timeout = window.setTimeout(() => {
        clearTimeout(timeout);
        $('#dialog').hide();
      }, 5000);
    });
  }

  async function loadProduct() {
    let product = await fetchProduct(urlParam('id'));
    if (product) {
      $('#product-details').show();
      $('#product-name').text(product.name);
      $('#product-image').attr('src', 'assets/img/' + product.image);
      $('#product-image').attr('alt', product.name);
      $('#product-desc').text(product.description);
      const productFeatures = $('#product-features');
      product.features.forEach((feature) => {
        const listElement = document.createElement('li');
        listElement.appendChild(document.createTextNode(feature));
        productFeatures.append(listElement);
      });


      const price = $('#product-price');
      price.append(document.createTextNode('Prix: '));
      const strongPrice = document.createElement('strong');
      strongPrice.appendChild(document.createTextNode(formatPrice(product.price)));
      price.append(strongPrice);
    }
    else {
      $('#product-details').hide();
      $('#product-name').text('Page non trouvée!');
    }
  }
});

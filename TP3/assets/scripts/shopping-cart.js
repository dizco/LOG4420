'use strict';

$(document).ready(function () {
    const $cartList = $('#cart-list');
    $("#remove-all-items-button").click(() => {
        emptyCart();
    });

    $('#no-products-in-cart').hide();
    loadCart();

    async function loadCart() {
        $cartList.empty();
        if (shoppingCart.products().length === 0) {
            hideCart();
        }

        let products = await fetchProducts();
        products.sort((product1, product2) => product1.name.localeCompare(product2.name));

        const productRefs = shoppingCart.products();

        for (const product of products) {
            const productRef = productRefs.find((p) => p.id == product.id);
            if (productRef) {
                $cartList.append(createCartElement(product, productRef.quantity));
            }
        }

        updateCartTotal();
        }

    function emptyCart() {
        if (confirm("Voulez-vous supprimer tous les produits du panier?")) {
            shoppingCart.removeEverything();
            $cartList.empty();
            hideCart();
        }
    }

    function hideCart() {
        $('#cart-form').hide();
        $('#no-products-in-cart').show();
    }

    function createCartElement(product, quantity) {
        const tableRow = document.createElement('tr');
        tableRow.appendChild(createRemoveCell(product));
        tableRow.appendChild(createProductNameCell(product));
        tableRow.appendChild(createProductPriceCell(product));
        tableRow.appendChild(createQuantityCell(product, quantity));
        tableRow.appendChild(createSubtotalCell(product, quantity));
        return tableRow;
    }

    function createRemoveCell(product) {
        const tableCell = document.createElement('td');

        const removeButton = document.createElement('button');
        removeButton.className = "remove-item-button red-shadow";
        removeButton.type = "button";
        const removeIcon = document.createElement('i');
        removeIcon.className = "fa fa-times";
        removeButton.appendChild(removeIcon);
        removeButton.onclick = function () {
            if (confirm("Voulez-vous supprimer le produit du panier?")) {
                tableCell.parentNode.parentNode.removeChild(tableCell.parentNode);
                shoppingCart.removeAll(product.id);
                updateCartTotal();
                if (shoppingCart.products().length === 0) {
                    hideCart();
                }  
            }
        }

        tableCell.appendChild(removeButton);

        return tableCell;
    }

    function createProductNameCell(product) {
        const tableCell = document.createElement('td');

        const productLink = document.createElement('a');
        productLink.href = "product.html?id=" + product.id;
        productLink.appendChild(document.createTextNode(product.name));

        tableCell.append(productLink);

        return tableCell;
    }

    function createProductPriceCell(product) {
        const tableCell = document.createElement('td');

        const productPrice = document.createTextNode(formatPrice(product.price));

        tableCell.append(productPrice);

        return tableCell;
    }

    function createQuantityCell(product, quantity) {
        const tableCell = document.createElement('td');

        const quantitySpan = document.createElement('span');
        let quantityText = document.createTextNode(quantity);
        quantitySpan.appendChild(quantityText);
        quantitySpan.id = "qty" + product.id;
        quantitySpan.className = "quantity";

        const removeButton = document.createElement('button');
        removeButton.className = "remove-quantity-button blue-shadow";
        removeButton.type = "button";
        const removeIcon = document.createElement('i');
        removeIcon.className = "fa fa-minus";
        removeIcon.type = "button";
        removeButton.appendChild(removeIcon);
        removeButton.onclick = function () {
            shoppingCart.removeOne(product.id);
            let qty = updateQuantity(product.id);
            $('#subtotal' + product.id).html(formatPrice(product.price * qty));
            updateCartTotal();
            if (qty == 1) {
                removeButton.disabled = true;
                removeButton.className = "remove-quantity-button no-shadow";
            }
        }
        if (quantity == 1) {
            removeButton.disabled = true;
            removeButton.className = "remove-quantity-button no-shadow";
        }

        const addButton = document.createElement('button');
        addButton.className = "add-quantity-button blue-shadow";
        addButton.type = "button";
        const addIcon = document.createElement('i');
        addIcon.className = "fa fa-plus";
        addButton.appendChild(addIcon);
        addButton.onclick = function () {
            shoppingCart.add(1, product.id);
            let qty = updateQuantity(product.id);
            $('#subtotal' + product.id).html(formatPrice(product.price * qty));
            updateCartTotal();
            removeButton.disabled = false;
            removeButton.className = "remove-quantity-button blue-shadow";
        }

        tableCell.appendChild(removeButton);
        tableCell.appendChild(quantitySpan);
        tableCell.appendChild(addButton);

        return tableCell;
    }

    function createSubtotalCell(product, quantity) {
        const tableCell = document.createElement('td');
        tableCell.className = "price"

        const subtotal = document.createTextNode(formatPrice(product.price * quantity));

        tableCell.id = "subtotal" + product.id;
        tableCell.appendChild(subtotal);

        return tableCell;
    }

    function updateQuantity(id) {
        let productFound = shoppingCart.products().find((p) => p.id == id);
        if (productFound) {
            $('#qty' + id).html(productFound.quantity);
            return productFound.quantity;
        }
        else {
            return -1;
        }

    }

    function updateCartTotal() {
        let total = 0.0;
        $('.price').each(function () {
            total += parsePrice($(this).text());
        });
        $('#total-amount').html(formatPrice(total));
    }
});

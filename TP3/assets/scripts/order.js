'use strict';

$(document).ready(function () {
    jQuery.validator.addMethod("creditcardexp", function(value, element) {
        return this.optional(element) || /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value);
    }, "La date d'expiration de votre carte de crédit est invalide.");
    $('#order-form').validate({
        rules: {
            "first-name": {
                required: true,
                minlength: 2
            },
            "last-name": {
                required: true,
                minlength: 2
            },
            "email": {
                required: true,
                email: true
            },
            "phone": {
                required: true,
                phoneUS: true
            },
            "credit-card": {
                required: true,
                creditcard: true
            },
            "credit-card-expiry": {
                required: true,
                creditcardexp: true
            }
        },
        submitHandler: function(form) {
            if ($(form).valid()) {
                const firstName = $('#first-name').val();
                const lastName = $('#last-name').val();
                completedOrders.add(firstName, lastName);
                shoppingCart.removeEverything();
                console.log(completedOrders.orders());
                return true;
            }
            else {
                return false;
            }
        }
    })
});
'use strict';

$(document).ready(function () {
    const lastOrder = completedOrders.getLast();
    const fullName = lastOrder.firstName + " " + lastOrder.lastName;
    $('#name').html(fullName);
    $('#confirmation-number').html(pad(lastOrder.id, 6))

    function pad(num, size) {
        return ('000000000' + num).substr(-size);
    }
});
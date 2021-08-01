$('.carousel').carousel()

function Order() {
    this.cart = []
    this.total = 0
}

Order.prototype.addItem = function (name, price, quantity) {
    this.cart.push({
        name, price, quantity
    })

    cost = price * quantity
    this.total += cost
}

Order.prototype.removeItem = function (name, price, quantity) {
    this.cart = this.cart.filter((item) => {
        if (item.name === name) {
            cost = price * quantity
            this.total -= cost
            return false
        }
        return true
    })
}

Order.prototype.updateItem = function (name, price, quantity) {
    this.cart.map((item) => {
        if (item.name === name) {
            prev_item_cost = item.price * item.quantity
            this.total -= prev_item_cost

            cost = price * quantity
            this.total += cost
            return { name, price, quantity }
        }
    })
}

Order.prototype.getTotal = function () {
    return this.total
}

Order.prototype.getSummary = function () {
    return { cart: this.cart, total: this.total }
}

function getSize(arr) {
    var size;
    arr.forEach((item) => {
        if (item.name === "size") {
            console.log(item)
            size = item.value.split('-')[0]
        }
    });
    return size;
}

function getOrderCost(arr) {
    var total = 0
    arr.forEach(item => {
        if (item.name === "size") {
            total += parseInt(item.value.split("-")[1])
        } else {
            total += parseInt(item.value)
        }
    });
    return total
}

function getTableRow(name, cost, quantity) {
    return `<tr class="summary-item">
        <th>
        <div class="row item-name">${name}</div>
        <div class="row remove-item">
            <i class="fas fa-times r-icon"></i>
            <span class="r-text"> REMOVE </span>
        </div>
        </th>
        <td>
        <div class="row item-quantity">
            ${quantity}
        </div>
        <td>
        <div class="row item-price">
            Ksh ${cost}
        </div>
        </td>
    </tr>`
}

$(document).ready(function () {
    order = new Order()
    if (order.cart.length === 0) {
        $(".open-cart").prop('disabled', true);
    }
    $('.minus').click(function() {
        if(parseInt($('.number').text()) > 1) {
            $('.number').text(parseInt($('.number').text()) - 1)
        }
    })

    $('.plus').click(function() {
        $('.number').text(parseInt($('.number').text()) + 1)
    })

    $(".add-cart").click(function () {
        modalTitle = this.value
        $('#modal').on('show.bs.modal', function () {
            $('.modal-title').text(modalTitle)
        })
        $('#modal').on('hide.bs.modal', function (event) {
            form_data = $('form').serializeArray()
            resetForm = true
            if (form_data.length > 0) {
                size = getSize(form_data)
                if (size) {
                    quantity = parseInt($('.number').text())
                    cost = getOrderCost(form_data)
                    name = modalTitle + " - " + size
                    order.addItem(name, cost, quantity)
                    $(".open-cart").prop('disabled', false);
                    target = getTableRow(name, cost, quantity)
                    $('#products').text(order.cart.length + " item(s)")
                    $('#total-cost').html("<br /> Total: Ksh " + order.getTotal())
                } else {
                    event.preventDefault();
                    resetForm = false
                    alert("Pizza size is required!")
                }
            }
            if (resetForm) {
                $('form').trigger('reset');
                $('.number').text(1)
            }
        });
    });

    $(".open-cart").click(function () {
        $('.delivery-options').hide()
        if (order.cart.length > 0) {
            order.cart.forEach(item => {
                quantity = item.quantity
                cost = item.price
                name = item.name
                target = getTableRow(name, cost, quantity)
                $('#cart-summary tr:last').before(target)
                $('#total').text("Ksh " + order.getTotal())
            });
        }
    });

    $(document).on('click', '.remove-item', function(){
        itemRow = this.closest('tr')
        name = $(itemRow).find('.item-name').text().trim()
        cost = $(itemRow).find('.item-price').text().trim().split(" ")[1]
        quantity = $(itemRow).find('.item-quantity').text().trim()
        order.removeItem(name, parseInt(cost), parseInt(quantity))
        itemRow.remove()
        $('#total').text("Ksh " + order.getTotal())

        if (order.cart.length === 0) {
            $(".open-cart").prop('disabled', true);
            $(".checkout").prop('disabled', true);
            $('#products').text("Cart is empty")
            $('#total-cost').html("")
        } else {
            $(".checkout").prop('disabled', false);
            $('#products').text(order.cart.length + " item(s)")
            $('#total-cost').html("<br /> Total: Ksh " + order.getTotal())
        }
    })

    deliver_price = 0
    d_location = ''
    $('#delivery1').change(function(event) {
        event.preventDefault();
        if($(this).is(":checked")) {
            console.log('checked')
            $('.delivery-options').show()
        } else {
            $('.delivery-options').hide()
        }
    })

    $('.d-location').change(function() {
        l_p = this.value.split('-')
        deliver_price = parseInt(l_p[1])
        d_location = l_p[0]
    })

    $('.checkout-comp').click(function(){
        if (d_location){
            alert(`Your order total cost is Ksh: ${order.getTotal() + deliver_price}
    It will be delivered to: ${d_location}`)
        } else {
            alert(`Your order total cost is Ksh: ${order.getTotal() + deliver_price}`)
        }
        location = 'index.html'
    })


})
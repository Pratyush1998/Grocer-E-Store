
(function ($) {
    $.Shop = function (element) {
        this.$element = $(element);
        //calling initialization function
        this.init();
    };

    $.Shop.prototype = {
        init: function () {

            // Instance variables
            this.cartName = "cart"; // Cart name in the session storage
            this.storage = sessionStorage; // shortcut to the sessionStorage object


            this.createCart();
            //ensuring displayCart() function before handleDeleteButton() function
            $.when(this.displayCart()).then(this.handleDeleteButton());
            this.handleOrderNowButton();
            this.displayTotal();
            this.checkCart();
        },

        createCart: function () {
            //creating empty cart in session storage
            if (this.storage.getItem(this.cartName) == null) {
                var cart = {};
                cart.items = [];
                this.storage.setItem(this.cartName, this._toJSONString(cart));
            }
        },

        //method to display cart items
        displayCart: function () {
            //get cart stored in session storage
            var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            var items = cart.items;

            //dynamically display cart items on HTML page according to the attributes of each item object
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                var product = item.product;
                var price = item.price;
                var store = item.store;
                var sku = item.sku;
                var image = item.image_name;
                var html =
                    '<div class="row"> ' +
                    `<div class="card" data-id="${i}" data-sku="${sku}"> ` +
                    '<div class="card-body"> ' +
                    '<div class="row"> ' +
                    '<div class="col-4"> ' +
                    `<img src="../images/${image}.jpg" alt="${product}" class="img-responsive fit-image"> ` +
                    '</div> ' +
                    '<div class="col-6"> ' +
                    `<h2>${product}</h2> ` +
                    '<ul class="list-group list-group-flush"> ' +
                    `<li class="list-group-item">Store: ${store} </li> ` +
                    `<li class="list-group-item">Price: $${price}/lb</li> ` +
                    '</ul> ' +
                    '</div> ' +
                    '<div class="col-2" id="remove_col"> ' +
                    `<button type="button" class="delete-item btn btn-outline-danger btn-block">Remove</button> ` +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div>' +
                    '</div>';

                //var p = document.getElementById('cart_items');
                //var newElement = document.createElement('div');
                //newElement.setAttribute('class', 'row');
                //newElement.innerHTML = html;
                //p.appendChild(newElement);
                var p = $("#cart_items");
                p.append(html);
            }
        },

        //function to calculate total value of items in cart
        calculateTotal: function () {
            var cart = this._toJSONObject(this.storage.getItem(this.cartName));
            var items = cart.items;
            var cartTotal = 0
            for (var i = 0; i < items.length; i++) {
                cartTotal += parseFloat(items[i].price);
            }
            return cartTotal.toFixed(2);
        },

        //function to display total value of items on page
        displayTotal: function () {
            var p = document.getElementById('cart_total');
            var newElement = document.createElement('h5');
            newElement.innerHTML = `Total: $${this.calculateTotal()}`;
            p.appendChild(newElement);
        },

        //function to delete items from cart
        handleDeleteButton: function () {
            this.$btnDeleteItem = this.$element.find("button.delete-item");
            var self = this;
            self.$btnDeleteItem.each(function () {
                var $button = $(this);
                $button.on("click", function () {
                    var item_element = parseInt($button.parents().eq(3).data("id"), 10);
                    var item_sku = parseInt($button.parents().eq(3).data("sku"), 10);
                    self._deleteFromCart(item_sku);
                    //$(`.card[data-id="${item_element}"]`).remove();
                    $(`.card[data-id="${item_element}"]`).animate({
                        //width: 0,
                        //height: 0
                        left: 1000
                    }, function () {
                        $(this).remove();
                    }
                    );
                    self.checkCart();

                    $("#cart_total").empty();
                    self.displayTotal();
                    self.handleOrderNowButton();
                });
            });

        },
        checkCart: function () {
            var cart_string = this.storage.getItem("cart");
            if (cart_string != null) {
                var cart = this._toJSONObject(cart_string);
                if (cart.items.length > 0) {
                    $('a[href="cart.html"]').show();
                    $('a[href="cart.html"]').html(`Cart (${cart.items.length})`);
                }
                else {
                    $('a[href="cart.html"]').hide();
                }
            }
            else {
                $('a[href="cart.html"]').hide();
            }
        },

        //enables or disables order button depending on if there are items in the cart or not
        handleOrderNowButton: function () {
            this.$btnOrderNow = $("#order_totalbar").find(".btn")

            if (this._toJSONObject(this.storage.getItem(this.cartName)) != null) {
                var cart = this._toJSONObject(this.storage.getItem(this.cartName)).items;
                if (cart.length > 0) {
                    this.$btnOrderNow.prop("disabled", false);
                }
                else {
                    this.$btnOrderNow.prop("disabled", true);
                }
            }
        },

        //helper function to convert String to JavaScript object
        _toJSONObject: function (str) {
            var obj = JSON.parse(str);
            return obj;
        },

        //helper function to convert JavaScript object to String
        _toJSONString: function (obj) {
            var str = JSON.stringify(obj);
            return str;
        },

        //helper function to update cart object list in session storage
        _deleteFromCart: function (sku) {
            var cart = this.storage.getItem(this.cartName);

            var cartObject = this._toJSONObject(cart);
            var cartCopy = cartObject;
            var items = cartCopy.items;

            //remove item with matching sku number from cart
            var items_sku = items.map(e => { return e.sku });
            var deletion_index = items_sku.indexOf(parseInt(sku));
            items.splice(deletion_index, 1);

            //push updated cart object list to session storage
            this.storage.setItem(this.cartName, this._toJSONString(cartCopy));
        }
    };

    $(function () {
        var shop = new $.Shop("#site");
    });

})(jQuery);
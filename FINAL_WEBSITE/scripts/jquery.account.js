(function ($) {
    //Shop object
    $.Shop = function (element) {
        this.$element = $(element);
        //calling initialization function
        this.init();
    };

    //prototype of shop object
    $.Shop.prototype = {
        init: function () {

            // Instance variable
            this.accountName = "account"; // Account name in the session storage
            this.storage = sessionStorage; // shortcut to the sessionStorage object

            //calling object methods to be run
            //this.createAccount();
            this.displayAccount();
            this.checkCart();
        },

        displayAccount: function () {

            var account = this._toJSONObject(this.storage.getItem(this.accountName));
            var credentials = account.credentials;


            //displaying credentials dynamically based on credentials stored in session storage
            var credential = credentials[0];
            var name = credential.firstname + " " + credential.lastname;
            var billing_address = credential.billing_address;
            var shipping_address = credential.shipping_address;
            var card_number = credential.card_number;
            var html =
                '<table class="table table-bordered"> ' +
                '<tbody> ' +
                '<tr> ' +
                '<td rowspan="4"> ' +
                '<img src="../images/profile_icon.png" class="img-fluid img-thumbnail" alt="Profile Pic"> ' +
                '</td> ' +
                '<th>Name:</th> ' +
                `<td>${name}</td> ` +
                '</tr> ' +
                '<tr> ' +
                '<th>Billing Address:</th> ' +
                `<td>${billing_address}</td> ` +
                '</tr> ' +
                '<tr> ' +
                '<th>Shipping Address:</th> ' +
                `<td>${shipping_address}</td> ` +
                '</tr> ' +
                '<tr> ' +
                '<th>Card #:</th> ' +
                `<td>${card_number}</td> ` +
                '</tr> ' +
                '</tbody> ' +
                '</table>'

            //var p = document.getElementById('account_info');
            var p = $("#account_info")
            //var newElement = document.createElement('div');
            //newElement.innerHTML = html;
            p.append(html);
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

        //helper function to convert string to JavaScript object
        _toJSONObject: function (str) {
            var obj = JSON.parse(str);
            return obj;
        },

        //helper function to convert JavaScript object to String
        _toJSONString: function (obj) {
            var str = JSON.stringify(obj);
            return str;
        }
    };

    $(function () {
        //This object applies to all elements within the div with id=site
        //creating new object
        var shop = new $.Shop("#site");
    });

})(jQuery);
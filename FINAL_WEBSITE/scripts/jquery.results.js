(function ($) {
    $.Shop = function (element) {
        this.$element = $(element);
        //calling initialization function
        this.init();
    };

    $.Shop.prototype = {
        init: function () {

            // Instance Variables
            this.resultsName = "results"; // result list name in the session storage
            this.storage = sessionStorage; // shortcut to the sessionStorage object

            //running methods of object
            this.createCart();
            this.displayResults();
            this.checkCart();
        },

        // Public methods

        //this method displays the results stored in session storage
        displayResults: function () {

            //converting results stored in session storage to JavaScript object
            var results = this._toJSONObject(this.storage.getItem(this.resultsName));

            results_list = results.items;

            //if there are results to display
            if (results_list.length != 0) {
                //remove any DOM elements stored within the div of id=results_list
                $("#results_list").empty();

                //loop through all result objects and dynamically display results within div of id=results_list
                for (var i = 0; i < results_list.length; ++i) {
                    var result = results_list[i];
                    var name = result.name;
                    var price = result.price;
                    var store = result.store;
                    var sku = result.sku;
                    var image = result.image_name;
                    var html =
                        `<div class="card" data-id=${i}> ` +
                        `<img class="card-img-top" src="../images/${image}.jpg" alt="apple"> ` +
                        `<div class="card-body" data-name="${name}" data-image="${image}" data-price="${price}" data-store="${store}" data-sku="${sku}"> ` +
                        `<h5 class="card-title">${name} $${price}</h5> ` +
                        `<h6> ${store}</h6>` +
                        '<button type="button" class="add-to-cart align-self-end btn btn-lg btn-block btn-primary" style="margin-top: auto;">Add to Cart</button> ' +
                        '</div> ' +
                        '</div>';

                    // var p = document.getElementById('results_list');
                    // var newElement = document.createElement('div');
                    // newElement.setAttribute('class', 'card');
                    // newElement.setAttribute('data-id', `${i}`);
                    // newElement.innerHTML = html;
                    // p.appendChild(newElement);
                    var p = $("#results_list");
                    p.append(html);
                }
            }
            //ensure new elements added have handlers for adding to cart and filtering
            this.handleAddToCartButton();
            this.handleFilterButton();
            this.handleClearButton();
        },

        //this method displays the the list of filtered results that it takes as an input parameter
        displayFilteredResults: function (results) {

            if (results.length != 0) {
                $("#results_list").empty();
                for (var i = 0; i < results.length; ++i) {
                    var result = results[i];
                    var name = result.name;
                    var price = result.price;
                    var store = result.store;
                    var sku = result.sku;
                    var image = result.image_name;
                    var html =
                        `<div class="card" data-id=${i}> ` +
                        `<img class="card-img-top" src="../images/${image}.jpg" alt="apple"> ` +
                        `<div class="card-body" data-name="${name}" data-image="${image}" data-price="${price}" data-store="${store}" data-sku="${sku}"> ` +
                        `<h5 class="card-title">${name} $${price}</h5> ` +
                        `<h6> ${store}</h6>` +
                        '<button type="button" class="add-to-cart align-self-end btn btn-lg btn-block btn-primary" style="margin-top: auto;">Add to Cart</button> ' +
                        '</div> ' +
                        '</div>';

                    // var p = document.getElementById('results_list');
                    // var newElement = document.createElement('div');
                    // newElement.setAttribute('class', 'card');
                    // newElement.setAttribute('data-id', `${i}`);
                    // newElement.innerHTML = html;
                    // p.appendChild(newElement);

                    var p = $("#results_list");
                    p.append(html);
                }
            }
            this.handleAddToCartButton();
            this.handleFilterButton();
            this.handleClearButton();
        },

        //this method ensures that every list item has a functioning add to cart button
        handleAddToCartButton: function () {
            this.$btnAddToCart = this.$element.find("button.add-to-cart");
            var self = this;
            //for every add to cart button
            self.$btnAddToCart.each(function () {
                var $button = $(this);
                var $product = $button.parent();
                //take data from HTML value-data attribute from parent DOM element
                var name = $product.data("name");
                var price = $product.data("price");
                var store = $product.data("store");
                var sku = $product.data("sku");
                var image = $product.data("image");

                //add onClick event listener to button
                $button.on("click", function () {
                    //call addToCart helper function and pass product, price, store, etc. info to it
                    self._addToCart({
                        product: name,
                        price: price,
                        store: store,
                        sku: sku,
                        image_name: image
                    });
                    //get id of the item whose add to cart button was clicked
                    var item_element = parseInt($button.parents().eq(1).data("id"), 10);
                    //remove that item from the page
                    //$(`.card[data-id="${item_element}"]`).hide('fast', function () { $(this).remove(); });
                    $(`.card[data-id="${item_element}"]`).fadeTo(150, 0.01, function () {
                        $(this).slideUp(150, function () {
                            $(this).remove();
                        });
                    });
                    self.checkCart();
                });
            });

        },
        handleFilterButton: function () {
            this.$btnFilterResults = $("#filter-results");
            var self = this;

            //Event listener for when the filter results button is pressed
            self.$btnFilterResults.on("click", function () {

                //check which store filter option has been selected
                var store = $('input[name="store"]')
                var store_filter = null;

                for (var i = 0; i < store.length; i++) {
                    if (store[i].checked) {
                        store_filter = store[i].id;
                    }
                }

                //check which price filter/sort option has been selected
                var price = $('input[name="price"]')
                var price_filter = null;

                for (var i = 0; i < price.length; i++) {
                    if (price[i].checked) {
                        price_filter = price[i].id;
                    }
                }

                //get list of result objects from session storage
                var results = self._toJSONObject(self.storage.getItem(self.resultsName)).items;

                //if store filter option is selected perform filtering of the results list
                if (store_filter != null) {
                    results = results.filter(e => { return e.store.toUpperCase() == store_filter.toUpperCase() });
                }

                //if price filter option is ascending sort results in ascending order
                if (price_filter == "ascending") {
                    results.sort((a, b) => { return (a.price > b.price) ? 1 : -1 });
                }

                //if price filter option is descending sort results in descending order
                else if (price_filter == "descending") {
                    results.sort((a, b) => { return (a.price < b.price) ? 1 : -1 });
                }

                //enable clear filter button
                $('#clear-filter').prop('disabled', false);
                //disable filter results button
                $('#filter-results').prop('disabled', true);

                //send filtered results list to displayFilteredResults function
                self.displayFilteredResults(results);
            });


        },
        handleClearButton: function () {

            this.$btnClearFilter = $("#clear-filter");
            var self = this;

            //Event listener for when the clear filter button is pressed
            self.$btnClearFilter.on("click", function () {
                //Call the display results function to display the results contained session storage
                self.displayResults();

                var store = $('input[name="store"]')

                //uncheck any store filter option
                for (var i = 0; i < store.length; i++) {
                    if (store[i].checked) {
                        store[i].checked = false;
                    }
                }


                var price = $('input[name="price"]')

                //uncheck any price filter option
                for (var i = 0; i < price.length; i++) {
                    if (price[i].checked) {
                        price[i].checked = false;
                    }
                }
                //disable clear button
                $('#clear-filter').prop('disabled', true);
                //enable filter button
                $('#filter-results').prop('disabled', false);
            });

        },
        //this method adds an empty cart list to session storage
        createCart: function () {
            if (this.storage.getItem("cart") == null) {
                var cart = {};
                cart.items = [];

                this.storage.setItem("cart", this._toJSONString(cart));
            }
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
        //this is a helper method to convert Strings into JavaScript objects
        _toJSONObject: function (str) {
            var obj = JSON.parse(str);
            return obj;
        },

        //this is a helper function to convert JavaScript objects to Strings
        _toJSONString: function (obj) {
            var str = JSON.stringify(obj);
            return str;
        },

        //this is a helper function to update the cart in session storage
        //it takes a cart object as a parameter
        _addToCart: function (values) {
            var cart = this.storage.getItem("cart");

            var cartObject = this._toJSONObject(cart);
            var cartCopy = cartObject;

            var items = cartCopy.items;

            //add cart object to items list
            items.push(values);

            this.storage.setItem("cart", this._toJSONString(cartCopy));

            //update results in session storage to reflect change
            this._updateResults();
        },

        //helper function to update results in session storage by removing any items that are
        //also found in the cart
        _updateResults: function () {
            var cart_string = sessionStorage.getItem("cart");

            if (cart_string != null) {
                var cart = JSON.parse(cart_string);
                if (cart.items.length > 0) {
                    var cart_ids = cart.items.map(e => { return e.sku });

                    results_list = results_list.filter(e => {
                        return !(cart_ids.includes(e.sku))
                    })
                }
            }

            var results = sessionStorage.getItem("results");

            var resultsObject = JSON.parse(results);
            var resultCopy = resultsObject;
            var items = resultCopy.items;

            //clearing current results objects in items list
            items.length = 0;

            //pushing result objects in results_list to items
            for (var i = 0; i < results_list.length; i++) {
                items.push(results_list[i]);
            }

            //pushing updated results list to session storage
            sessionStorage.setItem('results', JSON.stringify(resultCopy));
        }
    };

    $(function () {
        var shop = new $.Shop("#site");
    });

})(jQuery);
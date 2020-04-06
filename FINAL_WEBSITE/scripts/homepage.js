//importing list of item objects from items.js
import { items_list } from './items.js'

//creating results list in session storage
createResults();
createAccount();
checkCart();

//jquery function to execute search function upon submit event on searchbar
$("#searchbar").submit(search);


//function used to search user query against items in items.js
function search() {
    var query = $("#search_input").val()

    //creating results_list which is a subset of items_list with elements that match the search query
    var results_list = items_list.filter(e => {
        return e.name.toUpperCase().includes(query.toUpperCase()) || query.toUpperCase().includes(e.name.toUpperCase())
    });


    //pulling cart info from session storage
    var cart_string = sessionStorage.getItem("cart");

    //updating results list to not include any items that have been added to the cart
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

    //updating results stored in session storage and pushing back to session storage
    var resultsObject = JSON.parse(results);
    var resultCopy = resultsObject;
    var items = resultCopy.items;
    for (var i = 0; i < results_list.length; i++) {
        items.push(results_list[i]);
    }

    sessionStorage.setItem('results', JSON.stringify(resultCopy));
}

//This function creates the initial results list in session storage
function createResults() {
    sessionStorage.removeItem('results');
    var results = {};
    results.items = [];

    sessionStorage.setItem("results", JSON.stringify(results));
}

function createAccount() {

    //adding account credentials to session storage if no credential exist
    if (sessionStorage.getItem("account") == null) {
        var account = {};
        account.credentials = [
            {
                "firstname": "Neil",
                "lastname": "Fassina",
                "billing_address": "1 University Dr, Colinton, AB",
                "shipping_address": "1 University Dr, Colinton, AB",
                "card_number": "4065972557141631"
            }
        ]
        sessionStorage.setItem("account", JSON.stringify(account));
    }
}

function checkCart() {
    var cart_string = sessionStorage.getItem("cart");
    if (cart_string != null) {
        var cart = JSON.parse(cart_string);
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
}

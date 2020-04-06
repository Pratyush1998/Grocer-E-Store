//this function validates credit card numbers inputed by the user
function cardnumber() {

    return new Promise((resolve, reject) => {
        //user inputted card number
        var inputtxt = document.getElementsByName('card_num')[0].value

        //regex patterns matching different credit card types
        var am_express = /^(?:3[47][0-9]{13})$/;
        var visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercard = /^(?:5[1-5][0-9]{14})$/;


        //check if user input matches any of the credit card types
        if (inputtxt.match(am_express) || inputtxt.match(visa) || inputtxt.match(mastercard)) {
            resolve();
        }
        else {
            //alert("Not a valid card number!");
            reject("Not a valid card number!");
        }
    });
}

//This function checks if the user has filled all fields when submitting ther form
function checkEmpty() {

    return new Promise((resolve, reject) => {
        var form_inputs = document.getElementsByClassName('form-control');

        //go through all inputs
        for (i = 0; i < form_inputs.length; i++) {
            //check if input is empty
            if (form_inputs[i].value == "") {
                //alert("All fields must be filled");
                return reject("All fields must be filled");
            }
        }

        resolve();
    });
}

//this function updates the account credentials in session storage to reflect
//what the user has entered
function updateAccount(postal_code) {
    accountList = [];

    //for every dom element of class form-control
    $(".form-control").each(function () {
        //push the value of the form-control element to accountList
        accountList.push($(this).val());
    });

    //remove current account credentials from session storage
    sessionStorage.removeItem('account');
    var account = {};
    account.credentials = [];

    var credentials = {
        "firstname": accountList[0].charAt(0).toUpperCase() + accountList[0].substring(1),
        "lastname": accountList[1].charAt(0).toUpperCase() + accountList[1].substring(1),
        "billing_address": accountList[2],
        "shipping_address": accountList[3],
        "card_number": accountList[4],
        "ship_postal_code": postal_code
    }
    account.credentials.push(credentials);

    //push new account credentials to session storage
    sessionStorage.setItem("account", JSON.stringify(account));
    //debugger;
    window.location.href = "../html/account.html"

}

//function to check if form was filled correctly
async function validateForm(postal_code) {

    const fullForm = checkEmpty();
    const validCard = cardnumber();

    Promise.all([fullForm, validCard])
        .then(values => {
            console.log(values);
            //debugger;
            updateAccount(postal_code);
        })
        .catch(error => {
            alert(error);
        });
}

window.onload = function () {
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

    var credentials = JSON.parse(sessionStorage.getItem("account")).credentials[0];

    var html =
        '<div class="form-group"> ' +
        '<label>Firstname</label> ' +
        `<input class="form-control" type="text" name="firstname" placeholder="John" value='${credentials.firstname}'> ` +
        '</div> ' +
        '<div class="form-group"> ' +
        '<label>Lastname</label> ' +
        `<input class="form-control" type="text" placeholder="Doe" value='${credentials.lastname}'> ` +
        '</div> ' +
        '<div class="form-group"> ' +
        '<label>Billing Address</label> ' +
        `<input class="form-control address" id="billing" type="text" placeholder="1234 Street, City, Province" value='${credentials.billing_address}'> ` +
        '</div> ' +
        '<div class="form-group"> ' +
        '<label>Shipping Address</label> ' +
        `<input class="form-control address" id="shipping" type="text" placeholder="1234 Street, City, Province" value='${credentials.shipping_address}'> ` +
        '</div> ' +
        '<div class="form-group"> ' +
        '<label>Card Number</label> ' +
        `<input class="form-control" type="text" name="card_num" placeholder="5105105105105100" value='${credentials.card_number}'> ` +
        '</div> '

    var form = $("#fields");

    form.append(html);

    //calling Google Maps API to add autocomplete feature to shipping and billing address fields
    var bill_autocomplete = new google.maps.places.Autocomplete(document.getElementById("billing"));
    var ship_autocomplete = new google.maps.places.Autocomplete(document.getElementById("shipping"));

    var postal_code = null;
    ship_autocomplete.addListener('place_changed', function () {
        postal_code = ship_autocomplete.getPlace().address_components.slice(-1)[0].long_name;
        //debugger;
    })
    $("input.btn").click(function () {
        validateForm(postal_code);
    });
};
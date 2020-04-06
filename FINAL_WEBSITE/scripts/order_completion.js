//run after DOM elements have been loaded on to page
window.onload = function () {
    //get shipping address from session storage
    var shippingAddress = JSON.parse(sessionStorage.getItem("account")).credentials[0].shipping_address;
    //generate a random number
    //https://stackoverflow.com/questions/3437133/javascript-generate-a-random-number-that-is-9-numbers-in-length/3437180
    var randNum = Math.random().toString().slice(2, 11);

    var address_components = JSON.parse(sessionStorage.getItem("account")).credentials[0].shipping_address.split(", ");
    var street = address_components[0];
    var city = address_components[1];
    var state = address_components[2];
    var country = address_components[3];
    var postal_code = JSON.parse(sessionStorage.getItem("account")).credentials[0].ship_postal_code;

    //debugger;

    //making api call to determine delivery time given the shipping address
    $.ajax({
        url: 'https://sandbox-api.postmen.com/v3/rates',
        headers: {
            'Content-Type': 'application/json',
            'postmen-api-key': f'{os.environ.get('POSTMEN_API_KEY')}'
        },
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(
            {
                "async": false,
                "shipper_accounts": [
                    {
                        "id": f"{os.environ('fedex_account_id')}"
                    }
                ],
                "is_document": false,
                "shipment": {
                    "ship_from": {
                        "contact_name": "Pratyush Bhandari",
                        "company_name": "Prat",
                        "street1": "100 King St W",
                        "country": "CAN",
                        "type": "residential",
                        "postal_code": "M5X 1A9",
                        "city": "Toronto",
                        "phone": "4168628138",
                        "street2": null,
                        "tax_id": null,
                        "street3": null,
                        "state": "ON",
                        "email": "test@hotmail.com",
                        "fax": null
                    },
                    "ship_to": {
                        "contact_name": "Dr. Moises Corwin",
                        "phone": "1-140-225-6410",
                        "email": "Giovanna42@yahoo.com",
                        "street1": `${street}`,
                        "city": `${city}`,
                        "postal_code": `${postal_code}`,
                        "state": `${state}`,
                        "country": `${country}`,
                        "type": "residential"
                    },
                    "parcels": [
                        {
                            "description": "Food XS",
                            "box_type": "custom",
                            "weight": {
                                "value": 2,
                                "unit": "kg"
                            },
                            "dimension": {
                                "width": 20,
                                "height": 40,
                                "depth": 40,
                                "unit": "cm"
                            },
                            "items": [
                                {
                                    "description": "Food Bar",
                                    "origin_country": "USA",
                                    "quantity": 2,
                                    "price": {
                                        "amount": 3,
                                        "currency": "USD"
                                    },
                                    "weight": {
                                        "value": 0.6,
                                        "unit": "kg"
                                    },
                                    "sku": "imac2014"
                                }
                            ]
                        }
                    ]
                }
            }
        ),
        beforeSend: function () {
            // Show image container
            $(".loader").show();
        },
        success: function (data) {
            console.log(data.meta.code)
            //debugger;
            if (data.meta.code != 200) {
                var html =
                    '<h1>Congrats Your Order Has Been Made!</h1> ' +
                    `<h3>Order #: ${randNum}</h3> ` +
                    `<h3>Shipping to: ${shippingAddress}</h3> ` +
                    `<h3>Estimated Delivery Date: ASAP</h3> `

                var p = document.getElementById('content');
                var newElement = document.createElement('div');
                newElement.innerHTML = html;
                p.appendChild(newElement);
            }
            else {
                //getting delivery date from API response
                var delivery_date = data.data.rates[0].delivery_date.split("T")[0];
                //debugger;
                //put shipping address, delivery date and random number in html content
                var html =
                    '<h1>Congrats Your Order Has Been Made!</h1> ' +
                    `<h3>Order #: ${randNum}</h3> ` +
                    `<h3>Shipping to: ${shippingAddress}</h3> ` +
                    `<h3>Estimated Delivery Date: ${delivery_date}</h3> `

                var p = document.getElementById('content');
                var newElement = document.createElement('div');
                newElement.innerHTML = html;
                p.appendChild(newElement);
            }
        },
        complete: function (data) {
            // Hide image container
            $(".loader").hide();
        },
        error: handleError = function (jqXHR, exception) {
            var html =
                '<h1>Congrats Your Order Has Been Made!</h1> ' +
                `<h3>Order #: ${randNum}</h3> ` +
                `<h3>Shipping to: ${shippingAddress}</h3> ` +
                `<h3>Estimated Delivery Date: ASAP</h3> `

            var p = document.getElementById('content');
            var newElement = document.createElement('div');
            newElement.innerHTML = html;
            p.appendChild(newElement);

        }
    });
};

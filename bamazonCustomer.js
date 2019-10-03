//declare global variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var gResults;
var gAnswer_item;
var gAnswer_units;
var newStock;

//create the connection to the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

//connect mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
});

connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    // make a global pointer to the results for other functions
    gResults = results;

    //display all items for sale
    for (i = 0; i < gResults.length; i++) {
        var item = gResults[i].item_id;
        var name = gResults[i].product_name;
        var price = gResults[i].price;
    }

    // start the user input part of the program
    start();
});

//function that prompts the user for action
function start() {
    // display all items for sale
    console.table(gResults, ["item_id", "product_name", "price"]);

    //prompt the user to buy items
    inquirer
        .prompt({
            name: "product_to_purchase",
            type: "input",
            message: "What is the ID of the product you would like to buy?"
        })
        .then(function (answer_item) {
            gAnswer_item = answer_item;
            //validate user input with a flag - assume the item_id is invalid
            var item_isvalid = false;

            //if the item_id matches one of the results-the item_id is valid 
            for (i = 0; i < gResults.length; i++) {
                if (answer_item.product_to_purchase == gResults[i].item_id) {
                    item_isvalid = true;
                };
            }
            if (item_isvalid) {
                //run function to prompt for number of units
                unitAmount();
            } else {
                //start over
                console.log("Item ID is invalid.");
                start();
            }
        })
};

function unitAmount() {
    inquirer
        .prompt({
            name: "units_to_purchase",
            type: "input",
            message: "How many units would you like to buy?"
        })
        .then(function (answer_units) {
            gAnswer_units = answer_units;
            checkInventory();
        })
};

function checkInventory() {
    //query the database for the stock_quantity of item_id
    connection.query("SELECT stock_quantity FROM products WHERE item_id = " + gAnswer_item.product_to_purchase, function (err, results) {
        if (err) throw err;
        //if we don't have enough in stock-log that to the user
        if (parseInt(gAnswer_units.units_to_purchase) > results[0].stock_quantity) {
            console.log("Sorry, insufficent quantity!!");
            start();
        } else {
            //if we have enough in stock-subtract the units ordered from stock_quantity 
            newStock = (results[0].stock_quantity - parseInt(gAnswer_units.units_to_purchase));
            updateInventory();
        }
    });
};

function updateInventory() {
    //subtract the units ordered from stock_quantity 
    connection.query("UPDATE products SET stock_quantity = " + newStock + " WHERE item_id = " + gAnswer_item.product_to_purchase, function (err, results) {
        if (err) throw err;
        displayInvoice();
    });
};

function displayInvoice() {
    //query the database for the price of item_id
    connection.query("SELECT price FROM products WHERE item_id = " + gAnswer_item.product_to_purchase, function (err, results) {
        if (err) throw err;
        var totalCost = (parseInt(gAnswer_units.units_to_purchase) * results[0].price);
        //display the total cost to the user
        console.log("Thank you for your purchase. Your total cost is: $" + totalCost);
        start();
    });
}
return;
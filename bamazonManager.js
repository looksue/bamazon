//declare global variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var gResults;
var gAnswer_menu;
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

    //capture all items for sale
    for (i = 0; i < gResults.length; i++) {
        var item = gResults[i].item_id;
        var name = gResults[i].product_name;
        var price = gResults[i].price;
    }

    // clear the terminal and start the user input part of the program
    console.log('\033[2J');
    start();
});

//function that prompts the user for action
function start() {
    // display all items for sale
    //console.table(gResults, ["item_id", "product_name", "price"]);

    //prompt user to view products for sale
    inquirer
        .prompt({
            name: "menu_option",
            type: "list",
            message: "What would you like to view?",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        })
        .then(function (answer_menu) {
            gAnswer_menu = answer_menu;
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
    connection.query("SELECT stock_quantity FROM products WHERE item_id = " + gAnswer_menu.product_to_purchase, function (err, results) {
        if (err) throw err;
        //if we don't have enough in stock-log that to the user
        if (parseInt(gAnswer_units.units_to_purchase) > results[0].stock_quantity) {
            console.log('\033[2J');
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
    connection.query("UPDATE products SET stock_quantity = " + newStock + " WHERE item_id = " + gAnswer_menu.product_to_purchase, function (err, results) {
        if (err) throw err;
        displayInvoice();
    });
};

function displayInvoice() {
    //query the database for the price of item_id
    connection.query("SELECT price FROM products WHERE item_id = " + gAnswer_menu.product_to_purchase, function (err, results) {
        if (err) throw err;
        var totalCost = (parseInt(gAnswer_units.units_to_purchase) * results[0].price);
        //clear the terminal and display the total cost to the user
        console.log('\033[2J');
        console.log("Thank you for your purchase. Your total cost is: $" + totalCost);
        start();
    });
}
return;
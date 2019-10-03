//declare global variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var gResults;

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
    // display all items for sale
    console.table(gResults, ["item_id", "product_name", "price"]);

    // start the user input part of the program
    start();
});

//function that prompts the user for action
function start() {
    //prompt the user to buy items
    inquirer
        .prompt({
            name: "product_to_purchase",
            type: "input",
            message: "What is the ID of the product you would like to buy?"
        })
        .then(function (answer_item) {
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
            checkInventory();
        })
};

function checkInventory() {
    

};
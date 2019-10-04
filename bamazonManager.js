//declare global variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var gResults;
var gAnswer_menu;
var gAnswer_units;
var newStock;
var gName;
var gDept;
var gPrice;
var gQty;

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
    console.log("\033[2J");
    start();
});

//function that prompts the user for action
function start() {

    //prompt user to view products for sale
    inquirer
        .prompt({
            name: "menu_option",
            type: "list",
            message: "What would you like to view?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        //based on user input-determine which function to run
        .then(function (answer_menu) {
            gAnswer_menu = answer_menu;
            if (gAnswer_menu.menu_option === "View Products for Sale") {
                viewProducts();
            } else if (gAnswer_menu.menu_option === "View Low Inventory") {
                viewLowInventory();
            } else if (gAnswer_menu.menu_option === "Add to Inventory") {
                addInventory();
            } else if (gAnswer_menu.menu_option === "Add New Product") {
                addProduct();
            }
        })
};

function viewProducts() {
    //query the database for the products for sale
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

        // display all items for sale
        console.table(gResults, ["item_id", "product_name", "price", "stock_quantity"]);
        start();
    });
};

function viewLowInventory() {
    //query the database for the products for sale
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;

        // make a global pointer to the results for other functions
        gResults = results;

        //capture all items for sale
        for (i = 0; i < gResults.length; i++) {
            var item = gResults[i].item_id;
            var name = gResults[i].product_name;
            var price = gResults[i].price;
        }

        // display all items for sale
        console.log("\033[2J");
        console.table(gResults, ["item_id", "product_name", "price", "stock_quantity"]);
        start();
    });
};

function addInventory() {
    //prompt the user to add inventory to a product
    inquirer
        .prompt({
            name: "product_to_increase",
            type: "input",
            message: "What is the ID of the product you would like to add inventory to?"
        })
        .then(function (answer_item) {
            gAnswer_item = answer_item;
            //validate user input with a flag - assume the item_id is invalid
            var item_isvalid = false;

            //if the item_id matches one of the results-the item_id is valid 
            for (i = 0; i < gResults.length; i++) {
                if (answer_item.product_to_increase == gResults[i].item_id) {
                    item_isvalid = true;
                };
            }
            if (item_isvalid) {
                //run function to prompt for number of units
                unitAmount();
            } else {
                //clear the terminal and start over
                console.log("\033[2J");
                console.log("Item ID is invalid.");
                viewProducts();
            }
        })
};

function unitAmount() {
    inquirer
        .prompt({
            name: "units_to_increase",
            type: "input",
            message: "How many units would you like to increase?"
        })
        .then(function (answer_units) {
            gAnswer_units = answer_units;
            increaseInventory();
        })
};

function increaseInventory() {
    //query the database for the stock_quantity of item_id
    connection.query("SELECT stock_quantity FROM products WHERE item_id = " + gAnswer_item.product_to_increase, function (err, results) {
        if (err) throw err;

        //do the math
        newStock = (results[0].stock_quantity + parseInt(gAnswer_units.units_to_increase));
        updateInventory();
    });
};

function updateInventory() {
    //add the units to stock_quantity 
    connection.query("UPDATE products SET stock_quantity = " + newStock + " WHERE item_id = " + gAnswer_item.product_to_increase, function (err, results) {
        if (err) throw err;
        console.log("\033[2J");
        viewProducts();
    });
};

function addProduct() {
    // mySQL should manage the item_id because it's AUTO_INCREMENT
    // ask the user for the product name (pName)
    inquirer
        .prompt({
            name: "pName",
            type: "input",
            message: "What is the name of the product to add?"
        })
        .then(function (answer_pName) {
            gName = answer_pName;
            // ask the user for the product department (pDept)
            inquirer
                .prompt({
                    name: "pDept",
                    type: "input",
                    message: "What department does it belong to?"
                })
                .then(function (answer_pDept) {
                    gDept = answer_pDept;
                    // ask the user for the product price (pPrice)
                    inquirer
                        .prompt({
                            name: "pPrice",
                            type: "input",
                            message: "What is the price of the new product?"
                        })
                        .then(function (answer_pPrice) {
                            gPrice = answer_pPrice;
                            // ask the user for the product stock_quantity (pQty)
                            inquirer
                                .prompt({
                                    name: "pQty",
                                    type: "input",
                                    message: "How many units would you like to stock?"
                                })
                                .then(function (answer_pQty) {
                                    gQty = answer_pQty;
                                    // update the database with an INSERT command
                                    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + gName.pName + "', '" + gDept.pDept + "', " + gPrice.pPrice + "," + gQty.pQty + ")", function (err, results) {
                                        if (err) throw err;
                                        viewProducts();
                                    });
                                });

                        });

                });

        });
};

return;
//declare global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

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
    //run start to prompt user after connection
    start();
});

//function that prompts the user for action
function start() {
    // query the database for all items for sale
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //display all items for sale
        for (i = 0; i < results.length; i++) {
            var item = results[i].item_id;
            var name = results[i].product_name;
            var price = results[i].price;
            console.log(item + "          " + name + "          " + price);
        }
        console.table(results, ["item_id", "product_name", "price"]);
        //prompt the user to buy items
    });
    /*   inquirer.prompt ({
           name: "idofproduct",
           type: "list",
           message: "What product would you like to buy?",
           choices: [list from database]
       }) */
};

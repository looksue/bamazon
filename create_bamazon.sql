CREATE database bamazon;
USE bamazon;
CREATE table products (
	item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
    price DECIMAL(13,2) NOT NULL, 
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);
    

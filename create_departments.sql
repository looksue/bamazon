USE bamazon;
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
	department_id INT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(13,4) NULL,
    PRIMARY KEY (department_id)
    );
    


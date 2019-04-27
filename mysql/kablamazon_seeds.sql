DROP DATABASE IF EXISTS kablamazon_db;
CREATE DATABASE kablamazon_db;
USE kablamazon_db;

CREATE TABLE products (
    item_id int auto_increment not null,
    product_name varchar(50) not null,
    department_name varchar(50) null,
    price decimal(10,2) not null,
    stock_quantity int null,
    sales int null default 0,
    primary key (item_id)
);

CREATE TABLE department (
    departent_id int auto_increment not null, 
    department_name varchar(50) not null,
    overhead_costs decimal(10,2) not null,
    product_sales int null default 0,
    total_profit decimal(10,2) null default 0,
    primary key (departent_id)
);

insert into products (product_name, department_name, price, stock_quantity, sales)
values ("Jogger Pants, Navy", "Clothing", 35, 60, 30), ("Cane Umbrella, Black", "Clothing", 60, 11, 15), ("Two Gallon Fish Tank", "Pet Supplies", 20, 70, 5), ("Bladeless House Fan", "Housewares", 200, 10, 15), ("Airfryer", "Kitchenware", 30, 17, 23), ("Wireless Phone Charging Pad", "Electronics", 20, 55, 55), ("Flip Flops, Blue", "Clothing", 15, 70, 36), ("iPhone Case", "Electronics", 30, 99, 213), ("Rechargable Flashlights", "Tools", 15, 22, 16), ("14 in 1 Minitool", "Tools", 10, 25, 50), ("Men's Button Down Shirt, Checkered", "Clothing", 40, 70, 65), ("Next-Gen Gaming Console", "Electronics", 400, 7, 500);

INSERT INTO department (department_name, overhead_costs)
VALUES ("Clothing", 10000), ("Pet Supplies", 11200), ("Housemares", 17500), ("Kitchenware", 10000), ("Electronics", 12500), ("Tools", 15000);
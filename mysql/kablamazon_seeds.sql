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

CREATE TABLE departments (
    department_id int auto_increment not null, 
    department_name varchar(50) not null,
    overhead_costs decimal(10,2) not null,
    primary key (department_id)
);

insert into products (product_name, department_name, price, stock_quantity, sales)
values ("Jogger Pants, Navy", "Clothing", 35, 60, 30), ("Cane Umbrella, Black", "Clothing", 60, 11, 15), ("Two Gallon Fish Tank", "Pet Supplies", 20, 70, 5), ("Bladeless House Fan", "Housewares", 200, 10, 15), ("Airfryer", "Kitchenware", 30, 17, 23), ("Wireless Phone Charging Pad", "Electronics", 20, 55, 55), ("Flip Flops, Blue", "Clothing", 15, 70, 36), ("iPhone Case", "Electronics", 30, 99, 213), ("Rechargable Flashlights", "Tools", 15, 22, 16), ("14 in 1 Minitool", "Tools", 10, 25, 50), ("Men's Button Down Shirt, Checkered", "Clothing", 40, 70, 65), ("Next-Gen Gaming Console", "Electronics", 400, 7, 500);

INSERT INTO departments (department_name, overhead_costs)
VALUES ("Clothing", 1000), ("Pet Supplies", 1120), ("Housewares", 1750), ("Kitchenware", 1000), ("Electronics", 1250), ("Tools", 1500);

-- this renders a table that counts all sales, figures out revenue and profit.
-- SELECT products.department_name, SUM(sales) AS total_sales, AVG(sales) AS avg_sales, AVG(price) AS avg_price, (SUM(sales) * AVG(price)) as revenue,
-- departments.overhead_costs AS overhead, ((SUM(sales) * AVG(price))-departments.overhead_costs) AS profit
-- FROM products
-- JOIN departments ON products.department_name=departments.department_name
-- GROUP BY products.department_name, overhead;
DROP DATABASE kablamazon_db;
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

insert into products (product_name, department_name, price, stock_quantity)
values ("Jogger Pants, Navy", "Clothing", 35, 400), ("Cane Umbrella, Black", "Clothing", 60, 200), ("Two Gallon Fish Tank", "Pet Supplies", 20, 55), ("Bladeless House Fan", "Housewares", 200, 60), ("Airfryer", "Kitchenware", 30, 100), ("Wireless Phone Charging Pad", "Electronics", 20, 500), ("Flip Flops, Blue", "Apparel", 15, 200), ("iPhone Case", "Electronics", 30, 250), ("Rechargable Flashlights", "Tools", 15, 200), ("14 in 1 Minitool", "Tools", 10, 25), ("Men's Button Down Shirt, Checkered", "Clothing", 40, 400), ("Next-Gen Gaming Console", "Electronics", 400, 7);
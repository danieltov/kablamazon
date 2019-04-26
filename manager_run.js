// CONSTANTS
const mysql = require('mysql'),
    inquirer = require('inquirer'),
    global = require('./global.js'),
    connection = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'kablamazon_db'
    });

// FUNCTIONS

function start() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message:
                    'Welcome to the Kablamazon Manager CLI. What would you like to do?',
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product'
                ]
            }
        ])
        .then(function(answer) {
            switch (answer.action) {
                case 'View Products for Sale':
                    viewProducts();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
            }
        });
}

function viewProducts() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        console.log('Fetching all products...');
        console.table(res);
        connection.end();
    });
}

function lowInventory() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 50',
        function(err, res) {
            if (err) throw err;
            console.log(
                'Fetching products with less than 50 items in stock...'
            );
            console.table(res);
        }
    );
}

function addInventory() {
    let inventory = [];
    connection.query(
        'SELECT item_id, product_name, stock_quantity FROM products',
        function(err, res) {
            if (err) throw err;
            inventory = res;
            console.log('Fetching current iventory');
            console.table(inventory);
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'item_id',
                    message:
                        "Enter the item_id of product you'd like to re-order.",
                    validate: global.isNum
                }
            ]);
        }
    );
    connection.query('UPDATE products SET ? WHERE ?', [
        {
            stock_quantity: answer.newStock + inventory[i].stock_quantity
        },
        {
            item_id: answer.item_id
        }
    ]);
}

connection.connect(function(err) {
    if (err) throw err;
    start();
});

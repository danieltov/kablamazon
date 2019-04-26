// CONSTANTS
const mysql = require('mysql'),
    inquirer = require('inquirer'),
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

connection.connect(function(err) {
    if (err) throw err;
    start();
});

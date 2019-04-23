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
    let inventory = [];
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        inventory = res;
        console.log(
            `Welcome to Kablamazon! Check out our inventory of random things. \n=== AVAILABLE PRODUCTS ===\n`
        );
        inventory.forEach(x =>
            console.log(
                `Product ID: ${x.item_id} - ${x.product_name} - $${
                    x.price
                }\n=================================\n`
            )
        );
    });
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'What do you want to buy? \n\n Enter the Product ID:',
            validate: isNum
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like?',
            validate: isNum
        }
    ]);
}

function isNum(val) {
    if (isNan(val))
        return console.log('Please enter a valid Product ID number');
    return true;
}

connection.connect(function(err) {
    if (err) throw err;
    // functions
    start();
    connection.end();
    // buy()
});

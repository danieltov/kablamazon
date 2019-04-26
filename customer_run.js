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
    let inventory = [];
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        inventory = res;
        console.log(
            `Welcome to Kablamazon! Check out our inventory of random things. \n=== AVAILABLE PRODUCTS ===\n`
        );
        console.table(inventory);
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'item_id',
                    message:
                        'What do you want to buy? \n\n Enter the Product ID:',
                    validate: global.isNum
                },
                {
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like?',
                    validate: global.isNum
                }
            ])
            .then(function(answers) {
                for (let i = 0; i < inventory.length; i++) {
                    if (inventory[i].item_id == answers.item_id) {
                        if (inventory[i].stock_quantity > answers.quantity) {
                            connection.query(
                                'UPDATE products SET ? WHERE ?',
                                [
                                    {
                                        stock_quantity:
                                            inventory[i].stock_quantity -
                                            answers.quantity
                                    },
                                    {
                                        item_id: answers.item_id
                                    }
                                ],
                                function(err, res) {
                                    if (err) throw err;
                                    console.log(
                                        `Purchase complete.
                                \nThat set you back $${inventory[i].price *
                                    answers.quantity}. 
                                \nEnjoy your ${inventory[i].product_name}!`
                                    );
                                    connection.end();
                                }
                            );
                        } else {
                            console.log(
                                'Insufficient stock, cannot complete purchase. Please, try again.'
                            );
                            start();
                        }
                    }
                }
            });
    });
}

connection.connect(function(err) {
    if (err) throw err;
    start();
});

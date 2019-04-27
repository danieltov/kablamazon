// CONSTANTS
const dot = require('dotenv').config(),
    keys = require('./keys.js'),
    mysql = require('mysql'),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    global = require('./global.js'),
    log = console.log,
    connection = mysql.createConnection({
        host: keys.sql.host,
        port: 8889,
        user: keys.sql.user,
        password: keys.sql.password,
        database: keys.sql.database
    });

// FUNCTIONS

function storeFront() {
    let inventory = [];
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        inventory = res;

        log(
            chalk.green(
                '\n\n' +
                    global.createTable(
                        inventory,
                        'item_id',
                        'product_name',
                        'price'
                    )
            )
        );

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
                let chosenItem = global.findItem(inventory, answers);
                if (typeof chosenItem !== 'object') {
                    log(
                        chalk.bgRed.bold(
                            'Did not find that item. Please try again.'
                        )
                    );

                    storeFront();
                    return;
                }

                if (chosenItem.stock_quantity > answers.quantity) {
                    makeSale(chosenItem, answers);
                } else {
                    log(
                        chalk.bgRed.bold(
                            'Insufficient stock, cannot complete purchase. Please, try again.'
                        )
                    );
                    storeFront();
                }
            });
    });
}

function makeSale(item, data) {
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [
            {
                stock_quantity:
                    parseInt(item.stock_quantity) - parseInt(data.quantity),
                sales: data.quantity
            },
            {
                item_id: data.item_id
            }
        ],
        function(err, res) {
            if (err) throw err;
            log(
                chalk.bgGreen.bold(
                    `Purchase complete. That set you back $${item.price *
                        data.quantity}. Enjoy your ${item.product_name}!`
                )
            );
            connection.end();
        }
    );
}

connection.connect(function(err) {
    if (err) throw err;
    log('                                              Welcome To');
    log(
        chalk.bgCyan
            .bold(` __    __            __        __                                                                 
/  |  /  |          /  |      /  |                                                                
$$ | /$$/   ______  $$ |____  $$ |  ______   _____  ____    ______   ________   ______   _______  
$$ |/$$/   /      \\ $$      \\ $$ | /      \\ /     \\/    \\  /      \\ /        | /      \\ /       \\ 
$$  $$<    $$$$$$  |$$$$$$$  |$$ | $$$$$$  |$$$$$$ $$$$  | $$$$$$  |$$$$$$$$/ /$$$$$$  |$$$$$$$  |
$$$$$  \\   /    $$ |$$ |  $$ |$$ | /    $$ |$$ | $$ | $$ | /    $$ |  /  $$/  $$ |  $$ |$$ |  $$ |
$$ |$$  \\ /$$$$$$$ |$$ |__$$ |$$ |/$$$$$$$ |$$ | $$ | $$ |/$$$$$$$ | /$$$$/__ $$ \\__$$ |$$ |  $$ |
$$ | $$  |$$    $$ |$$    $$/ $$ |$$    $$ |$$ | $$ | $$ |$$    $$ |/$$      |$$    $$/ $$ |  $$ |
$$/   $$/  $$$$$$$/ $$$$$$$/  $$/  $$$$$$$/ $$/  $$/  $$/  $$$$$$$/ $$$$$$$$/  $$$$$$/  $$/   $$/ `)
    );

    storeFront();
});

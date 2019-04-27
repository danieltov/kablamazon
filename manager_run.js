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

function manager() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do today?',
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
        log(chalk.bgBlue.bold('Fetching all products...'));
        log(
            chalk.green(
                '\n\n' +
                    global.createTable(
                        res,
                        'item_id',
                        'product_name',
                        'price',
                        'stock_quantity',
                        'sales'
                    )
            )
        );
        connection.end();
    });
}

function lowInventory() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 50',
        function(err, res) {
            if (err) throw err;
            log(
                chalk.bgBlue.bold(
                    'Fetching products with less than 50 items in stock...'
                )
            );
            log(
                chalk.green(
                    '\n\n' +
                        global.createTable(
                            res,
                            'item_id',
                            'product_name',
                            'price',
                            'stock_quantity',
                            'sales'
                        )
                )
            );
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
            log(chalk.bgBlue.bold('Fetching current iventory...'));
            log(
                chalk.green(
                    '\n\n' +
                        global.createTable(
                            res,
                            'item_id',
                            'product_name',
                            'stock_quantity'
                        )
                )
            );
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'item_id',
                        message:
                            "Enter the item_id of product you'd like to re-order.",
                        validate: global.isNum
                    },
                    {
                        type: 'input',
                        name: 'newStock',
                        message: 'Enter amount of new stock you want to order',
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
                        start();
                        return;
                    }
                    connection.query('UPDATE products SET ? WHERE ?', [
                        {
                            stock_quantity:
                                parseInt(answers.newStock) +
                                parseInt(chosenItem.stock_quantity)
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ]);

                    log(chalk.bgGreen.bold('Inventory was updated!'));

                    connection.query(
                        `SELECT item_id, product_name, stock_quantity FROM products WHERE item_id = ${
                            chosenItem.item_id
                        }`,
                        function(err, res) {
                            if (err) throw err;
                            console.table(res);
                        }
                    );
                    connection.end();
                });
        }
    );
}

function newProduct() {
    // need: product_name, department_name, price, stock_quantity
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'product_name',
                message: 'Enter product name:'
            },
            {
                type: 'input',
                name: 'department_name',
                message: 'Enter department name:'
            },
            {
                type: 'input',
                name: 'price',
                message: 'Enter price:',
                validate: global.isNum
            },
            {
                type: 'input',
                name: 'stock_quantity',
                message: 'Enter stock quantity:',
                validate: global.isNum
            }
        ])
        .then(function(answers) {
            log(answers);
            connection.query(
                `INSERT INTO kablamazon_db.products (product_name, department_name, price, stock_quantity) 
                VALUES (${answers.product_name}, ${
                    answers.department_name
                }, ${parseInt(answers.price)}, ${parseInt(
                    answers.stock_quantity
                )})`,
                function(err, res) {
                    if (err) throw err;
                    log(chalk.bgGreen.bold('Successfully added item!'));
                    viewProducts();
                }
            );
        });
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
    log(
        chalk.italic.bold(
            '                                              For Managers'
        )
    );
    manager();
});

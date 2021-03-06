// CONSTANTS
const g = require('./global.js');

// FUNCTIONS

function manager() {
    g.inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do today?',
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product',
                    'Clock Out'
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
                default:
                    g.con.end();
            }
        });
}

function viewProducts() {
    g.con.query('select * from products', function(err, res) {
        if (err) throw err;
        g.log(g.chalk.bgBlue.bold('Fetching all products...'));
        g.log(
            g.chalk.green(
                '\n\n' +
                    g.createTable(
                        res,
                        'item_id',
                        'product_name',
                        'price',
                        'stock_quantity',
                        'sales'
                    )
            )
        );
        g.log(
            g.chalk.bgBlue.bold('Taking you back to the Manager Terminal...')
        );
        manager();
    });
}

function lowInventory() {
    g.con.query('SELECT * FROM products WHERE stock_quantity < 50', function(
        err,
        res
    ) {
        if (err) throw err;
        g.log(
            g.chalk.bgBlue.bold(
                'Fetching products with less than 50 items in stock...'
            )
        );
        g.log(
            g.chalk.green(
                '\n\n' +
                    g.createTable(
                        res,
                        'item_id',
                        'product_name',
                        'price',
                        'stock_quantity',
                        'sales'
                    )
            )
        );
        g.log(
            g.chalk.bgBlue.bold('Taking you back to the Manager Terminal...')
        );
        manager();
    });
}

function addInventory() {
    let inventory = [];

    g.con.query(
        'SELECT item_id, product_name, stock_quantity FROM products',
        function(err, res) {
            if (err) throw err;
            g.log(g.chalk.bgBlue.bold('Fetching current iventory...'));
            g.log(
                g.chalk.green(
                    '\n\n' +
                        g.createTable(
                            res,
                            'item_id',
                            'product_name',
                            'stock_quantity'
                        )
                )
            );
            inventory = res;
            g.inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'item_id',
                        message:
                            "Enter the item_id of product you'd like to re-order.",
                        validate: g.isNum
                    },
                    {
                        type: 'input',
                        name: 'newStock',
                        message: 'Enter amount of new stock you want to order',
                        validate: g.isNum
                    }
                ])
                .then(function(answers) {
                    let chosenItem = g.findItem(inventory, answers);
                    if (typeof chosenItem !== 'object') {
                        g.log(
                            g.chalk.bgRed.bold(
                                'Did not find that item. Please try again.'
                            )
                        );
                        start();
                        return;
                    }
                    let id = chosenItem.item_id;
                    let stock =
                        parseInt(answers.newStock) +
                        parseInt(chosenItem.stock_quantity);

                    restock(id, stock);
                });
        }
    );
}

function restock(id, stock) {
    g.con.query(
        'UPDATE products SET ? WHERE ?',
        [
            {
                stock_quantity: stock
            },
            {
                item_id: id
            }
        ],
        function(err, res) {
            if (err) throw err;
            g.log(g.chalk.bgGreen.bold('Inventory was updated!'));
            g.con.query(
                `SELECT item_id, product_name, stock_quantity FROM products WHERE item_id = ${id}`,
                function(err, res) {
                    if (err) throw err;
                    g.log(
                        g.chalk.green(
                            '\n\n' +
                                g.createTable(
                                    res,
                                    'item_id',
                                    'product_name',
                                    'stock_quantity'
                                )
                        )
                    );

                    g.log(
                        g.chalk.bgBlue.bold(
                            'Taking you back to the Manager Terminal...'
                        )
                    );
                    manager();
                }
            );
        }
    );
}

function newProduct() {
    g.inquirer
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
                validate: g.isNum
            },
            {
                type: 'input',
                name: 'stock_quantity',
                message: 'Enter stock quantity:',
                validate: g.isNum
            }
        ])
        .then(function(answers) {
            let name = answers.product_name,
                dept = answers.department_name,
                price = answers.price,
                stock = answers.stock_quantity;

            createItem(name, dept, price, stock);
        });
}

function createItem(name, dept, price, stock) {
    g.con.query(
        `INSERT INTO products 
                SET ?`,
        {
            product_name: name,
            department_name: dept,
            price: price,
            stock_quantity: stock
        },
        function(err, res) {
            if (err) throw err;
            g.log(g.chalk.bgGreen.bold('Successfully added item!'));
            viewProducts();
        }
    );
}

g.con.connect(function(err) {
    if (err) throw err;
    g.log('\n\n\n                                              Welcome To');
    g.log(
        g.chalk.bgCyan
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
    g.log(
        g.chalk.italic.bold(
            '                                              For Managers'
        )
    );
    manager();
});
// We're done!

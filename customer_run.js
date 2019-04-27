// CONSTANTS
const g = require('./global.js');

// FUNCTIONS

function storeFront() {
    let inventory = [];
    g.con.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        inventory = res;

        g.log(
            g.chalk.green(
                '\n\n' +
                    g.createTable(inventory, 'item_id', 'product_name', 'price')
            )
        );

        g.inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'item_id',
                    message:
                        'What do you want to buy? \n\n Enter the Product ID:',
                    validate: g.isNum
                },
                {
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like?',
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

                    storeFront();
                    return;
                }

                if (chosenItem.stock_quantity > answers.quantity) {
                    makeSale(chosenItem, answers);
                } else {
                    g.log(
                        g.chalk.bgRed.bold(
                            'Insufficient stock, cannot complete purchase. Please, try again.'
                        )
                    );
                    storeFront();
                }
            });
    });
}

function makeSale(item, data) {
    g.con.query(
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
            g.log(
                g.chalk.bgGreen.bold(
                    `Purchase complete. That set you back $${item.price *
                        data.quantity}. Enjoy your ${item.product_name}!`
                )
            );
            g.con.end();
        }
    );
}

g.con.connect(function(err) {
    if (err) throw err;
    g.log('                                              Welcome To');
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

    storeFront();
});

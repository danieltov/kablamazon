// CONSTANTS
const g = require('./global.js');

function supe() {
    g.inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                choices: [
                    'See Sales Info by Department',
                    'Add Department',
                    'Exit'
                ]
            }
        ])
        .then(function(answer) {
            switch (answer.action) {
                case 'Add Department':
                    addDept();
                    break;
                case 'See Sales Info by Department':
                    sales();
                    break;
                default:
                    g.con.end();
            }
        });
}

function addDept() {
    g.inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter department name'
            },
            {
                type: 'input',
                name: 'costs',
                message: 'Enter overhead costs',
                validate: g.isNum
            }
        ])
        .then(function(answers) {
            insertDept(answers.name, answers.costs);
        });
}

function insertDept(name, costs) {
    g.con.query(
        'INSERT INTO departments SET ?',
        { department_name: name, overhead_costs: parseInt(costs) },
        function(err, res) {
            if (err) throw err;
            g.log(g.chalk.bgGreen.bold('Successfully added new department!'));
            g.log(
                g.chalk.bgBlue.bold(
                    'Taking you back to the Manager Terminal...'
                )
            );
            supe();
        }
    );
}

function sales() {
    g.con.query(
        `SELECT products.department_name, SUM(sales) AS total_sales, AVG(sales) AS avg_sales, AVG(price) AS avg_price, (SUM(sales) * AVG(price)) as revenue,
departments.overhead_costs AS overhead, ((SUM(sales) * AVG(price))-departments.overhead_costs) AS profit
FROM products
JOIN departments ON products.department_name=departments.department_name
GROUP BY products.department_name, overhead`,
        function(err, res) {
            if (err) throw err;

            g.log(
                g.chalk.green(
                    '\n\n' +
                        g.createTable(
                            res,
                            'department_name',
                            'total_sales',
                            'avg_sales',
                            'avg_price',
                            'revenue',
                            'overhead',
                            'profit'
                        )
                )
            );
            g.log(
                g.chalk.bgBlue.bold(
                    'Taking you back to the Supervisor Terminal...'
                )
            );
            supe();
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
            '                                              For Supervisors'
        )
    );
    supe();
});

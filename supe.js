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
            g.log(insertDept(answers.name, answers.costs));
        });
}

function insertDept(name, costs) {
    console.log(name);
    console.log(costs);
    g.con.query(
        'INSERT INTO department (department_name, overhead_costs) VALUES ?',
        { department_name: name, overhead_costs: parseInt(costs) },
        function(err, res) {
            if (err) throw err;
            return res;
        }
    );
}

function sales() {}

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
    g.log(
        g.chalk.italic.bold(
            '                                              For Supervisors'
        )
    );
    supe();
});

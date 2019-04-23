const mysql = require('mysql'),
    inquirer = require('inquirer'),
    connection = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'kablamazon_db'
    });

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    // functions
});

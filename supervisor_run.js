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

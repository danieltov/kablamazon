// CONSTANTS
const dot = require('dotenv').config(),
    sql = require('./sql.js'),
    mysql = require('mysql'),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    global = require('./global.js'),
    connection = mysql.createConnection({
        host: sql.host,
        port: sqp.port,
        user: sql.user,
        password: sql.password,
        database: sql.database
    });

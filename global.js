const dot = require('dotenv').config(),
    keys = require('./keys.js'),
    mysql = require('mysql'),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    Table = require('cli-table'),
    log = console.log,
    con = mysql.createConnection({
        host: keys.sql.host,
        port: 8889,
        user: keys.sql.user,
        password: keys.sql.password,
        database: keys.sql.database
    });

module.exports = {
    dot,
    keys,
    mysql,
    inquirer,
    chalk,
    log,
    con,
    isNum: function(val) {
        {
            if (isNaN(val))
                return console.log('Please enter a valid Product ID number');
            return true;
        }
    },
    findItem: function(source, target) {
        for (let i = 0; i < source.length; i++) {
            if (source[i].item_id == target.item_id) {
                return source[i];
            }
        }
    },
    selectQuery: function(tab, ...cols) {
        con.query(`SELECT ${cols} FROM ${tab}`, function(err, data) {
            if (err) throw err;
            return data;
        });
    },
    createTable: function(data, ...args) {
        let table = new Table({
            chars: {
                top: '═',
                'top-mid': '╤',
                'top-left': '╔',
                'top-right': '╗',
                bottom: '═',
                'bottom-mid': '╧',
                'bottom-left': '╚',
                'bottom-right': '╝',
                left: '║',
                'left-mid': '╟',
                mid: '─',
                'mid-mid': '┼',
                right: '║',
                'right-mid': '╢',
                middle: '│'
            }
        });

        let tableHeads = [];

        args.forEach(x => tableHeads.push(String(x)));

        table.push(tableHeads);

        data.forEach(x => {
            let itemArr = [];
            args.forEach(y => itemArr.push(x[y]));
            table.push(itemArr);
        });
        return table.toString();
    }
};
// We're done!

//required npm files
const mysql = require('mysql');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');

const db = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

//establishes connection to DB and calls menu fuction
db.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to Bamazon Supervisor View:\n");
    menu();
});

//Initial prompt menu when program launches
const menu = () => {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: "What would you like to do?",
            choices: ['View Product Sales by Department', 'Create New Department']
        }
    ]).then(function (response) {
        switch (response.choice) {
            case 'View Product Sales by Department':
                departmentSales();
                break;
            case 'Create New Department':
                addDepartment();
                break;
        }
    });
};

//Displays sales by department
const departmentSales = () => {
    db.query("SELECT departments.department_id AS 'Department ID', departments.department_name AS 'Department Name', departments.over_head_costs AS 'Over Head Costs', SUM(products.product_sales) AS 'Product Sales', SUM(products.product_sales) - departments.over_head_costs AS 'Total Profit' FROM departments INNER JOIN products ON products.department_name = departments.department_name GROUP BY departments.department_name ORDER BY department_id; ", function (err, res) {
        if (err) throw err;
        printTable(res);
        db.end();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'department',
            message: 'What is the name of the department?'
        },
        {
            name: 'overHeadCost',
            message: 'What are the over head costs?'
        }
    ]).then((response) => {
        const overHeadNum = parseInt(response.overHeadCost);
        db.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?,?)',
            [response.department, overHeadNum], function (err, res) {
                if (err) throw err;
                console.log("\nNew Department Added to Database\n");
                db.end();
            });
    });
};
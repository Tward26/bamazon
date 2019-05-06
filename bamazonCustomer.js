const mysql = require('mysql');
const inquirer = require('inquirer');
const {printTable} = require('console-table-printer');

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

  db.connect(function(err) {
    if (err) throw err;
    console.log("\nWelcome to Bamazon, Here's what we have available currently:\n");
    displayItems();
  });

  const displayItems = () => {
      db.query('SELECT product_name AS "Product Name", department_name AS "Department", price AS "Price", stock_quantity AS "Quantity" FROM products', function(err, res) {
          if(err) throw err;
          printTable(res);
          db.end();
      });
  };
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
    console.log("\nWelcome to Bamazon Manager View:\n");
    menu();
});

//Initial prompt menu when program launches
const menu = () => {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: "What would you like to do?",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(function (response) {
        switch (response.choice) {
            case 'View Products for Sale':
                displayItems();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
        }
    });
};

//Displays items available
const displayItems = () => {
    db.query('SELECT item_id AS "ID", product_name AS "Product Name", price AS "Price", stock_quantity AS "Quantity" FROM products', function (err, res) {
        if (err) throw err;
        printTable(res);
        db.end();
    });
};

//Shows inventory items with 5 or less stock remaining
const lowInventory = () => {
    db.query('SELECT item_id AS "ID", product_name AS "Product Name", stock_quantity AS "Quantity" FROM products WHERE stock_quantity <= 5', function (err, res) {
        if (err) throw err;
        printTable(res);
        db.end();
    });
};

const addInventory = () => {
    inquirer.prompt([
        {
            name: 'id',
            message: "What item ID would you like to increase the inventory of?",
            validate: function (inputtxt) {
                var numbers = /^\d+$/;
                if ((inputtxt.match(numbers)) && ((inputtxt > 0)) && (inputtxt <= 10)) {
                    return true;
                }
                return false;
            }
        },
        {
            name: 'quantity',
            message: 'How many of this item would you like to add?',
            validate: function (inputtxt) {
                var numbers = /^\d+$/;
                if (inputtxt.match(numbers)) {
                    return true;
                }
                return false;
            }
        }
    ]).then((response) => {
        stockCheck(response.id, response.quantity);
    });

};

const stockCheck = (id, quantity) => {
    db.query('SELECT stock_quantity FROM products WHERE item_id = ?', id, function (err, res) {
        if (err) throw err;
        const newInventoryTotal = parseInt(quantity) + res[0].stock_quantity;
        updateInventory(id, newInventoryTotal);
    });
};

const updateInventory = (id, quantity) => {
    db.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [quantity, id], function (err, res) {
        if (err) throw err;
        console.log("\nInventory Updated!\n");
        db.end();
    });
};

const addProduct = () => {
    inquirer.prompt([
        {
            name: 'product',
            message: 'What is the name of the product?'
        },
        {
            name: 'department',
            message: 'What department does it belong in?'
        },
        {
            name: 'price',
            message: 'What is the retail price?'
        },
        {
            name: 'quantity',
            message: 'How many would you like to add to inventory?'
        }
    ]).then((response) => {
        const priceNum = parseFloat(response.price);
        const quantityNum = parseInt(response.quantity);
        db.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)',
         [response.product, response.department, priceNum, quantityNum], function(err,res){
             if(err) throw err;
             console.log("\nProduct Added to Database\n");
             db.end();
         });
    });
};
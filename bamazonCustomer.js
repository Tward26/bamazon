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

db.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to Bamazon, Here's what we have available currently:\n");
    displayItems();
});

const displayItems = () => {
    db.query('SELECT item_id AS "ID", product_name AS "Product Name", price AS "Price" FROM products', function (err, res) {
        if (err) throw err;
        const diffItems = res.length;
        printTable(res);
        console.log("\n");
        purchaseItems(diffItems);
    });
};

const purchaseItems = (numberOfItems) => {
    inquirer.prompt([
        {
            name: 'id',
            message: "What item would you like to buy? Please type it's ID number:",
            validate: function (inputtxt) {
                var numbers = /^\d+$/;
                if ((inputtxt.match(numbers)) && ((inputtxt > 0)) && (inputtxt <= numberOfItems)) {
                    return true;
                }
                return false;
            }
        },
        {
            name: 'quantity',
            message: 'How many of this item would you like to buy?',
            validate: function (inputtxt) {
                var numbers = /^\d+$/;
                if (inputtxt.match(numbers)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (response) {
        stockCheck(response.id, response.quantity);
    });
};

const stockCheck = (id, quantity) => {
    db.query('SELECT item_id, stock_quantity FROM products WHERE item_id = ?', id, function (err, res) {
        if (err) throw err;
        if (res[0].stock_quantity < quantity) {
            console.log("\nInsufficient quantity available!");
            db.end();
        }
        else {
            placeOrder(id, res[0].stock_quantity, quantity);
        }
    });
};

const placeOrder = (id, quantityOnHand, quantityOrdered) => {
    const stockLeft = quantityOnHand - quantityOrdered;
    db.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [stockLeft, id], function (err, res) {
        if (err) throw err;
        console.log("\nOrder successfully placed!\n");
        orderTotal(id, quantityOrdered);
    });
};

const orderTotal = (id, quantity) => {
    db.query('SELECT price FROM products WHERE item_id = ?', id, function (err, res) {
        if (err) throw err;
        const total = (quantity * res[0].price).toFixed(2);
        console.log("Your order total is: $" + total);
        updateProductSales(id, total);
    });
};

const updateProductSales = (id, total) => {
    db.query('SELECT product_sales FROM products WHERE item_id = ?', id, (err, res) => {
        if (err) throw err;
        const newTotal = parseInt(total) + res[0].product_sales;
        db.query('UPDATE products SET product_sales = ? WHERE item_id = ?', [newTotal, id], function (err, res) {
            if (err) throw err;
            db.end();
        });
    });

};
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products
(
    item_id INT
    AUTO_INCREMENT NOT NULL
    , product_name VARCHAR
    (255) NOT NULL
    , department_name VARCHAR
    (255) NOT NULL
    , price DECIMAL
    (10,2) NOT NULL
    , stock_quantity INT NOT NULL
    , PRIMARY KEY
    (item_id)
);

    INSERT INTO products
    VALUES
        (1, "Hollow Knight", "Games", 19.99, 5),
        (2, "Red Dead Redemption II", 'Games', 59.99, 10),
        (3, "Days Gone", "Games", 59.99, 3),
        (4, 'In the Mouth of Madness', 'Movies', 22.99, 2),
        (5, 'Mad Max: Fury Road', 'Movies', 21.99, 7),
        (6, 'Spider-Man: Into the Spider-Verse', 'Movies', 27.99, 1),
        (7, 'Baraka: A World Beyond Words', 'Movies', 19.99, 15),
        (8,'Saga of the Swamp Thing: Vol 1', 'Comics', 15.99, 2),
        (9, "Kraven's Last Hunt", 'Comics', 27.99, 4),
        (10, "Saga: Volume 8", 'Comics', 10.99, 2);




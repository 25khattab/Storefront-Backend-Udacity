CREATE TABLE orders (id SERIAL PRIMARY KEY,product_id integer REFERENCES products(id),user_id integer REFERENCES users(id),quantity INTEGER NOT NULL,status VARCHAR(30))
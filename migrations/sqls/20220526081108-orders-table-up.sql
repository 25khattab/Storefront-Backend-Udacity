CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(30),
    user_id integer REFERENCES users(id)
);
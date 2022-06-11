## Install Instructions
To install devDependencies & dependencies

    npm i
 
 ## .env 
    
    POSTGRES_HOST=127.0.0.1
    POSTGRES_DB=store
    POSTGRES_TEST_DB=store_test
    POSTGRES_USER=yourUsername
    POSTGRES_PASSWORD=yourPassword
    ENV=dev
    BCRYPT_PASSWORD=change_Here_To_What_You_Want
    SALT_ROUNDS=10
    TOKEN_SECRET=change_Here_To_What_You_Want

## Database and Migrations
the Database used in the project was Postgres database
### to install database packages by yourself 

```
npm i pg
```

```
npm i db-migrate db-migrate-pg
```
### run this command to login to default postgres user 

```
psql -U postgres
```
or

```
psql postgres
```
### then create your postgres username

```
create Role yourUsername with password 'yourPassword' SUPERUSER LOGIN CREATEDB;
```
### Default Port
Default port is 5432.



### Finally 

Remember to change the .env file to your own settings

## Scripts of project

    "prettier": "prettier --config .prettierrc 'src/**/*.ts' --write",
    "build": "rm -r build && npx tsc",
    "jasmine": "jasmine",
    "lint": "eslint 'src/**/*.ts' --fix",
    "delete-db": "db-migrate -e create db:drop store",
    "init-db": "db-migrate -e create db:create store && db-migrate up ",
    "start": "nodemon src/index.ts",
    "delete-test-db": "db-migrate -e create db:drop store_test",
    "init-test-db": "npm run delete-test-db &&db-migrate -e create db:create store_test && db-migrate -e test up ",
    "test": "export ENV=test && npm run init-test-db && npm run build && npm run jasmine && npm run delete-test-db ",
    "start-test": "export ENV=test && npm run init-test-db  && nodemon src/index.ts && npm run delete-test-db"

## Endpoints
    http://localhost:3000

### Users Endpoints
    Get  [/users]
    Get  [/users/:id]
    Post [/users]
    Post [/user/authenticate]

### products Endpoints
    Get  [/products]
    Get  [/products/:id]
    Post [/products]

### Orders Endpoints
   
    Get  [/orders]
    Get  [/:id]
    Post [/orders/:id/products]


## Database config 
    {
    "dev": {
        "driver": "pg",
        "host": {
            "ENV": "POSTGRES_HOST"
        },
        "database": {
            "ENV": "POSTGRES_DB"
        },
        "user": {
            "ENV": "POSTGRES_USER"
        },
        "password": {
            "ENV": "POSTGRES_PASSWORD"
        }
    },
    "test": {
        "driver": "pg",
        "host": {
            "ENV": "POSTGRES_HOST"
        },
        "database": {
            "ENV": "POSTGRES_TEST_DB"
        },
        "user": {
            "ENV": "POSTGRES_USER"
        },
        "password": {
            "ENV": "POSTGRES_PASSWORD"
        }
    },
    "create": {
        "driver": "pg",
        "host": {
            "ENV": "POSTGRES_HOST"
        },
        "user": {
            "ENV": "POSTGRES_USER"
        },
        "password": {
            "ENV": "POSTGRES_PASSWORD"
        }
    }
}

## Database schema 
```
TABLE users(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastNAME VARCHAR(100)NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL
);
```
```  
TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(100)
);
```
```
TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(30),
    user_id integer REFERENCES users(id)
);
```
```   
TABLE order_products(
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id integer REFERENCES orders(id),
    product_id integer REFERENCES products(id)
);
```


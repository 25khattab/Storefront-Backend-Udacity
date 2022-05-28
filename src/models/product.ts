import client from '../database';
import bcrypt from 'bcrypt';
import { resourceLimits } from 'worker_threads';
const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class productStore {
    async findByName(name: string): Promise<Product | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products where name=($1)';
            const result = await conn.query(sql, [name]);
            conn.release();
            if (result.rowCount) {
                return null;
            }
        } catch (Error) {
            console.log('error in product model');
        }

        return null;
    }

    async index(): Promise<Product[] | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            const products = result.rows as Product[];
            return products;
        } catch (Error) {
            console.log('error in product model');
        }
        return null;
    }
    async show(id: number): Promise<Product | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products where id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rowCount) {
                const product = result.rows[0] as Product;
                return product;
            }
        } catch (Error) {
            console.log('error in product model');
        }

        return null;
    }

    async create(p: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO products (name,price,category) values ($1,$2,$3) RETURNING *';
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            conn.release();
            const product = result.rows[0] as Product;
            return product;
        } catch (err) {
            throw new Error(`unable to create user ${err}`);
        }
    }
}

import client from '../database';
import express, { Response, Request } from 'express';
import bcrypt from 'bcrypt';
const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;
export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable to get users ${err}`);
        }
    }
    async show(id: number): Promise<User|null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users where id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            if(result.rows.length)
                return result.rows[0];
            return null;
        } catch (err) {
            throw new Error(`unable to get user with id=${id} ,${err}`);
        }
    }
    async create(u: User): Promise<User|null> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO users (firstName,lastName,email,password) values ($1,$2,$3,$4) RETURNING *';
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.firstName, u.lastName, u.email, hash]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            return null;
            throw new Error(`unable to create new user\nemail already exists`);
        }
    }
    async update(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const sql =
                'UPDATE users SET firstName=($1),lastName=($2),email=($3),password=($4) where id=($5) RETURNING *';
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.firstName, u.lastName, u.email, hash, u.id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to edit user ${error}`);
        }
    }
    async authenticate(email: string, password: string): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE email = ($1)';
            const result = await conn.query(sql, [email]);
            if (result.rows.length) {
                const user: User = result.rows[0];
                if (bcrypt.compareSync(password + pepper, user.password)) {
                    return user;
                }
            }
            return null;
        } catch (err) {
            if (err instanceof Error) throw new Error(err.message);
            throw new Error(`err`);
        }
    }
}

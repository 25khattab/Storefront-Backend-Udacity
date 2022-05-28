import client from '../database';
import Logger from '../middlewares/logger';
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
    async findByEmail(email: string): Promise<User | null> {
        const conn = await client.connect();
        const checkSql = 'select * from users where email=($1)';
        const result = await conn.query(checkSql, [email]);
        conn.release();
        if (result == undefined) return null;
        if (result.rows.length) {
            return result.rows[0] as User;
        }
        return null;
    }
    async index(): Promise<User[]|null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT (id,firstName,lastName,email) FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            Logger.log(`unable to get users`,err);
        }
        return null;
    }
    async show(id: number): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users where id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length) 
                return result.rows[0];
        } catch (err) {
            Logger.log(`unable to get user with id = ${id}`,err);
        }
        return null;
    }
    async create(u: User): Promise<User | null> {
        try {
            const conn = await client.connect();
            const checkSql = 'select * from users where email=($1)';
            const check = await conn.query(checkSql, [u.email]);
            if (check.rows.length) {
                return null;
            }
            const sql =
                'INSERT INTO users (firstName,lastName,email,password) values ($1,$2,$3,$4) RETURNING *';
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.firstName, u.lastName, u.email, hash]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`unable to create user ${err}`);
        }
    }
}

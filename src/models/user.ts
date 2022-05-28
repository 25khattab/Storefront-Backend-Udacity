import client from '../database';
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
export type serUser = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
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
    async index(): Promise<serUser[] | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows as serUser[];
        } catch (err) {
            console.log(`unable to get users`, err);
        }
        return null;
    }
    async show(id: number): Promise<serUser | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users where id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length) {
                const user: serUser = result.rows[0];
                user.password = undefined;
                return user;
            }
            return null;
        } catch (err) {
            console.log(`unable to get user with id = ${id}`, err);
        }
        return null;
    }
    async create(u: User): Promise<serUser | null> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO users (firstName,lastName,email,password) values ($1,$2,$3,$4) RETURNING *';
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.firstName, u.lastName, u.email, hash]);
            conn.release();
            const user: serUser = result.rows[0];
            user.password = undefined;
            return user;
        } catch (err) {
            console.log('error in user model');
        }
        return null;
    }
}

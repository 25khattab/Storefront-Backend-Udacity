import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const config = {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};
console.log(process.env.ENV);

if (process.env.ENV === 'test') {
    config.database = process.env.POSTGRES_TEST_DB;
}
const client = new Pool({
    host: config.host,
    database: config.database,
    user: config.username,
    password: config.password,
});
export default client;

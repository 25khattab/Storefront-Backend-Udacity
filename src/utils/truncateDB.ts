import client from '../database';

export const truncDB = async (): Promise<void> => {
    try {
        const conn = await client.connect();
        const sql = 'TRUNCATE TABLE orders, users, products, order_products RESTART IDENTITY';
        await conn.query(sql);
        conn.release();
    } catch (error) {
        console.log('error in truncDB', error);
    }
};

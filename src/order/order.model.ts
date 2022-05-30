import client from '../database';

export type Order = {
    id?: number;
    status: string;
    user_id: number;
};

export type orderProduct = {
    id?: number;
    quantity: number;
    order_id: number;
    product_id: number;
};
export type orderProduct2 = {
    name: string;
    quantity: number;
    price: number;
};

export class orderStore {
    async index(): Promise<Order[] | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM ORDERS';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            console.log('error in order model', error);
        }
        return null;
    }
    async create(o: Order): Promise<Order | null> {
        try {
            const conn = await client.connect();

            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';

            const result = await conn.query(sql, [o.status, o.user_id]);

            conn.release();

            const order: Order = result.rows[0];

            return order;
        } catch (error) {
            console.log('error in order model', error);
        }
        return null;
    }
    // find all orders related to user
    async findOrdersByuser(id: number): Promise<Order[] | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM ORDERS where user_id = ($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows;
        } catch (error) {
            console.log('error in order model', error);
        }
        return null;
    }

    async findProducts(orders: Order[]): Promise<orderProduct2[] | null> {
        if (orders != null) {
            const result: orderProduct2[] = [];
            for (let i = 0; i < orders.length; i++) {
                const conn = await client.connect();
                const sql = `SELECT products.name, products.price , order_products.quantity
                FROM order_products
                JOIN products ON order_products.product_id = products.id 
                AND order_products.order_id=($1);`;
                const res = (await conn.query(sql, [orders[i].id])).rows[0] as orderProduct2;
                result.push(res);
                conn.release();
            }
            return result;
        }
        return null;
    }

    async addProduct(p: orderProduct): Promise<orderProduct | null> {
        try {
            const sql =
                'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const conn = await client.connect();

            const result = await conn.query(sql, [p.quantity, p.order_id, p.product_id]);

            const order = result.rows[0];

            conn.release();

            return order;
        } catch (err) {
            console.log('error in order model', err);
        }
        return null;
    }
}

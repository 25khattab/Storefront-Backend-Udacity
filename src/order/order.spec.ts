import app from '../app';
import request from 'supertest';
import { truncDB } from '../utils/truncateDB';
import { createTestUser, loginTestUser } from '../utils/adminTestUser';
import { Order, orderStore } from './order.model';
import { Product } from '../product/product.model';
const req = request(app);
const store = new orderStore();
const testOrder: Order = {
    status: 'active',
    user_id: 1,
};
const testProduct: Product = {
    name: 'samsung s22',
    price: 20000,
    category: 'phones',
};
describe('Order Test', () => {
    describe('Testing the model functions', () => {
        beforeAll(async () => {
            await truncDB();
        });
        it('Test create function', async (): Promise<void> => {
            const result = (await store.create(testOrder)) as Order;
            if (result != null) {
                expect(result.status).toEqual(testOrder.status);
            }
        });
        it('Test index function', async (): Promise<void> => {
            const result = await store.index();
            expect(result).toBeTruthy();
        });
        it('Test findOrdersByuser function', async (): Promise<void> => {
            const result = await store.findOrdersByuser(1);
            if (result != null) expect(result[0].user_id).toEqual(1);
        });
    });

    describe('Testing the model endpoints', () => {
        beforeAll(async () => {
            await truncDB();
        });
        it('Testing index (get /orders)', async (): Promise<void> => {
            const result = await req.get('/orders');
            expect(result.status).toBe(200);
        });
        it('Testing create (post /orders/1/product)', async (): Promise<void> => {
            await createTestUser();
            const token: string = await loginTestUser();
            await req
                .post('/products')
                .send(testProduct)
                .set({ Authorization: 'Bearer ' + token });
            const result = await req
                .post('/orders/1/product')
                .send({ quantity: 2, product_id: 1 })
                .set({ Authorization: 'Bearer ' + token });
            expect(result.body.quantity).toEqual(2);
        });
        it('Testing ordersByUser (get /orders/1)', async () => {
            const result = await req.get('/orders/1');
            expect(result.body[0].name).toEqual(testProduct.name);
        });
        // it('Testing create (post /Products) for duplicated data', async (): Promise<void> => {
        //     const token: string = await loginTestUser();
        //     const result = await req
        //         .post('/products')
        //         .send(testProduct)
        //         .set({ Authorization: 'Bearer ' + token });
        //     expect(result.statusCode).toBe(400);
        // });
    });
});

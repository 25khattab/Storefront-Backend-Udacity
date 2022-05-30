import app from '../app';
import { Product, productStore } from './product.model';
import request from 'supertest';
import { truncDB } from '../utils/truncateDB';
import { createTestUser, loginTestUser } from '../utils/adminTestUser';
const req = request(app);
const store = new productStore();
const testProduct: Product = {
    name: 'samsung s22',
    price: 20000,
    category: 'phones',
};
describe('Product Test', () => {
    describe('Testing the model functions', () => {
        beforeAll(async () => {
            await truncDB();
        });
        it('Test create function', async (): Promise<void> => {
            const result = (await store.create(testProduct)) as Product;
            if (result != null) {
                expect(result.name).toEqual(testProduct.name);
            }
        });
        it('Test index function', async (): Promise<void> => {
            const result = await store.index();
            expect(result).toBeTruthy();
        });
        it('Test show function', async (): Promise<void> => {
            const result = await store.show(1);
            if (result != null) expect(result.name).toEqual(testProduct.name);
        });
    });

    describe('Testing the model endpoints', () => {
        beforeAll(async () => {
            await truncDB();
        });
        it('Testing index (get /products)', async (): Promise<void> => {
            const result = await req.get('/products');
            expect(result.status).toBe(200);
        });
        it('Testing create (post /products)', async (): Promise<void> => {
            await createTestUser();
            const token: string = await loginTestUser();
            const result = await req
                .post('/products')
                .send(testProduct)
                .set({ Authorization: 'Bearer ' + token });
            expect(result.body.product.name).toEqual(testProduct.name);
        });
        it('Testing show (get /products/1)', async () => {
            const result = await req.get('/products/1');
            expect(result.body.name).toEqual(testProduct.name);
        });
        it('Testing create (post /Products) for duplicated data', async (): Promise<void> => {
            const token: string = await loginTestUser();
            const result = await req
                .post('/products')
                .send(testProduct)
                .set({ Authorization: 'Bearer ' + token });
            expect(result.statusCode).toBe(400);
        });
    });
});

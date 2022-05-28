import { notEqual } from 'assert';
import app from '../app';
import { Product,productStore} from '../models/product';
import request from 'supertest';
import { truncDB } from '../utils/truncateDB';

const req = request(app);
const store = new productStore();
const testProduct: Product = {
    name: 'samsung s22',
    price: 20000,
    category: 'phones'
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
        afterAll(async () => {
            await truncDB();
        });
    });

    describe('Testing the model endpoints', () => {
        it('Testing index (get /Products)', async (): Promise<void> => {
            const result = await req.get('/products');
            expect(result.status).toBe(200);
        });
        it('Testing create (post /Products)', async (): Promise<void> => {
            const result = await req.post('/products').send(testProduct);
            expect(result.body.Product.name).toEqual(testProduct.name);
        });
        it('Testing create (post /Products) for duplicated data', async (): Promise<void> => {
            const result = await req.post('/products').send(testProduct);
            expect(result.statusCode).toBe(400);
        });
        it('Testing show (get /products/1)', async () => {
            const token = await req.post('/products/authenticate').send(testProduct);
            const result = await req
                .get('/Products/1')
                .set({ Authorization: 'Bearer ' + token.body.token });
            if (result != null) expect(result.body.name).toEqual(testProduct.name);
        });
        it('Testing show  (get /Products/2) for unauthorized Product', async (): Promise<void> => {
            const token = await req.post('/products/authenticate').send(testProduct);
            const result = await req
                .get('/Products/2')
                .set({ Authorization: 'Bearer ' + token.body.token });
            expect(result.body.Error).toEqual('Product id does not match!');
        });
    });

    afterAll(async () => {
        await truncDB();
    });
});

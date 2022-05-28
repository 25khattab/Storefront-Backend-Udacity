import { notEqual } from 'assert';
import app from '../app';
import { User, UserStore } from '../models/user';
import request from 'supertest';
import { truncDB } from '../utils/truncateDB';

const req = request(app);
const store = new UserStore();
const testUser: User = {
    firstName: 'test1',
    lastName: 'test2',
    email: 'omar@gmail.com',
    password: 'root',
};
describe('User Test', () => {
    describe('Testing the model functions', () => {
        beforeAll(async () => {
            await truncDB();
        });
        it('Test create function', async (): Promise<void> => {
            const result = (await store.create(testUser)) as User;
            if (result != null) {
                expect(result.email).toEqual(testUser.email);
                expect(result.password).not.toEqual(testUser.password);
            }
        });

        it('Test index function', async (): Promise<void> => {
            const result = await store.index();
            expect(result).toBeTruthy();
        });
        it('Test show function', async (): Promise<void> => {
            const result = await store.show(1);
            if (result != null) expect(result.email).toEqual(testUser.email);
            if (result != null) expect(result.password).toEqual(undefined);
        });
        afterAll(async () => {
            await truncDB();
        });
    });

    describe('Testing the model endpoints', () => {
        it('Testing index (get /users)', async (): Promise<void> => {
            const result = await req.get('/users');
            expect(result.status).toBe(200);
        });
        it('Testing create (post /users)', async (): Promise<void> => {
            const result = await req.post('/users').send(testUser);
            expect(result.body.user.email).toEqual(testUser.email);
            expect(result.body.user.password).toEqual(undefined);
            expect(result.statusCode).toBe(200);
        });
        it('Testing create (post /users) for duplicated data', async (): Promise<void> => {
            const result = await req.post('/users').send(testUser);
            expect(result.statusCode).toBe(400);
        });
        it('Testing show (get /users/1)', async () => {
            const token = await req.post('/users/authenticate').send(testUser);
            const result = await req
                .get('/users/1')
                .set({ Authorization: 'Bearer ' + token.body.token });
            if (result != null) expect(result.body.email).toEqual(testUser.email);
        });
        it('Testing show  (get /users/2) for unauthorized user', async (): Promise<void> => {
            const token = await req.post('/users/authenticate').send(testUser);
            const result = await req
                .get('/users/2')
                .set({ Authorization: 'Bearer ' + token.body.token });
            expect(result.body.Error).toEqual('User id does not match!');
        });
    });

    afterAll(async () => {
        await truncDB();
    });
});

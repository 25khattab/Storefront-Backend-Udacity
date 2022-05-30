import request from 'supertest';
import app from '../app';
import { UserStore } from '../user/user.model';
const store = new UserStore();
export const createTestUser = async () => {
    const user = {
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@test.com',
        password: 'root',
    };
    await store.create(user);
};
export const loginTestUser = async (): Promise<string> => {
    const user = {
        email: 'admin@test.com',
        password: 'root',
    };
    const response = await request(app).post('/users/authenticate').send(user);
    const token: string = response.body.token;
    return token;
};

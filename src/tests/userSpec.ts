import { notEqual } from 'assert';
import request from 'supertest';
import app from '../app';
import { User, UserStore } from "../models/user"
const store = new UserStore();
const testUser: User = {
    firstName: 'test1',
    lastName: 'test2',
    email: 'omar@gmail.com',
    password: 'root'
}

describe('Testing endpoint', () => {
    it('Result code should be 200 ', async (): Promise<void> => {
        const result = await request(app).get('/users');
        expect(result.status).toBe(200);
    });
});

describe('Testing the create function', () => {
    it("First Create", async (): Promise<void> => {
        const result = await store.create(testUser) as User;
        if (result != null) {
            expect(result.email).toEqual(testUser.email);
            expect(result.password).not.toEqual(testUser.password);
        }
    });
    it("Second Create should return null", async (): Promise<void> => {
        const result = await store.create(testUser);
        expect(result).toEqual(null);
    });
});

describe('Testing the show function',()=>{
    it('Result should be the email of user 1',async():Promise<void> =>{
        const result = await store.show(1);
        if(result!=null)
            expect(result.email).toEqual(testUser.email);
    });
    it('Result should be null of user 2',async():Promise<void> =>{
        const result = await store.show(2);
        expect(result).toEqual(null);
    });
});
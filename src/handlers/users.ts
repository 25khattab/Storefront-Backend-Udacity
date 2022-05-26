import express, { Response, Request, NextFunction } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
const store = new UserStore();
const index = async (_req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    const user: User = {
        email: req.body.email as string,
        firstName: req.body.firstName as string,
        lastName: req.body.lastName as string,
        password: req.body.password as string,
    };
    try {
        const newUser = await store.create(user);
        res.json(newUser);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ err: err.message, user: user });
        }
    }
};
const update = async (req: Request, res: Response) => {
    const user: User = {
        id: parseInt(req.params.id),
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    };
    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.TOKEN_SECRET as string
        ) as User;
        if (decoded.id !== user.id) {
            throw new Error('User id does not match!');
        }
    } catch (err) {
        res.status(401);
        res.json(err);
        return;
    }

    try {
        const updated = await store.update(user);
        res.json(updated);
    } catch (err) {
        res.status(400);
        res.json({ err, user });
    }
};
const authenticate = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await store.authenticate(email, password);
        const token = jwt.sign(
            { id: user?.id, firstName: user?.firstName },
            process.env.TOKEN_SECRET as string
        );
        res.json(token);
    } catch (error) {
        res.status(401);
        res.json({ error });
    }
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        if (authorizationHeader == undefined)
            res.status(401).json({ error: 'not auth' });
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
        console.log(authorizationHeader);
        next();
    } catch (error) {
        res.status(401);
    }
};

const userRoutes = (app: express.Application) => {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
    app.put('/users/:id', verifyAuthToken, update);
    app.post('/users/authenticate', authenticate);
};
export default userRoutes;

import express, { Response, Request } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middlewares/auth';
import verifyAuthorizToken from '../middlewares/authorization';

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
        const updated = await store.update(user);
        res.json(updated);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400);
            res.json({ Error: err.message });
        }
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
        if (error instanceof Error) {
            res.status(401);
            res.json({ error: error.message });
        }
    }
};
const userRoutes = express.Router();
userRoutes.get('/', index);
userRoutes.get('/:id', show);
userRoutes.post('/', create);
userRoutes.put('/:id', verifyAuthToken, verifyAuthorizToken, update);
userRoutes.post('/authenticate', authenticate);

export default userRoutes;

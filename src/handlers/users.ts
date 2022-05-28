import express, { Response, Request } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middlewares/auth';
import bcrypt from 'bcrypt';
import Logger from '../middlewares/logger';
const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.send(users);
    } catch (error) {}
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
        if (newUser != null) {
            const token = jwt.sign(
                { id: user?.id, firstName: user?.firstName },
                process.env.TOKEN_SECRET as string
            );
            res.header({Authorization: 'Bearer ' + token}).json({token:token});
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ err: err.message });
        }
    }
};
const authenticate = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await store.findByEmail(email);
        if(user == null){
            res.status(401).send({ msg: 'email not found'});
            return;
          }
          if (!bcrypt.compareSync(password + pepper, user.password)) {
            res.status(401).send({ msg: 'wrong password'});
            return;
        }
        const token = jwt.sign(
            { id: user?.id, firstName: user?.firstName },
            process.env.TOKEN_SECRET as string
        );
        res.header({Authorization: 'Bearer ' + token}).json({token:token});
    } catch (error) {
        Logger.log(`user handler error`,error);
    }
};
const userRoutes = express.Router();
userRoutes.get('/', index);
userRoutes.get('/:id', verifyAuthToken, show);
userRoutes.post('/', create);
userRoutes.post('/authenticate', authenticate);

export default userRoutes;

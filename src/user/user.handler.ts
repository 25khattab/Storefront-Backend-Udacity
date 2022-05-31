import express, { Response, Request } from 'express';
import { User, UserStore, serUser } from './user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authorizationLevel from '../middlewares/authorizationLevel';
import checkLoginToken from '../middlewares/checkLoginToken';
const pepper = process.env.BCRYPT_PASSWORD as string;

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.send(users);
    } catch (error) {
        console.log('error in users handler ', error);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(parseInt(req.params.id));
        res.json(user);
    } catch (error) {
        console.log('error in users handler ', error);
    }
};

const create = async (req: Request, res: Response) => {
    const user: User = {
        email: req.body.email as string,
        firstName: req.body.firstName as string,
        lastName: req.body.lastName as string,
        password: req.body.password as string,
    };
    try {
        const existed = await store.findByEmail(user.email);
        if (existed != null) {
            return res.status(400).send({ errMsg: 'user with this email exists' });
        }

        const newUser = await store.create(user);
        if (newUser != null) {
            const token = jwt.sign(
                { id: user?.id, firstName: user?.firstName },
                process.env.TOKEN_SECRET as string
            );
            newUser.password = undefined;
            res.status(200).json({ token: token, user: newUser });
        }
    } catch (err) {
        console.log('error in users handler ', err);
    }
};
const authenticate = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = (await store.findByEmail(email)) as serUser;
        if (user == null) {
            return res.status(401).send({ errMsg: 'email not found' });
        }
        if (!bcrypt.compareSync(password + pepper, user.password as string)) {
            return res.status(401).send({ errMsg: 'wrong password' });
        }
        user.password = undefined;
        const token = jwt.sign(user, process.env.TOKEN_SECRET as string);
        res.header({ Authorization: 'Bearer ' + token }).json({ token: token });
    } catch (error) {
        console.log(`user handler error`, error);
    }
};
const userRoutes = express.Router();
userRoutes.get('/', checkLoginToken, index);
userRoutes.get('/:id', checkLoginToken, authorizationLevel, show);
userRoutes.post('/', create);
userRoutes.post('/authenticate', authenticate);

export default userRoutes;

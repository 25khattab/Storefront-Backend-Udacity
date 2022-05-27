import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
const verifyAuthorizToken = (req: Request, res: Response, next: NextFunction) => {
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
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as User;
        if (decoded.id !== user.id) {
            throw new Error('User id does not match!');
        }
        next();
    } catch (err) {
        if (err instanceof Error) {
            res.status(401);
            res.json({ Error: err.message });
            return;
        }
    }
};
export default verifyAuthorizToken;

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
const authorizationLevel = (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);

    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as User;
        if (decoded.id !== id) {
            return res.status(401).json({ errMsg: 'User id does not match!' });
        }
        next();
    } catch (err) {
        if (err instanceof Error) {
            res.status(401);
            res.json({ errMsg: err.message });
            return;
        }
    }
};
export default authorizationLevel;

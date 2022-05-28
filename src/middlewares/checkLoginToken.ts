import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const checkLoginToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        if (authorizationHeader == undefined) {
            res.status(401).json({ error: 'not auth' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
        next();
    } catch (error) {
        res.status(401);
    }
};

export default checkLoginToken;

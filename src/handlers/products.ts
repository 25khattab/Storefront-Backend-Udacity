import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import checkLoginToken from '../middlewares/checkLoginToken';
import { Product, productStore } from '../models/product';

const store = new productStore();

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
    const product: Product = {
        name: req.body.name as string,
        price: req.body.price as number,
        category: req.body.category as string,
    };
    try {
        const existed = await store.findByName(product.name);
        if (existed != null) {
            return res.status(400).send({ msg: 'product with this name exists' });
        }

        const newProduct = await store.create(product);
        if (newProduct != null) {
            res.status(200).json({ product: newProduct });
        }
    } catch (err) {
        console.log('error in users handler ', err);
    }
};

const productRoutes = express.Router();
productRoutes.get('/', index);
productRoutes.get('/:id', show);
productRoutes.post('/', checkLoginToken, create);

export default productRoutes;

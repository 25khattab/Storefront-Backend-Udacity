import express, { Response, Request, NextFunction } from 'express';
import { orderProduct, Order, orderStore } from './order.model';
import authorizationLevel from '../middlewares/authorizationLevel';

const store = new orderStore();
const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index();
        res.send(orders);
    } catch (error) {
        console.log('error in order handler ', error);
    }
};
//the create function will be middleware
const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order: Order = {
            status: 'active',
            user_id: +req.params.id,
        };
        const newOrder = await store.create(order);
        res.locals.order_id=newOrder?.id;
        res.locals.product= req.body ;
        next();
    } catch (error) {
        res.status(401).json({ errMsg: 'error in create order handler' });
    }
};
const ordersByUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const orders = await store.findOrdersByuser(id);
        
        if (orders != null) {
            const result = await store.findProducts(orders);
            res.send(result);
        }

        res.status(400);
    } catch (error) {
        console.log('error in order handler ', error);
    }
};

const addProduct = async (req: Request, res: Response) => {
    const order: orderProduct = {
        quantity: parseInt(res.locals.product.quantity),
        order_id: res.locals.order_id,
        product_id: parseInt(res.locals.product.product_id),
    };
    try {
        const addedProduct = await store.addProduct(order);
        res.json(addedProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};
const orderRoutes = express.Router();
orderRoutes.get('/', index);
orderRoutes.get('/:id', ordersByUser);
orderRoutes.post('/:id/product', authorizationLevel, create, addProduct);
//orderRoutes.post('/authenticate', authenticate);
export default orderRoutes;

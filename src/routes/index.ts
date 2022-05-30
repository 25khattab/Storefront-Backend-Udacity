import express from 'express';
import userRoutes from '../user/user.handler';
import productRoutes from '../product/product.handler';
import orderRoutes from '../order/order.handler';
const routes = express.Router();

routes.get('/', (_req: express.Request, res: express.Response): void => {
    res.send('main api route');
});
routes.use('/users', userRoutes);
routes.use('/products', productRoutes);
routes.use('/orders', orderRoutes);
export default routes;

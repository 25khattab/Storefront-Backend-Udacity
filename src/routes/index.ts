import express from 'express';
import userRoutes from '../handlers/users';
const routes = express.Router();

routes.get('/', (_req: express.Request, res: express.Response): void => {
    res.send('main api route');
});
routes.use("/users",userRoutes);
export default routes;

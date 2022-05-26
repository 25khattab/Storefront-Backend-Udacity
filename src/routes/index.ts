import express from 'express';
const routes = express.Router();

routes.get('/', (_req: express.Request, res: express.Response): void => {
    res.send('main api route');
});
export default routes;

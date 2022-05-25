import express from 'express';
import articleRoutes from '../handlers/articles';
import articles from '../handlers/articles';
const routes = express.Router();

routes.get('/', (_req: express.Request, res: express.Response): void => {
    res.send('main api route');
});
routes.get('/articles', (_req: express.Request, res: express.Response): void => {
    res.send('main articles route');
});
export default routes;

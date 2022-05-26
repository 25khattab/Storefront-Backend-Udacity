import express from 'express';
import routes from './routes/index';
import userRoutes from './handlers/users';
import articleRoutes from './handlers/books';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(routes);
userRoutes(app);
articleRoutes(app);
export default app;

import express from 'express';
import routes from './routes/index';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
const app = express();

app.use(bodyParser.json());
app.use(routes);
userRoutes(app);
export default app;

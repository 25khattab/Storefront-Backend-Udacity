import express from 'express';
import articleRoutes from './handlers/articles';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json())

articleRoutes(app);

export default app;

import express from 'express';

import todoRoutes from './todo';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send(`Root Route`);
});

routes.use(todoRoutes);

export default routes;

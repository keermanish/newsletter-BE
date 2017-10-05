import express from 'express';

import { createTodo } from '../controllers/todo';

const todoRoutes = express.Router();

todoRoutes.post('/create', createTodo);

export default todoRoutes;

/*eslint-disable*/
import { Router } from 'express';
import { taskController } from './task.controller';
import {
  createValidator,
  updateValidator,
} from './task.validator';

// Fire the router function
export const taskRouter: Router = Router();

// Create a route for the root
taskRouter.get('/tasks', taskController.getAll);

taskRouter.post(
  '/tasks',
  createValidator,
  taskController.create,
);

taskRouter.put(
  '/tasks',
  updateValidator,
  taskController.update,
);

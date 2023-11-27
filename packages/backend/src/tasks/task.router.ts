/*eslint-disable*/
import { Router, Response, Request } from 'express';
import { taskController } from './task.controller';
import { createValidator } from './task.validator';
import { validationResult } from 'express-validator';
// Fire the router function
export const taskRouter: Router = Router();

// Create a route for the root
taskRouter.get('/tasks', taskController.getAll);

taskRouter.post(
  '/tasks',
  createValidator,

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    // Process the request when there are no validation errors
    // For example, save the task to the database
    // const task = await saveTaskToDatabase(req.body);

    // Send a success response
    return res
      .status(200)
      .json({ message: 'Task saved successfully' });
  },
);

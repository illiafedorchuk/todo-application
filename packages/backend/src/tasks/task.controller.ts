import { AppDataSource } from '../../index';
import { Task } from './task.entity';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TaskController {
  // Method for the get route
  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    // Declare a variable to hold all tasks
    let allTasks: Task[];

    // Fetch all tasks using the repository
    try {
      allTasks = await AppDataSource.getRepository(
        Task,
      ).find({
        order: {
          date: 'ASC',
        },
      });

      allTasks = instanceToPlain(allTasks) as Task[];

      return res.json(allTasks).status(200);
    } catch (_errors) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
  }

  // Method for the post route
  public async create(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    const newTask = new Task();

    // Add the data to the new task
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    // Save the task
    let createdTask: Task;

    try {
      createdTask =
        await AppDataSource.getRepository(Task).save(
          newTask,
        );

      //Convert the task instance to an object
      createdTask = instanceToPlain(createdTask) as Task;

      return res.json(createdTask).status(201);
    } catch (_error) {
      return res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }

  // Method for the put route
  public async update(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    // Fetch the task to be updated
    let task: Task | null;

    try {
      task = await AppDataSource.getRepository(
        Task,
      ).findOne({
        where: { id: req.body.id },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal server error' });
    }

    if (!task) {
      return res
        .status(404)
        .json({ error: 'Task not found' });
    }

    let updatedTask: UpdateResult;

    try {
      updatedTask = await AppDataSource.getRepository(
        Task,
      ).update(
        req.body.id,
        plainToInstance(Task, { status: req.body.status }),
      );

      updatedTask = instanceToPlain(
        updatedTask,
      ) as UpdateResult;

      return res.json(updatedTask).status(200);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Internal server error' });
    }
  }
}
export const taskController = new TaskController();

import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const task = await TaskService.createTask({ ...req.body, assignedTo: userId });
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await TaskService.getTasksForUser(req.user!.id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await TaskService.updateTask(id, req.user!.id, req.body);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await TaskService.deleteTask(id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
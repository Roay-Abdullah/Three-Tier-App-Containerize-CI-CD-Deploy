import { TaskRepository } from '../repositories/task.repository';
import { UserRepository } from '../repositories/user.repository';

export class TaskService {
  static async createTask(data: { title: string; description?: string; assignedTo: string; projectId?: string }) {
    // Business rule: max 5 pending tasks per user
    const pending = await TaskRepository.countPendingByUser(data.assignedTo);
    if (pending >= 5) {
      throw new Error('You cannot have more than 5 pending tasks.');
    }
    return TaskRepository.create(data);
  }

  static async getTasksForUser(userId: string) {
    return TaskRepository.findByUser(userId);
  }

  static async updateTask(id: string, userId: string, updates: any) {
    const task = await TaskRepository.findById(id);
    if (!task) throw new Error('Task not found');
    if (task.assignedTo !== userId) {
      // optionally allow admin to bypass
      throw new Error('You can only update your own tasks');
    }
    return TaskRepository.update(id, updates);
  }

  static async deleteTask(id: string, userId: string) {
    const task = await TaskRepository.findById(id);
    if (!task) throw new Error('Task not found');
    if (task.assignedTo !== userId) {
      throw new Error('You can only delete your own tasks');
    }
    return TaskRepository.delete(id);
  }
}
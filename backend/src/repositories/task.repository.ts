import prisma from '../db';
import { Task, Status } from '@prisma/client';

export class TaskRepository {
  static async create(data: { title: string; description?: string; assignedTo?: string; projectId?: string }) {
    return prisma.task.create({ data });
  }

  static async findById(id: string) {
    return prisma.task.findUnique({ where: { id }, include: { assignedUser: true, project: true } });
  }

  static async findByUser(userId: string) {
    return prisma.task.findMany({
      where: { assignedTo: userId },
      include: { project: true },
    });
  }

  static async update(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'assignedTo' | 'projectId'>>) {
    return prisma.task.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }

  static async countPendingByUser(userId: string) {
    return prisma.task.count({
      where: { assignedTo: userId, status: { not: 'DONE' } },
    });
  }
}
import { apiClient } from './api.client';
import { Task } from '../types';

export const tasksApi = {
  list: async (): Promise<Task[]> => {
    const res = await apiClient.get('/tasks');
    return res.data;
  },
  create: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await apiClient.post('/tasks', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Task>) => {
    const res = await apiClient.put(`/tasks/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
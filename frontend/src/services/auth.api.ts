import { apiClient } from './api.client';

export const authApi = {
  signup: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/signup', { email, password });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};
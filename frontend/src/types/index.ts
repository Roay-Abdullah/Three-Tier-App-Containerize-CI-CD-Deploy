export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Project {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedTo?: string;
  projectId?: string;
  project?: Project;
  createdAt: string;
  updatedAt: string;
}
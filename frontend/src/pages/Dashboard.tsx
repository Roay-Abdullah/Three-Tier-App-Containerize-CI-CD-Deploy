import { useEffect, useState } from 'react';
import { tasksApi } from '../services/tasks.api';
import { Task } from '../types';
import Navbar from '../components/common/Navbar';
import TaskForm from '../components/forms/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const data = await tasksApi.list();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

const handleCreate = async (data: { title: string; description?: string; projectId?: string }) => {
  await tasksApi.create({ ...data, status: 'TODO' });
  loadTasks();
};

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    await tasksApi.update(id, { status: newStatus });
    loadTasks();
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h1>My Tasks</h1>
        <TaskForm onSubmit={handleCreate} />
        <ul>
          {tasks.map(task => (
            <li key={task.id} style={{ margin: '0.5rem 0' }}>
              <span style={{ textDecoration: task.status === 'DONE' ? 'line-through' : 'none' }}>
                {task.title} - {task.status}
              </span>
              <button onClick={() => handleStatusToggle(task.id, task.status)}>
                Toggle Status
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

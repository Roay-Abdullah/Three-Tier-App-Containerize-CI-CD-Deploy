import { TaskService } from '../src/services/task.service';
import { TaskRepository } from '../src/repositories/task.repository';

jest.mock('../src/repositories/task.repository');

describe('TaskService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should not allow more than 5 pending tasks', async () => {
    (TaskRepository.countPendingByUser as jest.Mock).mockResolvedValue(5);
    await expect(TaskService.createTask({
      title: 'Test',
      assignedTo: 'user1',
    })).rejects.toThrow('more than 5 pending tasks');
  });

  it('should create a task if pending count < 5', async () => {
    (TaskRepository.countPendingByUser as jest.Mock).mockResolvedValue(3);
    (TaskRepository.create as jest.Mock).mockResolvedValue({ id: 'task1', title: 'Test' });
    const result = await TaskService.createTask({ title: 'Test', assignedTo: 'user1' });
    expect(result).toHaveProperty('id');
  });
});
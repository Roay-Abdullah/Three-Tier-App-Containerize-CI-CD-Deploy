import React, { useState } from 'react';
import { PlusIcon } from '../common/Icons';

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ flex: '1 1 240px' }}
          />

          <select
            className="input-field"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            style={{ width: 'auto', minWidth: '140px', cursor: 'pointer' }}
          >
            <option value="TODO">📌 To Do</option>
            <option value="IN_PROGRESS">⚡ In Progress</option>
            <option value="DONE">✅ Completed</option>
          </select>
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="Description (optional details)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <PlusIcon size={18} />
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
import { useEffect, useState, useMemo } from 'react';
import { tasksApi } from '../services/tasks.api';
import { Task } from '../types';
import Navbar from '../components/common/Navbar';
import TaskForm from '../components/forms/TaskForm';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  CheckCircleIcon,
  ClockIcon,
  ListTodoIcon,
  SearchIcon,
  TrashIcon,
  PlusIcon,
  SparklesIcon,
  FilterIcon
} from '../components/common/Icons';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL');
  const [showForm, setShowForm] = useState(false);

  const { user } = useAuth();
  const { addToast } = useToast();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.list();
      setTasks(data);
    } catch (err) {
      addToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (data: { title: string; description?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' }) => {
    try {
      await tasksApi.create({
        title: data.title,
        description: data.description,
        status: data.status || 'TODO',
      });
      addToast(`Task "${data.title}" created!`, 'success');
      loadTasks();
      setShowForm(false);
    } catch (err) {
      addToast('Error creating task', 'error');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    try {
      await tasksApi.update(id, { status: newStatus });
      addToast(`Task status updated to ${newStatus}`, 'info');
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    await handleStatusChange(task.id, nextStatus);
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await tasksApi.delete(id);
      addToast(`Deleted "${title}"`, 'warning');
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      addToast('Error deleting task', 'error');
    }
  };

  // Metrics calculations
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = activeFilter === 'ALL' || task.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, activeFilter]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Hero Banner */}
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👋</span>
              <h1 style={{ fontSize: '1.75rem', margin: 0 }}>
                Welcome back, <span className="gradient-text">{user?.email ? user.email.split('@')[0] : 'User'}</span>
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Manage your tasks, track your progress, and stay productive.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.5rem' }}
          >
            <PlusIcon size={20} />
            {showForm ? 'Close Form' : 'New Task'}
          </button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Tasks</span>
              <ListTodoIcon size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0.25rem' }}>{totalTasks}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All registered items</div>
          </div>

          {/* In Progress */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>In Progress</span>
              <ClockIcon size={20} style={{ color: '#fbbf24' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0.25rem', color: '#fbbf24' }}>
              {inProgressCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active focus items</div>
          </div>

          {/* Completed */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Completed</span>
              <CheckCircleIcon size={20} style={{ color: '#34d399' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0.25rem', color: '#34d399' }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Finished tasks</div>
          </div>

          {/* Completion Rate Bar */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Completion</span>
              <SparklesIcon size={20} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 0.25rem' }}>{completionRate}%</div>
            <div
              style={{
                height: '6px',
                width: '100%',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginTop: '0.4rem',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${completionRate}%`,
                  background: 'var(--accent-gradient)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Inline Task Form */}
        {showForm && (
          <div className="animate-fade-in">
            <TaskForm onSubmit={handleCreate} />
          </div>
        )}

        {/* Filter and Search Bar */}
        <div
          className="glass-card"
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <SearchIcon
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <FilterIcon size={16} style={{ color: 'var(--text-muted)', marginRight: '0.2rem' }} />
            {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  borderColor: activeFilter === filterKey ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: activeFilter === filterKey ? 'var(--accent-primary)' : 'transparent',
                  color: activeFilter === filterKey ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {filterKey === 'ALL' && `All (${totalTasks})`}
                {filterKey === 'TODO' && `To Do (${todoCount})`}
                {filterKey === 'IN_PROGRESS' && `In Progress (${inProgressCount})`}
                {filterKey === 'DONE' && `Done (${completedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Task List Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <SparklesIcon size={32} className="animate-fade-in" style={{ animationIterationCount: 'infinite' }} />
            <p style={{ marginTop: '0.5rem' }}>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className="glass-card"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--text-muted)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--bg-input)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <ListTodoIcon size={32} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No tasks found</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              {searchQuery
                ? `No tasks matching "${searchQuery}"`
                : activeFilter !== 'ALL'
                ? `No tasks with status "${activeFilter}"`
                : 'Get started by creating your very first task!'}
            </p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                <PlusIcon size={18} />
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredTasks.map((task) => {
              const isDone = task.status === 'DONE';
              return (
                <div
                  key={task.id}
                  className="glass-card animate-fade-in"
                  style={{
                    padding: '1.1rem 1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderLeft: `4px solid ${
                      task.status === 'DONE'
                        ? '#34d399'
                        : task.status === 'IN_PROGRESS'
                        ? '#fbbf24'
                        : '#60a5fa'
                    }`,
                  }}
                >
                  {/* Left: Quick toggle & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <button
                      onClick={() => handleToggleComplete(task)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: isDone ? 'none' : '2px solid var(--text-muted)',
                        background: isDone ? '#34d399' : 'transparent',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                      title={isDone ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isDone && <CheckCircleIcon size={16} />}
                    </button>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isDone ? 'line-through' : 'none',
                          wordBreak: 'break-word',
                        }}
                      >
                        {task.title}
                      </div>

                      {task.description && (
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            marginTop: '0.2rem',
                            wordBreak: 'break-word',
                          }}
                        >
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status Pill Selector & Delete button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <select
                      className={`status-pill ${task.status}`}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>

                    <button
                      onClick={() => handleDelete(task.id, task.title)}
                      className="btn-icon btn-danger"
                      title="Delete task"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

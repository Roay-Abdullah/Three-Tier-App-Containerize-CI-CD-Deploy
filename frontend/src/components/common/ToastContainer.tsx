import { useToast } from '../../hooks/useToast';
import { SparklesIcon, CheckCircleIcon, XIcon } from './Icons';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.type === 'success' ? (
            <CheckCircleIcon style={{ color: '#34d399' }} />
          ) : (
            <SparklesIcon style={{ color: 'var(--accent-primary)' }} />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="btn-icon"
            style={{ padding: '2px' }}
          >
            <XIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

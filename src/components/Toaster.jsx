import { useState, useCallback, useRef } from 'react';

// Events Canvas LMS would flag as suspicious
const SUSPICIOUS_EVENTS = {
  blur: {
    severity: 'high',
    title: '⚠️ Focus Lost',
    message: 'Canvas detected you left the quiz page.',
    detail: 'This would increment the "left quiz" counter.',
  },
  visibilitychange: {
    severity: 'critical',
    title: '🚨 Page Hidden',
    message: 'Canvas detected the tab is no longer visible.',
    detail: 'Quiz log: "Navigated away from the quiz."',
    onlyWhen: () => document.visibilityState === 'hidden',
  },
  beforeunload: {
    severity: 'critical',
    title: '🚨 Leaving Page',
    message: 'Canvas detected a page navigation attempt.',
    detail: 'Quiz would show "Are you sure you want to leave?" prompt.',
  },
  pagehide: {
    severity: 'high',
    title: '⚠️ Page Hiding',
    message: 'Canvas detected the page is being unloaded.',
    detail: 'Final answers auto-submitted before page closes.',
  },
  offline: {
    severity: 'warning',
    title: '📡 Connection Lost',
    message: 'Canvas lost connection to the server.',
    detail: 'Answers cannot be saved. Timer continues server-side.',
  },
  resize: {
    severity: 'low',
    title: '📐 Window Resized',
    message: 'Canvas detected a window resize.',
    detail: 'May indicate window dragged to another monitor.',
  },
  copy: {
    severity: 'high',
    title: '📋 Content Copied',
    message: 'Canvas detected a copy action on quiz content.',
    detail: 'Copying quiz questions to share or search externally.',
  },
  paste: {
    severity: 'high',
    title: '📌 Content Pasted',
    message: 'Canvas detected a paste action.',
    detail: 'Pasting answers from an external source.',
  },
  contextmenu: {
    severity: 'warning',
    title: '🖱️ Right-Click Menu',
    message: 'Canvas detected a right-click context menu.',
    detail: 'Some Canvas quizzes disable right-click to prevent copying.',
  },
  'devtools-shortcut': {
    severity: 'critical',
    title: '🚨 DevTools Shortcut',
    message: 'Canvas detected a DevTools keyboard shortcut.',
    detail: 'Students may inspect page source or modify quiz DOM.',
  },
  'screenshot-shortcut': {
    severity: 'high',
    title: '📸 Screenshot Detected',
    message: 'Canvas detected a screenshot shortcut.',
    detail: 'Student may be capturing quiz questions.',
  },
  'find-shortcut': {
    severity: 'warning',
    title: '🔎 Find in Page',
    message: 'Canvas detected Cmd+F (find in page).',
    detail: 'Searching quiz content — usually benign but logged.',
  },
  'addressbar-shortcut': {
    severity: 'high',
    title: '🔗 Address Bar Focused',
    message: 'Canvas detected Cmd+L (address bar focus).',
    detail: 'May indicate intent to navigate to another URL.',
  },
  fullscreenchange: {
    severity: 'warning',
    title: '🖥️ Fullscreen Changed',
    message: 'Canvas detected a fullscreen state change.',
    detail: 'Exiting fullscreen may indicate switching context.',
  },
  dragenter: {
    severity: 'warning',
    title: '📎 Content Dragged In',
    message: 'Canvas detected content being dragged onto the page.',
    detail: 'Student may be dragging pre-written answers from another window.',
  },
  drop: {
    severity: 'high',
    title: '📎 Content Dropped',
    message: 'Canvas detected content dropped on the quiz page.',
    detail: 'External content was dropped — potential answer injection.',
  },
  'pip-enter': {
    severity: 'high',
    title: '🎥 PiP Entered',
    message: 'A video entered Picture-in-Picture mode.',
    detail: 'Student may overlay a video with answers on top of the quiz.',
  },
  'bookmark-shortcut': {
    severity: 'low',
    title: '🔖 Bookmark Dialog',
    message: 'Canvas detected Cmd+D (bookmark dialog).',
    detail: 'Student may be saving the quiz URL to revisit or share.',
  },
};

let toastId = 0;

export function useToaster() {
  const [toasts, setToasts] = useState([]);
  const toastsRef = useRef([]);

  const addToast = useCallback((eventType) => {
    const config = SUSPICIOUS_EVENTS[eventType];
    if (!config) return;

    // Check conditional (e.g., only fire visibilitychange when hidden)
    if (config.onlyWhen && !config.onlyWhen()) return;

    const id = ++toastId;
    const toast = {
      id,
      severity: config.severity,
      title: config.title,
      message: config.message,
      detail: config.detail,
      timestamp: Date.now(),
    };

    toastsRef.current = [...toastsRef.current, toast];
    setToasts([...toastsRef.current]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      toastsRef.current = toastsRef.current.filter(t => t.id !== id);
      setToasts([...toastsRef.current]);
    }, 5000);
  }, []);

  const dismissToast = useCallback((id) => {
    toastsRef.current = toastsRef.current.filter(t => t.id !== id);
    setToasts([...toastsRef.current]);
  }, []);

  return { toasts, addToast, dismissToast };
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.severity} animate-toast-in`}
        >
          <div className="toast__glow" />
          <div className="toast__content">
            <div className="toast__header">
              <span className="toast__title">{toast.title}</span>
              <button
                className="toast__close"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
            <p className="toast__message">{toast.message}</p>
            <p className="toast__detail">{toast.detail}</p>
            <div className="toast__progress">
              <div className={`toast__progress-bar toast__progress-bar--${toast.severity}`} />
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column-reverse;
          gap: 10px;
          max-width: 380px;
          pointer-events: none;
        }

        .toast {
          pointer-events: auto;
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-lg);
          backdrop-filter: blur(20px);
          border: 1px solid;
          box-shadow: var(--shadow-lg);
        }

        .toast--critical {
          background: rgba(220, 38, 38, 0.12);
          border-color: rgba(220, 38, 38, 0.3);
        }

        .toast--high {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .toast--warning {
          background: rgba(234, 179, 8, 0.12);
          border-color: rgba(234, 179, 8, 0.3);
        }

        .toast--low {
          background: rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .toast__glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
        }

        .toast--critical .toast__glow {
          background: linear-gradient(90deg, transparent, #dc2626, transparent);
        }

        .toast--high .toast__glow {
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
        }

        .toast--warning .toast__glow {
          background: linear-gradient(90deg, transparent, #eab308, transparent);
        }

        .toast--low .toast__glow {
          background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
        }

        .toast__content {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .toast__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .toast__title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .toast__close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
          transition: color var(--transition-fast);
        }

        .toast__close:hover {
          color: var(--text-primary);
        }

        .toast__message {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .toast__detail {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin-top: 2px;
        }

        .toast__progress {
          margin-top: 8px;
          height: 2px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 1px;
          overflow: hidden;
        }

        .toast__progress-bar {
          height: 100%;
          border-radius: 1px;
          animation: toast-progress 5s linear forwards;
        }

        .toast__progress-bar--critical { background: #dc2626; }
        .toast__progress-bar--high { background: #f59e0b; }
        .toast__progress-bar--warning { background: #eab308; }
        .toast__progress-bar--low { background: #8b5cf6; }

        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-toast-in {
          animation: toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

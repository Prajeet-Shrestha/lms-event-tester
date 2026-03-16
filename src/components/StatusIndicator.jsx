import { useState, useEffect } from 'react';

export default function StatusIndicator() {
  const [status, setStatus] = useState({
    visible: document.visibilityState === 'visible',
    focused: document.hasFocus(),
    online: navigator.onLine,
  });

  useEffect(() => {
    const update = () => {
      setStatus({
        visible: document.visibilityState === 'visible',
        focused: document.hasFocus(),
        online: navigator.onLine,
      });
    };

    const events = ['focus', 'blur', 'online', 'offline'];
    events.forEach(e => window.addEventListener(e, update));
    document.addEventListener('visibilitychange', update);

    const interval = setInterval(update, 1000);

    return () => {
      events.forEach(e => window.removeEventListener(e, update));
      document.removeEventListener('visibilitychange', update);
      clearInterval(interval);
    };
  }, []);

  const indicators = [
    {
      label: 'Visibility',
      value: status.visible ? 'visible' : 'hidden',
      active: status.visible,
      color: status.visible ? '#34d399' : '#f87171',
    },
    {
      label: 'Focus',
      value: status.focused ? 'true' : 'false',
      active: status.focused,
      color: status.focused ? '#34d399' : '#f87171',
    },
    {
      label: 'Network',
      value: status.online ? 'online' : 'offline',
      active: status.online,
      color: status.online ? '#34d399' : '#f87171',
    },
  ];

  return (
    <div className="status-indicator">
      {indicators.map(ind => (
        <div key={ind.label} className="status-indicator__item">
          <span
            className="status-indicator__dot"
            style={{
              backgroundColor: ind.color,
              boxShadow: ind.active ? `0 0 8px ${ind.color}` : 'none',
              animation: ind.active ? 'pulse-dot 2s infinite' : 'none',
            }}
          />
          <span className="status-indicator__label">{ind.label}</span>
          <span
            className="status-indicator__value"
            style={{ color: ind.color }}
          >
            {ind.value}
          </span>
        </div>
      ))}

      <style>{`
        .status-indicator {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .status-indicator__item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-indicator__dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
          transition: all var(--transition-normal);
        }

        .status-indicator__label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .status-indicator__value {
          font-size: 0.72rem;
          font-weight: 600;
          font-family: var(--font-mono);
          transition: color var(--transition-fast);
        }
      `}</style>
    </div>
  );
}

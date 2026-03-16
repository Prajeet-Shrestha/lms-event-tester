export default function StatsBar({ stats }) {
  const eventTypes = [
    { key: 'blur', label: 'Blur', color: '#f87171' },
    { key: 'focus', label: 'Focus', color: '#34d399' },
    { key: 'visibilitychange', label: 'Visibility', color: '#fbbf24' },
    { key: 'resize', label: 'Resize', color: '#a78bfa' },
    { key: 'copy', label: 'Copy', color: '#fb923c' },
    { key: 'paste', label: 'Paste', color: '#fb923c' },
    { key: 'contextmenu', label: 'RightClick', color: '#e879f9' },
    { key: 'beforeunload', label: 'Unload', color: '#f472b6' },
    { key: 'pagehide', label: 'PageHide', color: '#22d3ee' },
    { key: 'online', label: 'Online', color: '#34d399' },
    { key: 'offline', label: 'Offline', color: '#f87171' },
    { key: 'popstate', label: 'PopState', color: '#60a5fa' },
    { key: 'fullscreenchange', label: 'Fullscreen', color: '#2dd4bf' },
    { key: 'devtools-shortcut', label: 'DevTools', color: '#f87171' },
    { key: 'screenshot-shortcut', label: 'Screenshot', color: '#fb923c' },
    { key: 'find-shortcut', label: 'Find', color: '#60a5fa' },
    { key: 'addressbar-shortcut', label: 'AddrBar', color: '#60a5fa' },
    { key: 'bookmark-shortcut', label: 'Bookmark', color: '#60a5fa' },
    { key: 'dragenter', label: 'DragIn', color: '#e879f9' },
    { key: 'drop', label: 'Drop', color: '#e879f9' },
    { key: 'pip-enter', label: 'PiP', color: '#2dd4bf' },
  ];

  return (
    <div className="stats-bar">
      {eventTypes.map(et => {
        const count = stats[et.key] || 0;
        return (
          <div
            key={et.key}
            className={`stats-bar__item ${count > 0 ? 'stats-bar__item--active' : ''}`}
          >
            <span
              className="stats-bar__dot"
              style={{ backgroundColor: count > 0 ? et.color : 'var(--text-muted)' }}
            />
            <span className="stats-bar__label">{et.label}</span>
            <span
              className={`stats-bar__count ${count > 0 ? 'animate-count-pop' : ''}`}
              style={{ color: count > 0 ? et.color : 'var(--text-muted)' }}
              key={count}
            >
              {count}
            </span>
          </div>
        );
      })}

      <style>{`
        .stats-bar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          padding: var(--space-md);
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
        }

        .stats-bar__item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid transparent;
          transition: all var(--transition-fast);
        }

        .stats-bar__item--active {
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--border-subtle);
        }

        .stats-bar__dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
          transition: background-color var(--transition-fast);
        }

        .stats-bar__label {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stats-bar__count {
          font-size: 0.8rem;
          font-weight: 700;
          font-family: var(--font-mono);
          min-width: 16px;
          text-align: right;
          transition: color var(--transition-fast);
        }
      `}</style>
    </div>
  );
}

export default function EventTimeline({ events, onClear }) {
  return (
    <div className="timeline">
      <div className="timeline__header">
        <div className="timeline__header-left">
          <h3 className="timeline__title">Event Stream</h3>
          <span className="timeline__count">{events.length} events</span>
        </div>
        <button className="btn btn--small btn--ghost" onClick={onClear}>
          Clear
        </button>
      </div>

      <div className="timeline__list">
        {events.length === 0 && (
          <div className="timeline__empty">
            <div className="timeline__empty-icon">📡</div>
            <p>Waiting for browser events…</p>
            <p className="timeline__empty-hint">
              Try switching tabs, minimizing the window, or clicking a trigger below.
            </p>
          </div>
        )}

        {[...events].reverse().map(event => (
          <div key={event.id} className="timeline__item animate-slide-in">
            <div className="timeline__item-left">
              <span
                className="timeline__dot"
                style={{ backgroundColor: event.color }}
              />
              <span className={`badge badge--${event.type}`}>
                {event.type}
              </span>
            </div>
            <div className="timeline__item-center">
              {event.detail && (
                <span className="timeline__detail">{event.detail}</span>
              )}
            </div>
            <div className="timeline__item-right">
              <span className="timeline__time">+{event.relativeTime}s</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .timeline {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .timeline__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          border-bottom: 1px solid var(--border-subtle);
        }

        .timeline__header-left {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .timeline__title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .timeline__count {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .timeline__list {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-sm);
        }

        .timeline__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-2xl) var(--space-lg);
          text-align: center;
          color: var(--text-muted);
          gap: var(--space-sm);
        }

        .timeline__empty-icon {
          font-size: 2rem;
          margin-bottom: var(--space-sm);
        }

        .timeline__empty-hint {
          font-size: 0.75rem;
          max-width: 220px;
        }

        .timeline__item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-sm);
          padding: 6px var(--space-sm);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .timeline__item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .timeline__item-left {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 140px;
        }

        .timeline__dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .timeline__item-center {
          flex: 1;
          min-width: 0;
        }

        .timeline__detail {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .timeline__item-right {
          flex-shrink: 0;
        }

        .timeline__time {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}

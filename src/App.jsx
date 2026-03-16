import { useEventLogger } from './hooks/useEventLogger';
import { useToaster, ToastContainer } from './components/Toaster';
import StatsBar from './components/StatsBar';
import EdgeCasePanel from './components/EdgeCasePanel';
import EventTimeline from './components/EventTimeline';
import StatusIndicator from './components/StatusIndicator';
import { useEffect } from 'react';
import { NotePencil } from '@phosphor-icons/react';

export default function App() {
  const { events, stats, clearEvents } = useEventLogger();
  const { toasts, addToast, dismissToast } = useToaster();

  // Fire toasts for suspicious events
  useEffect(() => {
    if (events.length === 0) return;
    const lastEvent = events[events.length - 1];
    addToast(lastEvent.type);
  }, [events, addToast]);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__logo">
          <div className="app-header__icon">
            <NotePencil size={20} weight="bold" color="white" />
          </div>
          <div>
            <div className="app-header__title">Canvas LMS Event Tester</div>
            <div className="app-header__subtitle">
              Testing what Canvas actually sees when you switch tabs, open Spotlight, or drag to another monitor
            </div>
          </div>
        </div>
        <StatusIndicator />
      </header>

      <div className="disclaimer-banner">
        <span className="disclaimer-banner__icon">⚠️</span>
        <p>
          <strong>Heads up:</strong> I built this for educational and testing purposes only. 
          I don't endorse cheating or academic dishonesty. 
          Don't use this for anything shady.
        </p>
      </div>

      <style>{`
        .disclaimer-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          margin: 0 var(--space-lg);
          background: rgba(234, 179, 8, 0.06);
          border: 1px solid rgba(234, 179, 8, 0.15);
          border-radius: var(--radius-lg);
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .disclaimer-banner__icon {
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .disclaimer-banner strong {
          color: #eab308;
        }
      `}</style>

      <main className="app-main">
        <div className="app-left">
          <StatsBar stats={stats} />
          <EdgeCasePanel />
        </div>
        <div className="app-right">
          <EventTimeline events={events} onClear={clearEvents} />
        </div>
      </main>

      <footer className="app-footer">
        <span>
          Built by <a href="https://prajeet.com" target="_blank" rel="noopener noreferrer">Prajeet</a>
        </span>
        <span className="app-footer__sep">·</span>
        <a href="https://buymemomo.com/davinci" target="_blank" rel="noopener noreferrer" className="app-footer__momo">
          🥟 Buy me a momo
        </a>
      </footer>

      <style>{`
        .app-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          font-size: 0.8rem;
          color: var(--text-muted, #475569);
          border-top: 1px solid var(--border-subtle, rgba(255,255,255,0.06));
        }
        .app-footer a {
          color: var(--text-secondary, #94a3b8);
          text-decoration: none;
          transition: color 0.2s;
        }
        .app-footer a:hover {
          color: var(--text-primary, #f1f5f9);
        }
        .app-footer__sep {
          color: var(--border-subtle, rgba(255,255,255,0.15));
        }
        .app-footer__momo {
          color: var(--text-secondary, #94a3b8) !important;
        }
        .app-footer__momo:hover {
          color: #fbbf24 !important;
        }
      `}</style>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="mobile-blocker">
        <div className="mobile-blocker__content">
          <NotePencil size={48} weight="duotone" />
          <h2>Desktop only</h2>
          <p>
            This tool tests browser events that only make sense on a desktop.
            Open it on a laptop or computer to use it.
          </p>
        </div>
      </div>

      <style>{`
        .mobile-blocker {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: var(--bg-primary, #0a0e17);
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
        }
        .mobile-blocker__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary, #94a3b8);
        }
        .mobile-blocker__content h2 {
          font-size: 1.4rem;
          color: var(--text-primary, #f1f5f9);
          margin: 0;
        }
        .mobile-blocker__content p {
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 300px;
        }
        @media (max-width: 768px) {
          .mobile-blocker { display: flex; }
          .app-header, .disclaimer-banner, .app-main, .toast-container { display: none !important; }
        }
      `}</style>
    </div>
  );
}

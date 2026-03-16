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
              Browser event edge-case testing for Instructure Canvas quiz proctoring
            </div>
          </div>
        </div>
        <StatusIndicator />
      </header>

      <div className="disclaimer-banner">
        <span className="disclaimer-banner__icon">⚠️</span>
        <p>
          <strong>Disclaimer:</strong> This project is strictly for educational and testing purposes only. 
          The author does not endorse cheating or academic dishonesty. 
          Do NOT use this tool for any illegal or unethical activities.
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

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

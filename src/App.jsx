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

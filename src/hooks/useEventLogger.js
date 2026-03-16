import { useState, useEffect, useRef, useCallback } from 'react';

const EVENT_COLORS = {
  blur: '#f87171',
  focus: '#34d399',
  visibilitychange: '#fbbf24',
  resize: '#a78bfa',
  beforeunload: '#f472b6',
  pagehide: '#22d3ee',
  online: '#34d399',
  offline: '#f87171',
  popstate: '#60a5fa',
  copy: '#fb923c',
  paste: '#fb923c',
  contextmenu: '#e879f9',
  fullscreenchange: '#2dd4bf',
  dragenter: '#e879f9',
  drop: '#e879f9',
  'pip-enter': '#2dd4bf',
  'pip-leave': '#2dd4bf',
  'bookmark-shortcut': '#60a5fa',
};

export function useEventLogger() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const startTimeRef = useRef(Date.now());
  const idCounterRef = useRef(0);
  const bufferRef = useRef([]);
  const rafRef = useRef(null);

  const flush = useCallback(() => {
    if (bufferRef.current.length === 0) return;
    const batch = [...bufferRef.current];
    bufferRef.current = [];

    setEvents(prev => {
      const next = [...prev, ...batch];
      // Keep last 500 events to avoid memory issues
      return next.length > 500 ? next.slice(-500) : next;
    });

    setStats(prev => {
      const next = { ...prev };
      batch.forEach(e => {
        next[e.type] = (next[e.type] || 0) + 1;
      });
      return next;
    });
  }, []);

  const logEvent = useCallback((event) => {
    const now = Date.now();
    const entry = {
      id: ++idCounterRef.current,
      type: event.type,
      timestamp: now,
      relativeTime: ((now - startTimeRef.current) / 1000).toFixed(1),
      visibilityState: document.visibilityState,
      hasFocus: document.hasFocus(),
      color: EVENT_COLORS[event.type] || '#94a3b8',
      detail: getEventDetail(event),
    };

    bufferRef.current.push(entry);

    // blur/visibilitychange/focus: rAF won't fire when the tab is inactive,
    // so flush these synchronously via setTimeout instead
    const criticalEvents = ['blur', 'focus', 'visibilitychange', 'beforeunload', 'pagehide'];
    if (criticalEvents.includes(event.type)) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setTimeout(flush, 0);
    } else if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        flush();
        rafRef.current = null;
      });
    }
  }, [flush]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setStats({});
    startTimeRef.current = Date.now();
    idCounterRef.current = 0;
    bufferRef.current = [];
  }, []);

  useEffect(() => {
    const windowEvents = ['focus', 'blur', 'resize', 'beforeunload', 'pagehide', 'online', 'offline', 'popstate'];
    const documentEvents = ['visibilitychange', 'copy', 'paste', 'contextmenu', 'fullscreenchange', 'dragenter', 'drop'];

    // Detect DevTools, screenshot, find-in-page shortcuts
    const keyHandler = (e) => {
      const dominated = e.metaKey || e.ctrlKey;
      // DevTools: F12, Cmd+Option+I, Cmd+Option+J, Cmd+Option+C
      if (e.key === 'F12' ||
          (dominated && e.altKey && ['i','j','c'].includes(e.key.toLowerCase()))) {
        logEvent({ type: 'devtools-shortcut', key: e.key });
      }
      // Screenshot: Cmd+Shift+3/4/5
      if (dominated && e.shiftKey && ['3','4','5'].includes(e.key)) {
        logEvent({ type: 'screenshot-shortcut', key: `Cmd+Shift+${e.key}` });
      }
      // Find in page: Cmd+F
      if (dominated && e.key.toLowerCase() === 'f' && !e.shiftKey && !e.altKey) {
        logEvent({ type: 'find-shortcut', key: 'Cmd+F' });
      }
      // Address bar: Cmd+L
      if (dominated && e.key.toLowerCase() === 'l' && !e.shiftKey && !e.altKey) {
        logEvent({ type: 'addressbar-shortcut', key: 'Cmd+L' });
      }
      // Bookmark: Cmd+D
      if (dominated && e.key.toLowerCase() === 'd' && !e.shiftKey && !e.altKey) {
        logEvent({ type: 'bookmark-shortcut', key: 'Cmd+D' });
      }
    };

    windowEvents.forEach(evt => window.addEventListener(evt, logEvent));
    documentEvents.forEach(evt => document.addEventListener(evt, logEvent));
    document.addEventListener('keydown', keyHandler);

    return () => {
      windowEvents.forEach(evt => window.removeEventListener(evt, logEvent));
      documentEvents.forEach(evt => document.removeEventListener(evt, logEvent));
      document.removeEventListener('keydown', keyHandler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [logEvent]);

  return { events, stats, clearEvents, startTime: startTimeRef.current };
}

function getEventDetail(event) {
  switch (event.type) {
    case 'visibilitychange':
      return `state → ${document.visibilityState}`;
    case 'resize':
      return `${window.innerWidth}×${window.innerHeight}`;
    case 'online':
      return 'Network restored';
    case 'offline':
      return 'Network lost';
    case 'focus':
      return `hasFocus: true`;
    case 'blur':
      return `hasFocus: false`;
    case 'copy':
      return 'Content copied to clipboard';
    case 'paste':
      return 'Content pasted from clipboard';
    case 'contextmenu':
      return 'Right-click context menu opened';
    case 'fullscreenchange':
      return `fullscreen: ${!!document.fullscreenElement}`;
    case 'devtools-shortcut':
      return `Key: ${event.key} — DevTools shortcut`;
    case 'screenshot-shortcut':
      return `Key: ${event.key} — Screenshot`;
    case 'find-shortcut':
      return `Key: ${event.key} — Find in page`;
    case 'addressbar-shortcut':
      return `Key: ${event.key} — Address bar focus`;
    case 'bookmark-shortcut':
      return `Key: ${event.key} — Bookmark dialog`;
    case 'dragenter':
      return 'Content dragged over page';
    case 'drop':
      return 'Content dropped on page';
    case 'pip-enter':
      return 'Entered Picture-in-Picture';
    case 'pip-leave':
      return 'Left Picture-in-Picture';
    default:
      return '';
  }
}

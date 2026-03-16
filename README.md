# Canvas LMS Event Tester

A React-based testing tool that simulates and detects **40 browser & OS edge cases** affecting [Canvas by Instructure](https://www.instructure.com/canvas) quiz proctoring. Canvas LMS relies on browser events like `visibilitychange`, `blur`, and `focus` to detect when students leave a quiz — this tool shows exactly what fires (and what doesn't) for each scenario.

## Features

- **40 Edge Cases** across 10 categories: Browser, OS, Browser UI, Extension, Multi-Monitor, Navigation, Timing, Mobile, Cheating, and Undetectable
- **Real-Time Event Stream** — logs every browser event as it fires, newest first
- **Toast Notifications** — alerts when a suspicious event occurs (the kind Canvas would flag)
- **Live Stats Bar** — tracks 21+ event types with counters
- **Status Indicators** — real-time visibility, focus, and network state
- **Programmatic Triggers** — clickable buttons to simulate window.open, file dialogs, print, PiP, fullscreen, and more
- **Dark Theme** — premium UI with Phosphor icons

## Edge Case Categories

| Category | Count | Description |
|---|---|---|
| Browser | 5 | Tab switching, new window, minimize, fullscreen, zoom |
| OS | 5 | Notification Center, Spotlight, Mission Control, Split View, DND |
| Browser UI | 4 | File upload, permissions, print, find in page, bookmarks |
| Extension | 2 | Extension popups, injected DOM elements |
| Multi-Monitor | 2 | Window drag, cursor movement |
| Navigation | 4 | Refresh, back button, offline, address bar |
| Timing | 2 | Sleep/wake, system clock changes |
| Mobile | 1 | App switching |
| Cheating | 8 | DevTools, right-click, copy/paste, screenshot, PiP, tab dup, drag & drop |
| Undetectable | 4 | Screen recording, remote desktop, VMs, text-to-speech |

## Detected Events

`blur` · `focus` · `visibilitychange` · `resize` · `beforeunload` · `pagehide` · `online` · `offline` · `popstate` · `copy` · `paste` · `contextmenu` · `fullscreenchange` · `dragenter` · `drop` · `devtools-shortcut` · `screenshot-shortcut` · `find-shortcut` · `addressbar-shortcut` · `bookmark-shortcut` · `pip-enter`

## Getting Started

```bash
git clone https://github.com/Prajeet-Shrestha/lms-event-tester.git
cd lms-event-tester
npm install
npm run dev
```

## Tech Stack

- **React** + **Vite**
- **@phosphor-icons/react** for icons
- Vanilla CSS with custom dark design system

## How It Works

The core `useEventLogger` hook attaches listeners to all relevant browser and document events. Keyboard shortcuts (DevTools, screenshot, find, bookmark) are detected via `keydown` handlers. Events are batched using `requestAnimationFrame` to prevent re-render storms.

Each edge case card shows:
- **Expected events** that should fire
- **Canvas Impact** — what Canvas LMS would do
- **Trigger button** or manual instructions

## ⚠️ Disclaimer

This project is created **strictly for educational and testing purposes only**. The author does not endorse cheating, academic dishonesty, or any form of misconduct. This tool is meant to help educators, developers, and QA testers understand how browser events behave in proctored environments.

**You should NOT use this project for any illegal or unethical activities.** Misuse of this tool to circumvent exam proctoring systems violates academic integrity policies and may result in serious consequences.

## License

MIT

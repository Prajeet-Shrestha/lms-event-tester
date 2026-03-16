# Canvas LMS Event Tester

If you've ever taken a quiz on Canvas and wondered what it actually detects when you switch tabs, open Spotlight, or drag your browser to another monitor -- this tool answers that question.

It tests **40 different scenarios** that can trigger (or fail to trigger) Canvas quiz proctoring. Each card shows what browser events fire, what Canvas does with them, and whether the behavior is even detectable at all.

Built with React + Vite. Uses [Phosphor icons](https://phosphoricons.com/).

## What's in here

The tester covers 10 categories:

| Category | Count | What it covers |
|---|---|---|
| Browser | 5 | Tab switching, new window, minimize, fullscreen, zoom |
| OS | 5 | Notification Center, Spotlight, Mission Control, Split View, DND |
| Browser UI | 4 | File upload, permissions, print, find in page, bookmarks |
| Extension | 2 | Extension popups, injected DOM elements |
| Multi-Monitor | 2 | Window drag, cursor movement |
| Navigation | 4 | Refresh, back button, offline, address bar |
| Timing | 2 | Sleep/wake, system clock changes |
| Mobile | 1 | App switching |
| Cheating | 8 | DevTools, right-click, copy/paste, screenshot, PiP, tab duplication, drag and drop |
| Undetectable | 4 | Screen recording, remote desktop, VMs, text-to-speech |

The "Undetectable" category is probably the most interesting. These are things Canvas literally cannot see -- no browser events fire, no APIs exist to catch them. Remote desktop, screen recording, text-to-speech, and virtual machines all fall into this bucket.

## Events it tracks

`blur` `focus` `visibilitychange` `resize` `beforeunload` `pagehide` `online` `offline` `popstate` `copy` `paste` `contextmenu` `fullscreenchange` `dragenter` `drop` `devtools-shortcut` `screenshot-shortcut` `find-shortcut` `addressbar-shortcut` `bookmark-shortcut` `pip-enter`

## Running it

```bash
git clone https://github.com/Prajeet-Shrestha/lms-event-tester.git
cd lms-event-tester
npm install
npm run dev
```

## How it works

A `useEventLogger` hook listens to browser and document events. Keyboard shortcuts (DevTools, screenshot, find, bookmark) are caught via `keydown`. Events get batched through `requestAnimationFrame` so the UI doesn't choke when a bunch fire at once.

Toast notifications pop up in the bottom-right whenever something suspicious happens -- the kind of thing Canvas would flag during a quiz.

## ⚠️ Disclaimer

I built this for educational and testing purposes. I don't endorse cheating, academic dishonesty, or anything along those lines. This is a tool for educators, developers, and QA testers who want to understand how browser events behave in proctored environments.

Don't use it for anything shady. Seriously.

## License

MIT

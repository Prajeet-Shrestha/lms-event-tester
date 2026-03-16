import { useRef } from 'react';
import {
  ArrowsOutSimple,
  ArrowLeft,
  ArrowsClockwise,
  Bell,
  BookmarkSimple,
  Browsers,
  ClipboardText,
  ChatCircle,
  Code,
  Command,
  CopySimple,
  Cursor,
  Desktop,
  DeviceMobile,
  DotsSixVertical,
  FilePlus,
  Fingerprint,
  Globe,
  Keyboard,
  Link,
  LockKey,
  MagnifyingGlass,
  MagnifyingGlassMinus,
  Minus,
  Monitor,
  MonitorPlay,
  Moon,
  MoonStars,
  PaintBrush,
  PictureInPicture,
  Printer,
  PuzzlePiece,
  Robot,
  Rocket,
  Camera,
  Clock,
  Screencast,
  Sidebar,
  SpeakerHigh,
  SpeakerSimpleHigh,
  Tabs,
  WifiSlash,
} from '@phosphor-icons/react';

const EDGE_CASES = [
  {
    id: 1,
    icon: Browsers,
    title: 'Tab Switching',
    description: 'User presses Cmd/Ctrl+Tab or clicks another browser tab.',
    category: 'browser',
    expectedEvents: ['visibilitychange', 'blur', 'focus'],
    triggerType: 'manual',
    instructions: 'Press Cmd+Tab or click another tab, then return.',
    canvasImpact: 'Canvas Quiz logs record this as "left the quiz" — most common flag trigger.',
  },
  {
    id: 2,
    icon: Desktop,
    title: 'New Browser Window',
    description: 'Opening a new window via window.open().',
    category: 'browser',
    expectedEvents: ['blur', 'visibilitychange'],
    triggerType: 'action',
    triggerFn: () => {
      const w = window.open('about:blank', '_blank', 'width=400,height=300');
      setTimeout(() => w?.close(), 2000);
    },
    triggerLabel: 'Open Window',
    canvasImpact: 'Canvas may flag this. Some browsers delay visibilitychange.',
  },
  {
    id: 3,
    icon: Minus,
    title: 'Minimize Browser',
    description: 'User clicks the minimize button on the browser window.',
    category: 'browser',
    expectedEvents: ['visibilitychange', 'blur'],
    triggerType: 'manual',
    instructions: 'Click the minimize button on your browser window.',
    canvasImpact: 'Canvas detects this via visibilitychange — triggers "navigated away" log.',
  },
  {
    id: 4,
    icon: Bell,
    title: 'macOS Notification Center',
    description: 'Swiping to the widget panel via trackpad.',
    category: 'os',
    expectedEvents: ['blur', 'focus'],
    triggerType: 'manual',
    instructions: 'Swipe left from the right edge of your trackpad to open widgets.',
    canvasImpact: 'May trigger false "left page" in Canvas. Sometimes nothing fires.',
  },
  {
    id: 5,
    icon: MagnifyingGlass,
    title: 'Spotlight Search',
    description: 'Cmd+Space opens Spotlight. On macOS Ventura+, this may NOT fire blur — Spotlight appears as a system overlay without stealing browser focus.',
    category: 'os',
    expectedEvents: ['blur'],
    triggerType: 'manual',
    instructions: 'Press Cmd+Space to open Spotlight, then Escape. On newer macOS, no events may fire.',
    canvasImpact: 'macOS version dependent. Older versions fire blur. Ventura+ often fires nothing — Spotlight is invisible to the browser.',
  },
  {
    id: 6,
    icon: Rocket,
    title: 'Mission Control',
    description: 'Three-finger swipe up on trackpad.',
    category: 'os',
    expectedEvents: ['blur', 'visibilitychange'],
    triggerType: 'manual',
    instructions: 'Swipe up with three fingers on your trackpad.',
    canvasImpact: 'Behavior varies by macOS version. Canvas may or may not detect it.',
  },
  {
    id: 7,
    icon: Command,
    title: 'App Switching (Cmd+Tab)',
    description: 'macOS app switcher via Cmd+Tab.',
    category: 'os',
    expectedEvents: ['blur', 'visibilitychange'],
    triggerType: 'manual',
    instructions: 'Press Cmd+Tab to switch to another app, then return.',
    canvasImpact: 'Reliable Canvas flag — both blur and visibilitychange fire.',
  },
  {
    id: 8,
    icon: FilePlus,
    title: 'File Upload Dialog',
    description: 'Opening an OS file dialog from an <input type="file">.',
    category: 'ui',
    expectedEvents: ['blur', 'focus'],
    triggerType: 'file',
    canvasImpact: 'FALSE POSITIVE — Canvas may log "left quiz" during file upload in essay questions.',
  },
  {
    id: 9,
    icon: LockKey,
    title: 'Permission Prompts',
    description: 'Browser permission dialogs (camera, notifications, etc).',
    category: 'ui',
    expectedEvents: ['blur', 'focus'],
    triggerType: 'action',
    triggerFn: () => {
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    },
    triggerLabel: 'Request Permission',
    canvasImpact: 'FALSE POSITIVE — Canvas may flag permission dialogs as leaving the page.',
  },
  {
    id: 10,
    icon: Printer,
    title: 'Print Dialog',
    description: 'Cmd+P opens the print dialog.',
    category: 'ui',
    expectedEvents: ['blur', 'focus'],
    triggerType: 'action',
    triggerFn: () => window.print(),
    triggerLabel: 'Open Print',
    canvasImpact: 'Canvas may flag this. Students printing quiz instructions get false flags.',
  },
  {
    id: 11,
    icon: PuzzlePiece,
    title: 'Extension Popup',
    description: 'Browser extension popup (e.g., 1Password, MetaMask).',
    category: 'extension',
    expectedEvents: ['blur'],
    triggerType: 'manual',
    instructions: 'Click any browser extension icon in your toolbar.',
    canvasImpact: 'FALSE POSITIVE — varies by browser. Chrome sometimes blurs, Safari often does not.',
  },
  {
    id: 12,
    icon: PaintBrush,
    title: 'Extension Injected UI',
    description: 'Extensions like Grammarly inject UI into the DOM.',
    category: 'extension',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'If you have Grammarly or a similar extension, interact with its in-page UI.',
    canvasImpact: 'NO EVENTS FIRE — Extensions operating in-DOM are invisible to Canvas proctoring.',
  },
  {
    id: 13,
    icon: Monitor,
    title: 'Drag to Another Monitor',
    description: 'Dragging the browser window to a second monitor.',
    category: 'multimon',
    expectedEvents: ['resize', 'blur', 'focus'],
    triggerType: 'manual',
    instructions: 'Drag the browser window to another monitor (if available).',
    canvasImpact: 'Canvas may flag the resize event. Depends on Canvas Quiz settings.',
  },
  {
    id: 14,
    icon: Screencast,
    title: 'Cursor to Another Monitor',
    description: 'Moving the mouse cursor to another screen.',
    category: 'multimon',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Move your cursor to another monitor without clicking.',
    canvasImpact: 'NO EVENTS FIRE — This is a known limitation. Canvas cannot detect this.',
  },
  {
    id: 15,
    icon: ArrowsClockwise,
    title: 'Page Refresh',
    description: 'Cmd+R reloads the page.',
    category: 'navigation',
    expectedEvents: ['beforeunload', 'pagehide'],
    triggerType: 'manual',
    instructions: 'Press Cmd+R to refresh this page (events log will reset).',
    canvasImpact: 'Canvas logs this as "navigated away" — counts toward the left-quiz counter.',
  },
  {
    id: 16,
    icon: ArrowLeft,
    title: 'Back Button',
    description: 'Browser back button navigation.',
    category: 'navigation',
    expectedEvents: ['popstate', 'beforeunload'],
    triggerType: 'manual',
    instructions: 'Click the browser back button.',
    canvasImpact: 'Canvas will log this as leaving the quiz page entirely.',
  },
  {
    id: 17,
    icon: WifiSlash,
    title: 'Internet Disconnect',
    description: 'WiFi/ethernet goes offline or comes back.',
    category: 'navigation',
    expectedEvents: ['offline', 'online'],
    triggerType: 'manual',
    instructions: 'Turn off WiFi, wait a moment, then turn it back on.',
    canvasImpact: 'Canvas may not submit answers if offline. Show "connection lost" warning.',
  },
  {
    id: 18,
    icon: Moon,
    title: 'Computer Sleep',
    description: 'Closing laptop lid or system sleep.',
    category: 'timing',
    expectedEvents: ['visibilitychange', 'focus'],
    triggerType: 'manual',
    instructions: 'Close your laptop briefly, then reopen.',
    canvasImpact: 'Time gap appears in Canvas logs. Timer continues server-side — can auto-submit quiz.',
  },
  {
    id: 19,
    icon: Clock,
    title: 'System Clock Change',
    description: 'Manually changing system time.',
    category: 'timing',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Change your system clock (System Preferences → Date & Time).',
    canvasImpact: 'Canvas uses server-side time for deadlines but client timestamps may drift in logs.',
  },
  {
    id: 20,
    icon: DeviceMobile,
    title: 'Mobile App Switch',
    description: 'Switching apps on a mobile device.',
    category: 'mobile',
    expectedEvents: ['visibilitychange', 'blur'],
    triggerType: 'manual',
    instructions: 'Swipe up or press Home to switch apps on your mobile device.',
    canvasImpact: 'Canvas mobile app detects this. May auto-submit quiz on some configurations.',
  },
  // ─── New edge cases ───
  {
    id: 21,
    icon: Code,
    title: 'DevTools (F12 / Cmd+Opt+I)',
    description: 'Opening browser Developer Tools to inspect or modify the page.',
    category: 'cheating',
    expectedEvents: ['devtools-shortcut', 'resize'],
    triggerType: 'manual',
    instructions: 'Press F12 or Cmd+Option+I to open DevTools.',
    canvasImpact: 'HIGH RISK — Students can inspect answers, modify DOM, or bypass validation. Some Canvas configs block this.',
  },
  {
    id: 22,
    icon: Cursor,
    title: 'Right-Click Context Menu',
    description: 'Right-clicking on the page opens the browser context menu.',
    category: 'cheating',
    expectedEvents: ['contextmenu'],
    triggerType: 'action',
    triggerFn: () => {
      // Just log — the actual right-click is captured by the event listener
      alert('Right-click anywhere on the page to test. The contextmenu event will be logged.');
    },
    triggerLabel: 'Info',
    canvasImpact: 'Canvas "Classic Quizzes" can disable right-click. "New Quizzes" often do not block it.',
  },
  {
    id: 23,
    icon: CopySimple,
    title: 'Copy Quiz Content',
    description: 'Selecting text and pressing Cmd+C to copy quiz questions.',
    category: 'cheating',
    expectedEvents: ['copy'],
    triggerType: 'action',
    triggerFn: () => {
      const text = 'Sample quiz question text for testing copy detection';
      navigator.clipboard?.writeText(text).catch(() => {});
      document.dispatchEvent(new Event('copy'));
    },
    triggerLabel: 'Simulate Copy',
    canvasImpact: 'Canvas can detect copy events. Some quizzes block text selection entirely via CSS.',
  },
  {
    id: 24,
    icon: ClipboardText,
    title: 'Paste Content',
    description: 'Pasting content from clipboard into an answer field.',
    category: 'cheating',
    expectedEvents: ['paste'],
    triggerType: 'action',
    triggerFn: () => {
      document.dispatchEvent(new Event('paste'));
    },
    triggerLabel: 'Simulate Paste',
    canvasImpact: 'HIGH RISK — Pasting indicates content sourced externally. Canvas logs paste events in essay questions.',
  },
  {
    id: 25,
    icon: Camera,
    title: 'Screenshot (Cmd+Shift+3/4/5)',
    description: 'Taking a screenshot via macOS keyboard shortcut.',
    category: 'cheating',
    expectedEvents: ['screenshot-shortcut'],
    triggerType: 'manual',
    instructions: 'Press Cmd+Shift+3 (full), Cmd+Shift+4 (area), or Cmd+Shift+5 (tool).',
    canvasImpact: 'Canvas cannot prevent screenshots. Proctoring software (Respondus) can detect and block this.',
  },
  {
    id: 26,
    icon: MagnifyingGlass,
    title: 'Find in Page (Cmd+F)',
    description: 'Browser find-in-page to search quiz content.',
    category: 'ui',
    expectedEvents: ['find-shortcut'],
    triggerType: 'manual',
    instructions: 'Press Cmd+F to open the browser find bar.',
    canvasImpact: 'Usually benign — students may search long quiz pages. Some lockdown browsers block this.',
  },
  {
    id: 27,
    icon: Link,
    title: 'Address Bar Focus (Cmd+L)',
    description: 'Focusing the browser address bar to type a URL.',
    category: 'navigation',
    expectedEvents: ['addressbar-shortcut', 'blur'],
    triggerType: 'manual',
    instructions: 'Press Cmd+L to focus the address bar.',
    canvasImpact: 'Canvas may flag blur. Indicates intent to navigate to another site (e.g., Google, ChatGPT).',
  },
  {
    id: 28,
    icon: ArrowsOutSimple,
    title: 'Fullscreen Toggle',
    description: 'Entering or exiting fullscreen mode.',
    category: 'browser',
    expectedEvents: ['fullscreenchange', 'resize'],
    triggerType: 'action',
    triggerFn: () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    },
    triggerLabel: 'Toggle Fullscreen',
    canvasImpact: 'Some Canvas quizzes require fullscreen. Exiting triggers a warning and logs the event.',
  },
  {
    id: 29,
    icon: Sidebar,
    title: 'macOS Split View',
    description: 'Using macOS Split View to show two apps side-by-side.',
    category: 'os',
    expectedEvents: ['resize', 'blur', 'focus'],
    triggerType: 'manual',
    instructions: 'Hold the green maximize button and choose "Tile Window to Left/Right".',
    canvasImpact: 'Canvas may flag resize. Student could have ChatGPT in the other half — undetectable by Canvas.',
  },
  {
    id: 30,
    icon: SpeakerHigh,
    title: 'Siri / Voice Assistant',
    description: 'Activating Siri via "Hey Siri" or long-pressing Cmd.',
    category: 'os',
    expectedEvents: ['blur'],
    triggerType: 'manual',
    instructions: 'Say "Hey Siri" or hold the Cmd key to activate Siri.',
    canvasImpact: 'Quick blur event. Student could ask Siri questions verbally — completely invisible to Canvas.',
  },
  // ─── Additional edge cases ───
  {
    id: 31,
    icon: PictureInPicture,
    title: 'Picture-in-Picture',
    description: 'Playing a video with answers in a floating PiP overlay.',
    category: 'cheating',
    expectedEvents: ['pip-enter', 'pip-leave'],
    triggerType: 'action',
    triggerFn: () => {
      const v = document.createElement('video');
      v.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDE=';
      v.muted = true;
      v.play().then(() => v.requestPictureInPicture()).catch(() => {
        alert('PiP requires a real video element. Try on a page with a <video> tag.');
      });
    },
    triggerLabel: 'Try PiP',
    canvasImpact: 'Student can overlay a video with answers on top of the quiz. Canvas has NO detection for PiP.',
  },
  {
    id: 32,
    icon: MonitorPlay,
    title: 'Screen Recording',
    description: 'macOS screen recording via Cmd+Shift+5 → Record.',
    category: 'undetectable',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Press Cmd+Shift+5, choose "Record Entire Screen", then stop.',
    canvasImpact: 'UNDETECTABLE — Screen recording runs at OS level. Canvas and even Respondus cannot prevent it on macOS.',
  },
  {
    id: 33,
    icon: MoonStars,
    title: 'Do Not Disturb',
    description: 'Enabling DND suppresses notifications that cause blur events.',
    category: 'os',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Enable Focus/DND from Control Center (click clock area in menu bar).',
    canvasImpact: 'Reduces false positives — DND prevents notification overlays that trigger blur. Changes Canvas detection rate.',
  },
  {
    id: 34,
    icon: MagnifyingGlassMinus,
    title: 'Browser Zoom (Cmd +/-)',
    description: 'Zooming in or out changes the viewport without navigation.',
    category: 'browser',
    expectedEvents: ['resize'],
    triggerType: 'action',
    triggerFn: () => {
      alert('Press Cmd+Plus to zoom in or Cmd+Minus to zoom out. The resize event will be logged.');
    },
    triggerLabel: 'Info',
    canvasImpact: 'Canvas sees a resize event but cannot distinguish zoom from window resize. Zooming out reveals more content.',
  },
  {
    id: 35,
    icon: Tabs,
    title: 'Tab Duplication',
    description: 'Duplicating the quiz tab to have two copies open.',
    category: 'cheating',
    expectedEvents: ['blur', 'visibilitychange'],
    triggerType: 'manual',
    instructions: 'Right-click the browser tab and select "Duplicate Tab".',
    canvasImpact: 'Canvas may detect two sessions via server-side session tracking. Quiz may lock or show a warning.',
  },
  {
    id: 36,
    icon: Screencast,
    title: 'Remote Desktop',
    description: 'TeamViewer, AnyDesk, or similar remote access to the screen.',
    category: 'undetectable',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Connect via TeamViewer or AnyDesk from another device.',
    canvasImpact: 'UNDETECTABLE — Remote desktop operates at OS level. Zero browser events. Someone else can see and control the exam.',
  },
  {
    id: 37,
    icon: Robot,
    title: 'Virtual Machine',
    description: 'Running the browser inside a VM (Parallels, VMware, etc).',
    category: 'undetectable',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Open the quiz inside a virtual machine.',
    canvasImpact: 'Some proctoring tools detect VMs via WebGL renderer strings or GPU info. Canvas itself does NOT detect VMs.',
  },
  {
    id: 38,
    icon: SpeakerSimpleHigh,
    title: 'Text-to-Speech',
    description: 'macOS built-in TTS reads quiz content aloud.',
    category: 'undetectable',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Select text, right-click → Speech → Start Speaking (or use Accessibility shortcut).',
    canvasImpact: 'UNDETECTABLE — TTS runs at OS level. Students can have quiz questions read aloud to someone nearby.',
  },
  {
    id: 39,
    icon: BookmarkSimple,
    title: 'Bookmark Dialog (Cmd+D)',
    description: 'Opening the bookmark dialog to save the quiz URL.',
    category: 'ui',
    expectedEvents: ['bookmark-shortcut', 'blur'],
    triggerType: 'manual',
    instructions: 'Press Cmd+D to open the bookmark dialog.',
    canvasImpact: 'Quick blur event. Students may bookmark the quiz page to revisit or share the URL.',
  },
  {
    id: 40,
    icon: DotsSixVertical,
    title: 'Drag & Drop Content',
    description: 'Dragging text or images from another window onto the quiz.',
    category: 'cheating',
    expectedEvents: ['dragenter', 'drop'],
    triggerType: 'manual',
    instructions: 'Drag text or an image from another window and drop it onto this page.',
    canvasImpact: 'Canvas can detect drag/drop events. Students may drag pre-written answers into essay fields.',
  },
  {
    id: 41,
    icon: ChatCircle,
    title: 'ChatGPT Desktop Overlay',
    description: 'ChatGPT desktop app\'s Spotlight-like shortcut (Option+Space) opens a floating AI prompt over any window.',
    category: 'undetectable',
    expectedEvents: [],
    triggerType: 'manual',
    instructions: 'Press Option+Space to open ChatGPT overlay, type a question, get an answer, and dismiss.',
    canvasImpact: 'UNDETECTABLE — The overlay is a native macOS window. No blur event on Ventura+. Students can query AI for answers mid-quiz with zero trace.',
  },
];

const CATEGORY_LABELS = {
  browser: 'Browser',
  os: 'OS',
  ui: 'Browser UI',
  extension: 'Extension',
  multimon: 'Multi-Monitor',
  navigation: 'Navigation',
  timing: 'Timing',
  mobile: 'Mobile',
  cheating: 'Cheating',
  undetectable: 'Undetectable',
};

export default function EdgeCasePanel() {
  const fileInputRef = useRef(null);

  return (
    <div className="edge-panel">
      <div className="edge-panel__header">
        <h2 className="edge-panel__title">Canvas LMS Edge Cases</h2>
        <p className="edge-panel__desc">
          41 things that happen on your computer or browser that Canvas may (or may not) catch during a quiz.
          Try them out and watch the event stream.
        </p>
      </div>

      <div className="edge-panel__grid">
        {EDGE_CASES.map(ec => {
          const IconComp = ec.icon;
          return (
            <div key={ec.id} className="edge-card glass-card">
              <div className="edge-card__top">
                <span className="edge-card__icon">
                  <IconComp size={22} weight="duotone" />
                </span>
                <div className="edge-card__meta">
                  <span className="edge-card__number">#{ec.id}</span>
                  <span className={`badge badge--${ec.category}`}>
                    {CATEGORY_LABELS[ec.category]}
                  </span>
                </div>
              </div>

              <h3 className="edge-card__title">{ec.title}</h3>
              <p className="edge-card__description">{ec.description}</p>

              {ec.canvasImpact && (
                <div className="edge-card__impact">
                  <span className="edge-card__impact-label">Canvas Impact:</span>
                  <span className="edge-card__impact-text">{ec.canvasImpact}</span>
                </div>
              )}

              <div className="edge-card__expected">
                <span className="edge-card__expected-label">Expected Events:</span>
                <div className="edge-card__badges">
                  {ec.expectedEvents.length === 0 ? (
                    <span className="edge-card__none">None — No events fire</span>
                  ) : (
                    ec.expectedEvents.map(evt => (
                      <span key={evt} className={`badge badge--${evt}`}>{evt}</span>
                    ))
                  )}
                </div>
              </div>

              <div className="edge-card__action">
                {ec.triggerType === 'manual' && (
                  <div className="edge-card__instructions">
                    {ec.instructions}
                  </div>
                )}
                {ec.triggerType === 'action' && (
                  <button
                    className="btn btn--primary btn--small"
                    onClick={ec.triggerFn}
                  >
                    ▶ {ec.triggerLabel}
                  </button>
                )}
                {ec.triggerType === 'file' && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={() => {}} 
                    />
                    <button
                      className="btn btn--primary btn--small"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      ▶ Open File Dialog
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .edge-panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .edge-panel__header {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .edge-panel__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .edge-panel__desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
          max-width: 600px;
        }

        .edge-panel__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-md);
        }

        .edge-card {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .edge-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .edge-card:hover::before {
          opacity: 1;
        }

        .edge-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .edge-card__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
        }

        .edge-card:hover .edge-card__icon {
          color: var(--accent-primary);
          background: rgba(226, 74, 58, 0.1);
        }

        .edge-card__meta {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .edge-card__number {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .edge-card__title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .edge-card__description {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .edge-card__impact {
          background: rgba(226, 74, 58, 0.06);
          border: 1px solid rgba(226, 74, 58, 0.1);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .edge-card__impact-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .edge-card__impact-text {
          font-size: 0.74rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .edge-card__expected {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .edge-card__expected-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .edge-card__badges {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .edge-card__none {
          font-size: 0.74rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .edge-card__action {
          margin-top: auto;
          padding-top: 6px;
        }

        .edge-card__instructions {
          font-size: 0.74rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          border: 1px dashed var(--border-primary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}

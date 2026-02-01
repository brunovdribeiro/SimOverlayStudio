import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

export const isDevelop = isDev.default || process.env.NODE_ENV === 'development';

// Flag to track if app is quitting (set from main.ts)
export let isQuitting = false;

export function setIsQuitting(value: boolean): void {
  isQuitting = value;
}

export function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1920,
    height: 1080,
    x: 0, // Position at top-left by default
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Use compiled .js file
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Transparent overlay window
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    focusable: true,
    resizable: true,
    movable: true,
    minimizable: true,
    closable: true,
    opacity: 1.0,
  });

  // Enable click-through for the entire window initially
  // This can be toggled via IPC
  window.setIgnoreMouseEvents(false);

  // Load the app
  const url = isDevelop
    ? 'http://localhost:5173' // Vite dev server
    : `file://${path.join(__dirname, '../dist/index.html')}`; // Production build

  window.loadURL(url);

  // Open DevTools in development
  if (isDevelop) {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  // Prevent the window from being closed, minimize to tray instead
  window.on('close', (event) => {
    if (!window.isDestroyed() && !isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });

  return window;
}

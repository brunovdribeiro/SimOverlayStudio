import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

export const isDevelop = isDev.default || process.env.NODE_ENV === 'development';

export function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Transparent overlay window
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
  });

  // Load the app
  const url = isDevelop
    ? 'http://localhost:5173' // Vite dev server
    : `file://${path.join(__dirname, '../dist/index.html')}`; // Production build

  window.loadURL(url);

  // Open DevTools in development
  if (isDevelop) {
    window.webContents.openDevTools();
  }

  return window;
}

import { app, BrowserWindow, ipcMain } from 'electron';
import { createWindow } from './window';

// Create window variable to keep reference
let mainWindow: BrowserWindow | null;

app.on('ready', () => {
  mainWindow = createWindow();
});

app.on('window-all-closed', () => {
  // On macOS, applications stay active until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window in the app when the dock icon is clicked
  if (mainWindow === null) {
    mainWindow = createWindow();
  }
});

// IPC handlers for overlay control
ipcMain.on('toggle-click-through', (_event, enabled: boolean) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(enabled);
  }
});

ipcMain.on('set-always-on-top', (_event, alwaysOnTop: boolean) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(alwaysOnTop);
  }
});

import { app, BrowserWindow, ipcMain } from 'electron';
import { createWindow, setIsQuitting } from './window';
import { SystemTrayManager } from './tray';
import { BackendProcessManager } from './backend-manager';

// Create window variable to keep reference
let mainWindow: BrowserWindow | null;
let trayManager: SystemTrayManager | null;
let backendManager: BackendProcessManager | null = null;

app.on('ready', () => {
  mainWindow = createWindow();
  
  // Initialize backend manager
  backendManager = new BackendProcessManager();
  
  // Initialize system tray
  trayManager = new SystemTrayManager(mainWindow, backendManager);
  trayManager.create();
  
  // Forward backend status changes to renderer
  backendManager.on('status-change', (status) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('backend-status-change', status);
    }
  });
  
  // Optionally auto-start backend in development mode
  if (process.env.NODE_ENV !== 'development') {
    // In production, auto-start backend
    backendManager.start().catch(err => {
      console.error('Failed to auto-start backend:', err);
    });
  }
});

app.on('before-quit', () => {
  setIsQuitting(true);
  
  // Stop backend process when quitting
  if (backendManager) {
    backendManager.stop().catch(err => {
      console.error('Failed to stop backend:', err);
    });
  }
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

// Window management IPC handlers
ipcMain.on('window-set-position', (_event, x: number, y: number) => {
  if (mainWindow) {
    mainWindow.setPosition(x, y);
  }
});

ipcMain.on('window-set-size', (_event, width: number, height: number) => {
  if (mainWindow) {
    mainWindow.setSize(width, height);
  }
});

ipcMain.on('window-set-opacity', (_event, opacity: number) => {
  if (mainWindow) {
    mainWindow.setOpacity(Math.max(0.1, Math.min(1.0, opacity)));
  }
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Backend management IPC handlers
ipcMain.handle('backend-get-status', async () => {
  return backendManager ? backendManager.getStatus() : { running: false };
});

ipcMain.handle('backend-start', async () => {
  return backendManager ? await backendManager.start() : false;
});

ipcMain.handle('backend-stop', async () => {
  return backendManager ? await backendManager.stop() : false;
});

ipcMain.handle('backend-restart', async () => {
  return backendManager ? await backendManager.restart() : false;
});

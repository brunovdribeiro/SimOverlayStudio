import { contextBridge, ipcRenderer } from 'electron';
import type { BackendStatus } from './types/electron';

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  window: {
    toggleClickThrough: (enabled: boolean) => {
      ipcRenderer.send('toggle-click-through', enabled);
    },
    setAlwaysOnTop: (alwaysOnTop: boolean) => {
      ipcRenderer.send('set-always-on-top', alwaysOnTop);
    },
    setPosition: (x: number, y: number) => {
      ipcRenderer.send('window-set-position', x, y);
    },
    setSize: (width: number, height: number) => {
      ipcRenderer.send('window-set-size', width, height);
    },
    setOpacity: (opacity: number) => {
      ipcRenderer.send('window-set-opacity', opacity);
    },
    minimize: () => {
      ipcRenderer.send('window-minimize');
    },
    close: () => {
      ipcRenderer.send('window-close');
    },
  },
  
  // Backend controls
  backend: {
    getStatus: (): Promise<BackendStatus> => {
      return ipcRenderer.invoke('backend-get-status');
    },
    start: (): Promise<boolean> => {
      return ipcRenderer.invoke('backend-start');
    },
    stop: (): Promise<boolean> => {
      return ipcRenderer.invoke('backend-stop');
    },
    restart: (): Promise<boolean> => {
      return ipcRenderer.invoke('backend-restart');
    },
    onStatusChange: (callback: (status: BackendStatus) => void) => {
      ipcRenderer.on('backend-status-change', (_event, status: BackendStatus) => {
        callback(status);
      });
    },
  },
});

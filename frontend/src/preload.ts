import { contextBridge, ipcRenderer } from 'electron';

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('electron', {
  toggleClickThrough: (enabled: boolean) => {
    ipcRenderer.send('toggle-click-through', enabled);
  },
  setAlwaysOnTop: (alwaysOnTop: boolean) => {
    ipcRenderer.send('set-always-on-top', alwaysOnTop);
  },
});

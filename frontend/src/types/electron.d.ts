// Type definitions for Electron API exposed to renderer process

export interface WindowControls {
  toggleClickThrough: (enabled: boolean) => void;
  setAlwaysOnTop: (alwaysOnTop: boolean) => void;
  setPosition: (x: number, y: number) => void;
  setSize: (width: number, height: number) => void;
  setOpacity: (opacity: number) => void;
  minimize: () => void;
  close: () => void;
}

export interface BackendControls {
  getStatus: () => Promise<BackendStatus>;
  start: () => Promise<boolean>;
  stop: () => Promise<boolean>;
  restart: () => Promise<boolean>;
  onStatusChange: (callback: (status: BackendStatus) => void) => void;
}

export interface BackendStatus {
  running: boolean;
  pid?: number;
  error?: string;
  lastStartTime?: string;
}

export interface ElectronAPI {
  window: WindowControls;
  backend: BackendControls;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

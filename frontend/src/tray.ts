import { app, Tray, Menu, nativeImage, BrowserWindow } from 'electron';
import * as path from 'path';
import { BackendProcessManager } from './backend-manager';

export class SystemTrayManager {
  private tray: Tray | null = null;
  private mainWindow: BrowserWindow;
  private backendManager: BackendProcessManager;

  constructor(mainWindow: BrowserWindow, backendManager: BackendProcessManager) {
    this.mainWindow = mainWindow;
    this.backendManager = backendManager;
  }

  create(): void {
    // Create a simple tray icon
    // Using a base64 encoded 16x16 PNG icon for the tray
    const iconData = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFNSURBVDiNpZMxSwNBEIW/2b0kIIiNjY1gI9jYWFhYWNjY2NhaWFlYWFhYWFhY+A+srCwsLCwsLCwsLCwEwcJCsLCwEAQLwUIQvNnZvZ0be0kIJPqhYXdn3ry3s7srgJmRJKANtIAG0ATqQA2oAlWgAlSAAhADEZABKZACCTABxsAIGAJDoA/0gC7QATrANXAFXAIXwDnQBs6AM+AUOAGOgSPgEDgAWsA+sAfsArvADrAN7ACbwCawAawD68AasAasBn8DZmZm65LWJDUlNSTVJdUkVSVVJFUklSWVJJUkFSUVJBUk5SXlJOUkZSVlJGUkpSWlJCUlJSQlJMUlxSRFJUUkOUmRX4CZmTOzqKSopKgzs6gzs6gzs6gzs6gzs6ikqKSopKikqKSopKikqKSopKikqKSopKikqKSYpJikmKSYpJikmKSYpJikmCSn9QJuuGK+JDxE8AAAAABJRU5ErkJggg==';
    const icon = nativeImage.createFromDataURL(`data:image/png;base64,${iconData}`);

    this.tray = new Tray(icon);
    this.tray.setToolTip('SimOverlay Studio');
    
    this.updateMenu();

    // Handle tray icon click
    this.tray.on('click', () => {
      if (this.mainWindow.isVisible()) {
        this.mainWindow.hide();
      } else {
        this.mainWindow.show();
      }
    });

    // Listen for backend status changes to update menu
    this.backendManager.on('status-change', () => {
      this.updateMenu();
    });
  }

  private updateMenu(): void {
    if (!this.tray) return;

    const backendStatus = this.backendManager.getStatus();
    const backendRunning = backendStatus.running;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'SimOverlay Studio',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: this.mainWindow.isVisible() ? 'Hide Overlay' : 'Show Overlay',
        click: () => {
          if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
          } else {
            this.mainWindow.show();
          }
        },
      },
      { type: 'separator' },
      {
        label: `Backend: ${backendRunning ? 'Running' : 'Stopped'}`,
        enabled: false,
      },
      {
        label: backendRunning ? 'Stop Backend' : 'Start Backend',
        click: async () => {
          if (backendRunning) {
            await this.backendManager.stop();
          } else {
            await this.backendManager.start();
          }
        },
      },
      {
        label: 'Restart Backend',
        enabled: backendRunning,
        click: async () => {
          await this.backendManager.restart();
        },
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          // TODO: Open settings window
          console.log('Settings clicked');
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}

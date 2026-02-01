import { useState, useEffect } from 'react';
import type { BackendStatus } from '../types/electron';

export function ControlPanel() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({ running: false });
  const [opacity, setOpacity] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Get initial backend status
    if (window.electron?.backend) {
      window.electron.backend.getStatus().then(setBackendStatus);
      
      // Listen for status changes
      window.electron.backend.onStatusChange(setBackendStatus);
    }
  }, []);

  const handleBackendStart = async () => {
    if (window.electron?.backend) {
      await window.electron.backend.start();
    }
  };

  const handleBackendStop = async () => {
    if (window.electron?.backend) {
      await window.electron.backend.stop();
    }
  };

  const handleBackendRestart = async () => {
    if (window.electron?.backend) {
      await window.electron.backend.restart();
    }
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    if (window.electron?.window) {
      window.electron.window.setOpacity(newOpacity);
    }
  };

  const handlePositionChange = (x: number, y: number) => {
    setPosition({ x, y });
    if (window.electron?.window) {
      window.electron.window.setPosition(x, y);
    }
  };

  const handleMinimize = () => {
    if (window.electron?.window) {
      window.electron.window.minimize();
    }
  };

  const handleClose = () => {
    if (window.electron?.window) {
      window.electron.window.close();
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Electron Control Panel</h2>
      
      {/* Backend Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Backend Status</h3>
        <div className="bg-gray-700 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${backendStatus.running ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{backendStatus.running ? 'Running' : 'Stopped'}</span>
          </div>
          {backendStatus.pid && <p className="text-sm text-gray-400">PID: {backendStatus.pid}</p>}
          {backendStatus.error && <p className="text-sm text-red-400">Error: {backendStatus.error}</p>}
          {backendStatus.lastStartTime && (
            <p className="text-sm text-gray-400">Started: {new Date(backendStatus.lastStartTime).toLocaleTimeString()}</p>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleBackendStart}
            disabled={backendStatus.running}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
          >
            Start
          </button>
          <button
            onClick={handleBackendStop}
            disabled={!backendStatus.running}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
          >
            Stop
          </button>
          <button
            onClick={handleBackendRestart}
            disabled={!backendStatus.running}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Window Controls */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Window Controls</h3>
        
        {/* Opacity */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Opacity: {opacity.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Position */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">X Position</label>
            <input
              type="number"
              value={position.x}
              onChange={(e) => handlePositionChange(parseInt(e.target.value) || 0, position.y)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Y Position</label>
            <input
              type="number"
              value={position.y}
              onChange={(e) => handlePositionChange(position.x, parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-gray-700 rounded text-sm"
          />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleMinimize}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
          >
            Minimize
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 mt-4">
        <p>💡 Tip: Use system tray to show/hide window and control backend</p>
        <p>💡 Close button will minimize to tray, not exit the app</p>
      </div>
    </div>
  );
}

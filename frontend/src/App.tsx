import { useTelemetry } from './hooks/useTelemetry';
import SpeedometerWidget from './widgets/SpeedometerWidget';
import LapTimerWidget from './widgets/LapTimerWidget';
import './App.css';

function App() {
  const { telemetry, connected, error } = useTelemetry();

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4">
      {/* Status Bar */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SimOverlay Studio</h1>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${connected ? 'text-green-500' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speedometer Widget */}
        {telemetry && <SpeedometerWidget telemetry={telemetry} />}
        
        {/* Lap Timer Widget */}
        {telemetry && <LapTimerWidget telemetry={telemetry} />}
      </div>

      {/* Connection Status Message */}
      {!connected && (
        <div className="fixed bottom-4 right-4 bg-yellow-600 px-4 py-2 rounded">
          Waiting for connection to backend...
        </div>
      )}
    </div>
  );
}

export default App;

import type { TelemetryData } from '../types/TelemetryData';

interface Props {
  telemetry: TelemetryData;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return '--:--.-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
}

export default function LapTimerWidget({ telemetry }: Props) {
  const deltaColor = 
    telemetry.deltaToSessionBest > 0 ? 'text-red-500' : 'text-green-500';
  
  const isDeltaNegative = telemetry.deltaToSessionBest < 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Lap Timer</h2>
      
      {/* Current Lap */}
      <div className="mb-6 pb-4 border-b border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Current Lap</div>
        <div className="text-4xl font-bold text-cyan-400">
          {formatTime(telemetry.currentLapTime)}
        </div>
        <div className="text-xs text-gray-500 mt-1">Lap {telemetry.lapCount}</div>
      </div>

      {/* Best Lap */}
      <div className="mb-6 pb-4 border-b border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Best Lap</div>
        <div className="text-3xl font-bold text-green-400">
          {formatTime(telemetry.bestLapTime)}
        </div>
      </div>

      {/* Last Lap */}
      <div className="mb-6 pb-4 border-b border-gray-700">
        <div className="text-sm text-gray-400 mb-1">Last Lap</div>
        <div className="text-2xl font-bold text-yellow-400">
          {formatTime(telemetry.lastLapTime)}
        </div>
      </div>

      {/* Delta to Best */}
      <div>
        <div className="text-sm text-gray-400 mb-1">Delta to Best</div>
        <div className={`text-2xl font-bold ${deltaColor}`}>
          {isDeltaNegative ? '-' : '+'}{Math.abs(telemetry.deltaToSessionBest).toFixed(2)}s
        </div>
      </div>

      {/* On Track Status */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className={`text-sm font-semibold ${telemetry.isOnTrack ? 'text-green-400' : 'text-orange-400'}`}>
          {telemetry.isOnTrack ? '✓ On Track' : '⚠ In Pit'}
        </div>
      </div>
    </div>
  );
}

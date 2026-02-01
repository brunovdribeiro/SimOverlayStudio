import type { TelemetryData } from '../types/TelemetryData';

interface Props {
  telemetry: TelemetryData;
}

export default function SpeedometerWidget({ telemetry }: Props) {
  const speedKPH = Math.round(telemetry.speed * 3.6); // Convert m/s to km/h
  const rpmPercent = (telemetry.rpm / 8000) * 100; // Assuming max 8000 RPM
  const redlinePercent = 85; // Red line at 85%

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Speedometer</h2>
      
      {/* Speed Display */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-5xl font-bold text-cyan-400">{speedKPH}</div>
          <div className="text-sm text-gray-400">km/h</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-yellow-400">{Math.round(telemetry.rpm)}</div>
          <div className="text-sm text-gray-400">RPM</div>
        </div>
      </div>

      {/* RPM Bar */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">RPM</div>
        <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all ${
              rpmPercent > redlinePercent
                ? 'bg-red-600'
                : 'bg-gradient-to-r from-blue-500 to-green-500'
            }`}
            style={{ width: `${Math.min(rpmPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Gear Display */}
      <div className="bg-gray-700 rounded p-3 text-center">
        <div className="text-2xl font-bold text-white">
          {telemetry.gear === 0 ? 'R' : telemetry.gear === -1 ? 'N' : telemetry.gear}
        </div>
        <div className="text-xs text-gray-400">Gear</div>
      </div>

      {/* Throttle/Brake Indicators */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-gray-700 rounded p-2">
          <div className="text-sm text-gray-400">Throttle</div>
          <div className="text-xl font-semibold text-green-500">{Math.round(telemetry.throttle * 100)}%</div>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <div className="text-sm text-gray-400">Brake</div>
          <div className="text-xl font-semibold text-red-500">{Math.round(telemetry.brake * 100)}%</div>
        </div>
        <div className="bg-gray-700 rounded p-2">
          <div className="text-sm text-gray-400">Clutch</div>
          <div className="text-xl font-semibold text-blue-500">{Math.round(telemetry.clutch * 100)}%</div>
        </div>
      </div>
    </div>
  );
}

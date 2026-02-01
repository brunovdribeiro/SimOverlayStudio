// Telemetry data structure matching backend
export interface TelemetryData {
  // Vehicle State
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  clutch: number;

  // Position and Movement
  positionX: number;
  positionY: number;
  positionZ: number;

  // Session Info
  lapCount: number;
  finishStatus: number;
  isOnTrack: boolean;

  // Lap Timing
  currentLapTime: number;
  lastLapTime: number;
  bestLapTime: number;
  deltaToSessionBest: number;
  deltaToSessionOptimal: number;

  // Fuel and Damage
  fuelLevel: number;
  fuelCapacity: number;
  fuelUsePerLap: number;

  // Tire Data
  tires: TireData[];

  // Timestamp
  timestamp: string;
  sessionTickCount: number;
}

export interface TireData {
  temperature: number;
  wear: number;
  pressure: number;
}

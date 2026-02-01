# SimOverlay Studio - Phase 1 & 2 Implementation

## Project Structure

```
SimOverlayStudio/
├── backend/                    # .NET 10.0 backend services
│   ├── SimOverlayStudio.Backend.slnx    # Solution file
│   ├── SimOverlayStudio.iRacingBridge/  # Main telemetry service
│   ├── SimOverlayStudio.Shared/         # Shared data models
│   └── ...
├── frontend/                   # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── main.ts            # Electron main process
│   │   ├── App.tsx            # Main React component
│   │   ├── hooks/             # Custom React hooks
│   │   ├── widgets/           # Widget components
│   │   └── ...
│   ├── public/                # Static assets
│   └── package.json
├── shared/                    # Shared utilities and types
├── docs/                      # Documentation
└── .gitignore
```

## Backend Setup

### Prerequisites
- .NET 10.0 SDK

### Building & Running

```bash
cd backend
dotnet restore
dotnet build
cd SimOverlayStudio.iRacingBridge
dotnet run
```

The backend will:
- Start a worker service that polls iRacing at 60Hz
- Listen for iRacing Memory Mapped File (MMF) data
- Broadcast telemetry via WebSocket on `ws://localhost:8080/telemetry` at 30Hz

## Frontend Setup

### Prerequisites
- Node.js 18+ and npm

### Development

```bash
cd frontend
npm install
npm run dev              # Start Vite dev server
npm run dev:electron    # Run with Electron (in another terminal)
```

The Electron app will:
- Open a transparent, always-on-top overlay window
- Connect to backend via WebSocket
- Display real-time telemetry widgets

### Building

```bash
npm run build           # Build for production
npm run build:electron  # Package Electron app
```

## Available Widgets (Phase 1)

1. **Speedometer** - Speed, RPM, Gear, Input controls (Throttle/Brake/Clutch)
2. **Lap Timer** - Current/Best/Last lap times with delta calculation

## Technology Stack

### Backend
- **Runtime**: .NET 10.0
- **SDK**: iRSDKSharp 0.9.0 (iRacing SDK wrapper)
- **Communication**: WebSocketSharp 1.0.3-rc9
- **Logging**: Microsoft.Extensions.Logging

### Frontend  
- **UI Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Layout**: react-grid-layout
- **Shell**: Electron 31
- **Communication**: Native WebSocket API

## Development Workflow

1. **Terminal 1**: Start backend
   ```bash
   cd backend/SimOverlayStudio.iRacingBridge
   dotnet run
   ```

2. **Terminal 2**: Start frontend (Vite only for testing)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Terminal 3**: Start Electron app (when ready)
   ```bash
   cd frontend
   npm run electron
   ```

## API Communication

### WebSocket Protocol
- **URL**: `ws://localhost:8080/telemetry`
- **Data Rate**: 30Hz (33ms intervals)
- **Payload**: JSON serialized `TelemetryData` object

### Message Format
```json
{
  "speed": 45.5,
  "rpm": 5500,
  "gear": 3,
  "throttle": 0.85,
  "brake": 0,
  "clutch": 0,
  "lapCount": 5,
  "currentLapTime": 125.430,
  "bestLapTime": 123.120,
  "lastLapTime": 125.100,
  "fuelLevel": 78.5,
  "isOnTrack": true,
  "timestamp": "2026-02-01T12:00:00Z",
  ...
}
```

## Next Steps (Phase 2)

- [ ] Advanced HUD widgets (Relative, Delta Bar, Fuel Strategy)
- [ ] Optimized React rendering with useMemo/useCallback
- [ ] Persistent user settings and layout
- [ ] Cloud data synchronization
- [ ] iRating integration
- [ ] Performance optimization (reduce re-renders)

## Known Issues & Limitations

- WebSocketSharp may have compatibility warnings on .NET 10.0 (fallback to legacy framework)
- Electron transparency may need OS-specific tweaks for smooth overlay
- iRacing MMF polling depends on iRacing being actively running

## Contributing

See [Implementation_Plan.md](./docs/Implementation_Plan.md) for detailed phase requirements.

# Phase 3 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         SIMOVERLAY STUDIO                                 │
│                         Electron Application                              │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                           MAIN PROCESS                                    │
│                          (Node.js/Electron)                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │   main.ts       │  │   window.ts      │  │   tray.ts        │       │
│  │  Entry Point    │  │  Window Config   │  │  System Tray     │       │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘       │
│           │                     │                      │                  │
│           └─────────┬───────────┴──────────────────────┘                 │
│                     │                                                     │
│           ┌─────────▼─────────┐                                          │
│           │  IPC Main Handlers│                                          │
│           │  - window-*       │                                          │
│           │  - backend-*      │                                          │
│           │  - toggle-*       │                                          │
│           └─────────┬─────────┘                                          │
│                     │                                                     │
│  ┌──────────────────▼────────────────┐                                   │
│  │   backend-manager.ts              │                                   │
│  │   ┌───────────────────────────┐   │                                   │
│  │   │ - spawn() dotnet process  │   │                                   │
│  │   │ - monitor PID & status    │   │                                   │
│  │   │ - restart/stop handlers   │   │                                   │
│  │   │ - EventEmitter for status │   │                                   │
│  │   └───────────────────────────┘   │                                   │
│  └──────────────┬────────────────────┘                                   │
│                 │                                                          │
└─────────────────┼──────────────────────────────────────────────────────┘
                  │
         ┌────────▼─────────┐
         │  .NET Backend    │
         │  Process         │
         │  (iRacing Bridge)│
         └──────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        PRELOAD SCRIPT                                     │
│                     (Bridge / Security Layer)                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  preload.ts - contextBridge.exposeInMainWorld()             │        │
│  │                                                              │        │
│  │  window.electron = {                                        │        │
│  │    window: { /* 7 methods */ },                            │        │
│  │    backend: { /* 5 methods */ }                            │        │
│  │  }                                                           │        │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        RENDERER PROCESS                                   │
│                      (React Application)                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  App.tsx                                                     │        │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │        │
│  │  │ ControlPanel   │  │ Speedometer    │  │  LapTimer    │  │        │
│  │  │   Component    │  │    Widget      │  │   Widget     │  │        │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  ControlPanel.tsx                                            │        │
│  │  ┌────────────────────────────────────────────────────┐     │        │
│  │  │  Backend Controls:                                 │     │        │
│  │  │  - window.electron.backend.start()                │     │        │
│  │  │  - window.electron.backend.stop()                 │     │        │
│  │  │  - window.electron.backend.getStatus()            │     │        │
│  │  │  - window.electron.backend.onStatusChange()       │     │        │
│  │  │                                                     │     │        │
│  │  │  Window Controls:                                  │     │        │
│  │  │  - window.electron.window.setOpacity()           │     │        │
│  │  │  - window.electron.window.setPosition()          │     │        │
│  │  │  - window.electron.window.minimize()             │     │        │
│  │  └────────────────────────────────────────────────────┘     │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  useTelemetry Hook                                           │        │
│  │  - WebSocket connection to backend:8080                      │        │
│  │  - Real-time telemetry data                                  │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM TRAY                                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  Tray Icon (Always Visible)                                 │        │
│  │  ┌────────────────────────────────────────────────────┐     │        │
│  │  │  Context Menu:                                      │     │        │
│  │  │  - Show/Hide Overlay                               │     │        │
│  │  │  - Backend Status (Running/Stopped)               │     │        │
│  │  │  - Start/Stop/Restart Backend                     │     │        │
│  │  │  - Settings                                         │     │        │
│  │  │  - Quit                                            │     │        │
│  │  └────────────────────────────────────────────────────┘     │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

                           COMMUNICATION FLOW

Main Process ◄──IPC──► Preload Script ◄──contextBridge──► Renderer Process
     │                                                            │
     │                                                            │
     ├─► BackendManager ──spawn──► .NET Backend Process         │
     │                                   │                       │
     │                                   │                       │
     └─► System Tray                    │                       │
                                         │                       │
                                         └──WebSocket (8080)────┘

═══════════════════════════════════════════════════════════════════════════

                          KEY FEATURES

┌──────────────────────────────────────────────────────────────────────────┐
│  ✅ Transparent, frameless, always-on-top window                         │
│  ✅ Click-through toggle via IPC                                         │
│  ✅ Window positioning (x, y) and sizing (width, height)                 │
│  ✅ Opacity control (0.1 - 1.0)                                          │
│  ✅ Minimize to tray (prevents accidental closure)                       │
│  ✅ System tray with dynamic context menu                                │
│  ✅ Backend process lifecycle management                                 │
│  ✅ Real-time status monitoring and events                               │
│  ✅ Type-safe IPC with TypeScript definitions                           │
│  ✅ Security via context isolation                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

## File Organization

```
frontend/
├── src/
│   ├── main.ts                    # Electron entry point, IPC handlers
│   ├── window.ts                  # Window configuration
│   ├── preload.ts                 # IPC bridge (contextBridge)
│   ├── tray.ts                    # System tray manager
│   ├── backend-manager.ts         # .NET process manager
│   ├── types/
│   │   └── electron.d.ts          # TypeScript definitions
│   ├── components/
│   │   └── ControlPanel.tsx       # UI controls for testing
│   ├── widgets/                   # Telemetry widgets (Phase 1)
│   └── hooks/                     # React hooks (Phase 1)
├── dist-electron/                 # Compiled Electron files
├── dist/                          # Compiled React app
└── tsconfig.electron.json         # Electron TypeScript config
```

## Build Process

```
Source Files                    Build Output
─────────────                   ────────────

src/main.ts        ──tsc──►     dist-electron/main.js
src/window.ts      ──tsc──►     dist-electron/window.js
src/preload.ts     ──tsc──►     dist-electron/preload.js
src/tray.ts        ──tsc──►     dist-electron/tray.js
src/backend-*.ts   ──tsc──►     dist-electron/backend-manager.js

src/App.tsx        ──vite─►     dist/index.html
src/**/*.tsx       ──vite─►     dist/assets/*.js
src/**/*.css       ──vite─►     dist/assets/*.css
```

## IPC Communication Methods

**Synchronous Events (send/on):**
- toggle-click-through
- set-always-on-top
- window-set-position
- window-set-size
- window-set-opacity
- window-minimize
- window-close

**Asynchronous Handles (invoke/handle):**
- backend-get-status → Promise<BackendStatus>
- backend-start → Promise<boolean>
- backend-stop → Promise<boolean>
- backend-restart → Promise<boolean>

**Event Broadcasting (webContents.send):**
- backend-status-change → BackendStatus

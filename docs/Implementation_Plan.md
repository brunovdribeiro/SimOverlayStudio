# Sim Overlay Studio V1.0 Implementation Plan

## Problem Statement
Build a premium, subscription-based HUD overlay system for iRacing with ultra-low latency telemetry, React-based widgets, and a professional layout builder.

## Technical Architecture
- **Backend:** .NET 8/9 service ("iRacing Bridge") reading iRacing MMF
- **Frontend:** React + Tailwind CSS + react-grid-layout
- **Shell:** Electron (transparent, always-on-top, click-through)
- **Communication:** WebSocket (60Hz polling, 30Hz UI broadcast)

## Implementation Workplan

### Phase 1: Project Setup & Infrastructure
- [ ] Initialize Electron application structure
- [ ] Set up React project with TypeScript, Tailwind CSS, and Vite/Webpack
- [ ] Configure .NET 8/9 solution with iRacingSdkWrapper
- [ ] Set up project folder structure (backend, frontend, shared)
- [ ] Configure build tooling and hot-reload for development

### Phase 2: iRacing Bridge (Backend Service)
- [ ] Implement .NET service to read iRacing Memory Mapped File (MMF)
- [ ] Integrate iRacingSdkWrapper for telemetry data access
- [ ] Create data normalization layer (convert MMF data to standard JSON format)
- [ ] Implement WebSocket server (60Hz polling from iRacing, 30Hz broadcast to UI)
- [ ] Add connection/disconnection handling
- [ ] Implement telemetry data models and interfaces

### Phase 3: Electron Shell
- [ ] Configure Electron main process
- [ ] Set up transparent, always-on-top, click-through window
- [ ] Implement window management (positioning, resizing)
- [ ] Add system tray integration
- [ ] Implement process management for .NET backend service
- [ ] Set up IPC between Electron and React renderer

### Phase 4: React UI Foundation
- [ ] Set up React application structure
- [ ] Configure Tailwind CSS theming
- [ ] Implement WebSocket client connection to backend
- [ ] Create telemetry data context/state management
- [ ] Integrate react-grid-layout for widget positioning
- [ ] Build Layout Builder UI (drag-and-drop, resize, lock/unlock)

### Phase 5: MVP Widgets Implementation

#### Widget 1: Super-Combo HUD
- [ ] Create digital gear display component
- [ ] Implement speed display (MPH/KPH)
- [ ] Build RPM bar with configurable ranges
- [ ] Add iRacing-synced shift lights
- [ ] Style and optimize for performance

#### Widget 2: Relative Widget
- [ ] Create driver list component
- [ ] Display gaps to cars ahead/behind
- [ ] Show driver name, iRating, and Safety Rating
- [ ] Add position indicators
- [ ] Implement class-based color coding

#### Widget 3: Live Delta Bar
- [ ] Implement delta calculation logic
- [ ] Create visual bar component (green/red)
- [ ] Add session best lap comparison
- [ ] Display numeric delta value

#### Widget 4: Fuel Strategy Pro
- [ ] Calculate fuel remaining
- [ ] Track consumption per lap
- [ ] Estimate "Liters to Finish"
- [ ] Display refuel recommendations
- [ ] Add warnings for low fuel

#### Widget 5: Input Telemetry
- [ ] Create vertical bar components
- [ ] Implement throttle visualization
- [ ] Implement brake visualization
- [ ] Implement clutch visualization
- [ ] Add percentage labels

#### Widget 6: Mini Leaderboard
- [ ] Display top 10 standings
- [ ] Implement class-based color coding
- [ ] Show position changes
- [ ] Add gap times
- [ ] Auto-scroll/highlight player

### Phase 6: Free Tier Widgets
- [ ] Create basic Speedometer widget
- [ ] Create Lap Timer widget
- [ ] Implement feature gating logic

### Phase 7: Subscription & Authentication
- [ ] Design subscription tiers (Free vs Pro)
- [ ] Implement authentication system
- [ ] Add license validation
- [ ] Create subscription check middleware
- [ ] Build activation/registration UI
- [ ] Implement cloud layout sync for Pro users

### Phase 8: Settings & Configuration
- [ ] Create settings panel UI
- [ ] Add widget visibility toggles
- [ ] Implement theme/color customization
- [ ] Add unit preferences (MPH/KPH, L/Gal)
- [ ] Create layout save/load functionality
- [ ] Add hotkey configuration

### Phase 9: Testing & Optimization
- [ ] Test telemetry data accuracy
- [ ] Optimize WebSocket performance (ensure 60Hz polling)
- [ ] Test UI rendering performance (30Hz target)
- [ ] Validate overlay transparency and click-through
- [ ] Test with various iRacing sessions
- [ ] Performance profiling and optimization

### Phase 10: Packaging & Deployment
- [ ] Configure Electron builder/packager
- [ ] Create installer (Windows focus)
- [ ] Set up auto-update mechanism
- [ ] Create user documentation
- [ ] Prepare distribution package

## Key Considerations

**Performance Requirements:**
- Backend must poll iRacing MMF at 60Hz
- Frontend should update at 30Hz for smooth visuals
- Minimize UI re-renders and optimize React components

**Subscription Model:**
- Free: Speedometer + Lap Timer only
- Pro: Full widget set + cloud sync + iRating data

**User Experience:**
- Seamless installation and setup
- Easy widget customization
- Professional, racing-focused aesthetic
- Low resource footprint

**Technical Challenges:**
- Maintaining low-latency data pipeline
- Transparent overlay window management
- Efficient WebSocket communication
- Widget performance with frequent updates

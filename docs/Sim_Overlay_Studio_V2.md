# Sim Overlay Studio — Version 2.0 (Multi-Sim & LMU)

## Product Vision
Expansion of the ecosystem to support **Le Mans Ultimate (LMU)** and the rFactor 2 engine, transforming the app into a universal sim-racing tool.

## Technical Evolution: The "Adapter" Pattern
V2 introduces a multi-connector architecture. The React UI remains unchanged, while the .NET Service adds a new telemetry provider.

### New Stack Components
- **Telemetry Provider:** LMU Shared Memory Plugin connector.
- **Normalization Layer:** Maps LMU/rFactor 2 data (UDP/Shared Mem) to the existing V1 JSON schema.

## New Features & Widgets
1. **LMU Support:** Full telemetry integration for Le Mans Ultimate.
2. **Multi-Class Leaderboard:** Enhanced logic to handle complex WEC-style classes (Hypercar, LMP2, GT3).
3. **Tire Temperature Map:** Visual heat map of tire surface and carcass temps (highly requested for LMU/rF2).
4. **Damage Indicator:** Visual representation of aero and suspension damage.
5. **Automatic Sim Detection:** The app detects if iRacing or LMU is launched and switches the telemetry provider automatically.

## Subscription Value Add
- **Universal Access:** One subscription covers all supported sims.
- **Advanced LMU Strategy:** Energy recovery system (ERS) monitoring and hybrid deployment widgets.

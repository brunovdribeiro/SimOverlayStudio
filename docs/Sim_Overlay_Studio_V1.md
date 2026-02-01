# Sim Overlay Studio — Version 1.0 (iRacing Focus)

## Product Vision
A premium, subscription-based HUD overlay system designed specifically for the iRacing ecosystem. V1 focuses on ultra-low latency telemetry, high-fidelity React-based widgets, and a professional Layout Builder.

## Technical Stack
- **Backend:** .NET 8/9 (C#) using `iRacingSdkWrapper`.
- **Frontend:** React + Tailwind CSS + `react-grid-layout`.
- **Shell:** Electron (Transparent, Always-on-Top, Click-through).
- **Communication:** Local WebSockets (60Hz polling, 30Hz UI broadcast).

## Core Architecture: The "iRacing Bridge"
The .NET service acts as a sidecar process that reads the iRacing Memory Mapped File (MMF) and normalizes the data into a standard JSON stream for the React UI.

## MVP Widget Set (The "Subscription Core")
1. **Super-Combo HUD:** Digital Gear, Speed, and RPM bar with iRacing-synced shift lights.
2. **The "Relative" Widget:** Gaps to cars ahead/behind, including Driver Name, iRating, and Safety Rating (SR).
3. **Live Delta Bar:** Real-time comparison against session best lap (Green/Red bar).
4. **Fuel Strategy Pro:** Calculated fuel remaining, consumption per lap, and "Liters to Finish" estimation.
5. **Input Telemetry:** Vertical bars for Throttle, Brake, and Clutch to monitor pedal technique.
6. **Mini Leaderboard:** Top 10 standings with class-based color coding.

## Monetization Strategy
- **Free Tier:** Basic Speedometer & Lap Timer.
- **Pro Subscription:** Access to Fuel Strategy, Relative Widget (with iRating data), and Cloud Layout Sync.

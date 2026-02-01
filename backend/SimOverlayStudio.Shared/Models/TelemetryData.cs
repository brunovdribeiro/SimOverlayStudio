namespace SimOverlayStudio.Shared.Models;

/// <summary>
/// Real-time telemetry data from iRacing
/// </summary>
public class TelemetryData
{
    // Vehicle State
    public float Speed { get; set; }
    public float RPM { get; set; }
    public int Gear { get; set; }
    public float Throttle { get; set; }
    public float Brake { get; set; }
    public float Clutch { get; set; }
    
    // Position and Movement
    public double PositionX { get; set; }
    public double PositionY { get; set; }
    public double PositionZ { get; set; }
    
    // Session Info
    public int LapCount { get; set; }
    public int FinishStatus { get; set; }
    public bool IsOnTrack { get; set; }
    
    // Lap Timing
    public float CurrentLapTime { get; set; }
    public float LastLapTime { get; set; }
    public float BestLapTime { get; set; }
    public float DeltaToSessionBest { get; set; }
    public float DeltaToSessionOptimal { get; set; }
    
    // Fuel and Damage
    public float FuelLevel { get; set; }
    public float FuelCapacity { get; set; }
    public float FuelUsePerLap { get; set; }
    
    // Tire Data
    public TireData[] Tires { get; set; } = new TireData[4];
    
    // Timestamp
    public DateTime Timestamp { get; set; }
    public long SessionTickCount { get; set; }
}

public class TireData
{
    public float Temperature { get; set; }
    public float Wear { get; set; }
    public float Pressure { get; set; }
}

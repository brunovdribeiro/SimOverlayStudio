using irsdkSharp;
using SimOverlayStudio.Shared.Models;

namespace SimOverlayStudio.iRacingBridge.Services;

/// <summary>
/// Service that reads iRacing telemetry data at 60Hz from the Memory Mapped File
/// </summary>
public class iRacingTelemetryService
{
    private readonly IRacingSDK _sdk;
    private readonly ILogger<iRacingTelemetryService> _logger;
    
    // Events for broadcasting data
    public event EventHandler<TelemetryData>? OnTelemetryData;
    
    private bool _isConnected;

    public iRacingTelemetryService(ILogger<iRacingTelemetryService> logger)
    {
        _logger = logger;
        _sdk = new IRacingSDK();
    }

    /// <summary>
    /// Start polling iRacing for telemetry data at 60Hz
    /// </summary>
    public void StartPolling()
    {
        _logger.LogInformation("Starting iRacing telemetry polling");
        _isConnected = _sdk.IsConnected();
        
        if (!_isConnected)
        {
            _logger.LogWarning("Failed to connect to iRacing. Ensure iRacing is running.");
        }
    }

    /// <summary>
    /// Poll iRacing telemetry - should be called at 60Hz (every ~16.67ms)
    /// </summary>
    public TelemetryData? PollTelemetry()
    {
        try
        {
            if (!_sdk.IsConnected())
            {
                _isConnected = false;
                return null;
            }

            _isConnected = true;

            var telemetryData = new TelemetryData
            {
                Timestamp = DateTime.UtcNow,
                SessionTickCount = 0 // Will be updated when we have session info
            };

            // Vehicle telemetry
            telemetryData.Speed = GetFloat("Speed");
            telemetryData.RPM = GetFloat("RPM");
            telemetryData.Gear = GetInt("Gear");
            telemetryData.Throttle = GetFloat("Throttle");
            telemetryData.Brake = GetFloat("Brake");
            telemetryData.Clutch = GetFloat("Clutch");

            // Position (using player car index)
            telemetryData.PositionX = GetDouble("CarIdxX");
            telemetryData.PositionY = GetDouble("CarIdxY");
            telemetryData.PositionZ = GetDouble("CarIdxZ");

            // Session data
            telemetryData.LapCount = GetInt("Lap");
            telemetryData.CurrentLapTime = GetFloat("LapCurrentLapTime");
            telemetryData.LastLapTime = GetFloat("LapLastLapTime");
            telemetryData.BestLapTime = GetFloat("LapBestLapTime");
            telemetryData.IsOnTrack = GetInt("OnPitRoad") == 0;

            // Fuel
            telemetryData.FuelLevel = GetFloat("FuelLevel");
            telemetryData.FuelCapacity = GetFloat("FuelLevelPct") > 0 ? GetFloat("FuelLevel") / GetFloat("FuelLevelPct") : 0;
            telemetryData.FuelUsePerLap = GetFloat("FuelUsePerHour") / 60.0f; // Approximate

            // Tires (using LF, RF, LR, RR indices)
            string[] tirePositions = { "LF", "RF", "LR", "RR" };
            for (int i = 0; i < 4; i++)
            {
                telemetryData.Tires[i] = new TireData
                {
                    Temperature = GetFloat($"TireTemp{tirePositions[i]}"),
                    Wear = GetFloat($"TireWear{tirePositions[i]}"),
                    Pressure = GetFloat($"TirePressure{tirePositions[i]}")
                };
            }

            OnTelemetryData?.Invoke(this, telemetryData);
            return telemetryData;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error polling telemetry data");
            return null;
        }
    }

    /// <summary>
    /// Helper method to get float value from SDK
    /// </summary>
    private float GetFloat(string varName)
    {
        try
        {
            var data = _sdk.GetData(varName);
            return data switch
            {
                float f => f,
                double d => (float)d,
                int i => (float)i,
                _ => 0f
            };
        }
        catch
        {
            return 0f;
        }
    }

    /// <summary>
    /// Helper method to get int value from SDK
    /// </summary>
    private int GetInt(string varName)
    {
        try
        {
            var data = _sdk.GetData(varName);
            return data switch
            {
                int i => i,
                float f => (int)f,
                double d => (int)d,
                _ => 0
            };
        }
        catch
        {
            return 0;
        }
    }

    /// <summary>
    /// Helper method to get double value from SDK
    /// </summary>
    private double GetDouble(string varName)
    {
        try
        {
            var data = _sdk.GetData(varName);
            return data switch
            {
                double d => d,
                float f => (double)f,
                int i => (double)i,
                _ => 0.0
            };
        }
        catch
        {
            return 0.0;
        }
    }

    /// <summary>
    /// Shutdown the connection to iRacing
    /// </summary>
    public void Shutdown()
    {
        _logger.LogInformation("Shutting down iRacing telemetry service");
        // IRacingSDK doesn't need explicit disposal
        _isConnected = false;
    }

    public bool IsConnected => _isConnected && _sdk?.IsConnected() == true;
}

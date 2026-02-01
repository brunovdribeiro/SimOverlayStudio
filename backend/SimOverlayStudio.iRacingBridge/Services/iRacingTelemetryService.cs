using iRSDKSharp;
using SimOverlayStudio.Shared.Models;

namespace SimOverlayStudio.iRacingBridge.Services;

/// <summary>
/// Service that reads iRacing telemetry data at 60Hz from the Memory Mapped File
/// </summary>
public class iRacingTelemetryService
{
    private readonly iRSDKWrapper _sdkWrapper;
    private readonly ILogger<iRacingTelemetryService> _logger;
    
    // Events for broadcasting data
    public event EventHandler<TelemetryData>? OnTelemetryData;
    
    private bool _isConnected;
    private int _lastSessionId = -1;
    private int _lastLapCount = -1;

    public iRacingTelemetryService(ILogger<iRacingTelemetryService> logger)
    {
        _logger = logger;
        _sdkWrapper = new iRSDKWrapper();
    }

    /// <summary>
    /// Start polling iRacing for telemetry data at 60Hz
    /// </summary>
    public void StartPolling()
    {
        _logger.LogInformation("Starting iRacing telemetry polling");
        _isConnected = _sdkWrapper.Startup();
        
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
            if (!_isConnected)
            {
                if (!_sdkWrapper.Startup())
                    return null;
                _isConnected = true;
            }

            if (!_sdkWrapper.IsConnected)
            {
                _isConnected = false;
                return null;
            }

            var telemetryData = new TelemetryData
            {
                Timestamp = DateTime.UtcNow,
                SessionTickCount = _sdkWrapper.Header.SessionTickCount
            };

            // Vehicle telemetry
            telemetryData.Speed = _sdkWrapper.GetFloat("Speed");
            telemetryData.RPM = _sdkWrapper.GetFloat("RPM");
            telemetryData.Gear = _sdkWrapper.GetInt("Gear");
            telemetryData.Throttle = _sdkWrapper.GetFloat("Throttle");
            telemetryData.Brake = _sdkWrapper.GetFloat("Brake");
            telemetryData.Clutch = _sdkWrapper.GetFloat("Clutch");

            // Position
            telemetryData.PositionX = _sdkWrapper.GetDouble("CarIdxX", 0);
            telemetryData.PositionY = _sdkWrapper.GetDouble("CarIdxY", 0);
            telemetryData.PositionZ = _sdkWrapper.GetDouble("CarIdxZ", 0);

            // Session data
            telemetryData.LapCount = _sdkWrapper.GetInt("Lap");
            telemetryData.CurrentLapTime = _sdkWrapper.GetFloat("LapCurrentLapTime");
            telemetryData.LastLapTime = _sdkWrapper.GetFloat("LastLapTime");
            telemetryData.BestLapTime = _sdkWrapper.GetFloat("BestLapTime");
            telemetryData.IsOnTrack = _sdkWrapper.GetInt("OnPitRoad") == 0;

            // Fuel
            telemetryData.FuelLevel = _sdkWrapper.GetFloat("FuelLevel");
            telemetryData.FuelCapacity = _sdkWrapper.GetFloat("FuelCapacity");
            telemetryData.FuelUsePerLap = _sdkWrapper.GetFloat("FuelUsePerLap");

            // Tires
            for (int i = 0; i < 4; i++)
            {
                telemetryData.Tires[i] = new TireData
                {
                    Temperature = _sdkWrapper.GetFloat($"TireTemp_{i}"),
                    Wear = _sdkWrapper.GetFloat($"TireWear_{i}"),
                    Pressure = _sdkWrapper.GetFloat($"TirePressure_{i}")
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
    /// Shutdown the connection to iRacing
    /// </summary>
    public void Shutdown()
    {
        _logger.LogInformation("Shutting down iRacing telemetry service");
        _sdkWrapper?.Dispose();
        _isConnected = false;
    }

    public bool IsConnected => _isConnected && _sdkWrapper?.IsConnected == true;
}

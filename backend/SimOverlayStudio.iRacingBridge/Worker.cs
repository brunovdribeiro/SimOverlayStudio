using SimOverlayStudio.iRacingBridge.Services;

namespace SimOverlayStudio.iRacingBridge;

/// <summary>
/// Background worker that polls iRacing telemetry at 60Hz and broadcasts to clients at 30Hz
/// </summary>
public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly iRacingTelemetryService _telemetryService;
    private readonly TelemetryWebSocketServer _wsServer;
    private const int TelemetryPollRate = 60; // Hz
    private const int BroadcastRate = 30; // Hz
    private const int PollIntervalMs = 1000 / TelemetryPollRate; // ~16.67ms
    private const int BroadcastIntervalMs = 1000 / BroadcastRate; // ~33.33ms

    public Worker(
        ILogger<Worker> logger,
        iRacingTelemetryService telemetryService,
        TelemetryWebSocketServer wsServer)
    {
        _logger = logger;
        _telemetryService = telemetryService;
        _wsServer = wsServer;
    }

    public override Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("iRacing Bridge service starting");
        _telemetryService.StartPolling();
        _wsServer.Start();
        return base.StartAsync(cancellationToken);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Worker background task started");
        
        // Track timing for 30Hz broadcast (every ~33ms)
        var broadcastStopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Poll at 60Hz (~16.67ms interval)
                var telemetryData = _telemetryService.PollTelemetry();
                
                // Broadcast at 30Hz (~33.33ms interval)
                if (broadcastStopwatch.ElapsedMilliseconds >= BroadcastIntervalMs && telemetryData != null)
                {
                    _wsServer.BroadcastTelemetry(telemetryData);
                    broadcastStopwatch.Restart();
                }
                
                // Small delay to prevent CPU spinning
                await Task.Delay(PollIntervalMs, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Worker task cancelled");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in worker loop");
            }
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("iRacing Bridge service stopping");
        _wsServer.Stop();
        _telemetryService.Shutdown();
        await base.StopAsync(cancellationToken);
    }
}

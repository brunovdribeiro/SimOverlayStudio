using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;
using WebSocketSharp;
using WebSocketSharp.Server;
using SimOverlayStudio.Shared.Models;

namespace SimOverlayStudio.iRacingBridge.Services;

/// <summary>
/// WebSocket server that broadcasts telemetry data to connected clients at 30Hz
/// </summary>
public class TelemetryWebSocketServer
{
    private readonly WebSocketServer _server;
    private readonly ILogger<TelemetryWebSocketServer> _logger;
    private readonly int _port;
    private TelemetryBroadcaster? _broadcaster;

    public TelemetryWebSocketServer(int port, ILogger<TelemetryWebSocketServer> logger)
    {
        _port = port;
        _logger = logger;
        
        var httpServer = new HttpServer(IPAddress.Loopback, port);
        _server = new WebSocketServer(httpServer);
    }

    /// <summary>
    /// Start the WebSocket server
    /// </summary>
    public void Start()
    {
        try
        {
            _server.AddWebSocketService<TelemetryBroadcaster>("/telemetry", () =>
            {
                _broadcaster ??= new TelemetryBroadcaster(_logger);
                return _broadcaster;
            });

            if (_server.Start())
            {
                _logger.LogInformation("WebSocket server started on ws://localhost:{Port}/telemetry", _port);
            }
            else
            {
                _logger.LogError("Failed to start WebSocket server");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting WebSocket server");
        }
    }

    /// <summary>
    /// Broadcast telemetry data to all connected clients
    /// </summary>
    public void BroadcastTelemetry(TelemetryData data)
    {
        _broadcaster?.BroadcastData(data);
    }

    /// <summary>
    /// Stop the WebSocket server
    /// </summary>
    public void Stop()
    {
        _logger.LogInformation("Stopping WebSocket server");
        _server?.Stop();
    }

    public bool IsListening => _server?.IsListening ?? false;
}

/// <summary>
/// WebSocket behavior for broadcasting telemetry data to clients
/// </summary>
public class TelemetryBroadcaster : WebSocketBehavior
{
    private readonly ILogger<TelemetryWebSocketServer> _logger;
    private static readonly ConcurrentBag<string> _clientIds = new();

    public TelemetryBroadcaster(ILogger<TelemetryWebSocketServer> logger)
    {
        _logger = logger;
    }

    protected override void OnOpen()
    {
        _clientIds.Add(ID);
        _logger.LogInformation("Client connected: {ClientId}", ID);
    }

    protected override void OnClose(CloseEventArgs e)
    {
        _logger.LogInformation("Client disconnected: {ClientId}", ID);
    }

    protected override void OnError(ErrorEventArgs e)
    {
        _logger.LogError("WebSocket error: {Message}", e.Message);
    }

    /// <summary>
    /// Broadcast telemetry data to all connected clients
    /// </summary>
    public void BroadcastData(TelemetryData data)
    {
        try
        {
            var json = JsonSerializer.Serialize(data);
            Sessions.Broadcast(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting telemetry data");
        }
    }
}

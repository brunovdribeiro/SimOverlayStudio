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

    public TelemetryWebSocketServer(int port, ILogger<TelemetryWebSocketServer> logger)
    {
        _port = port;
        _logger = logger;
        
        _server = new WebSocketServer(IPAddress.Any, port);
    }

    /// <summary>
    /// Start the WebSocket server
    /// </summary>
    public void Start()
    {
        try
        {
            _server.AddWebSocketService<TelemetryBroadcaster>("/telemetry", () => new TelemetryBroadcaster(_logger));

            _server.Start();
            _logger.LogInformation("WebSocket server started on ws://localhost:{Port}/telemetry", _port);
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
        try
        {
            var json = JsonSerializer.Serialize(data);
            _server.WebSocketServices["/telemetry"].Sessions.Broadcast(json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error broadcasting telemetry data");
        }
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

    public TelemetryBroadcaster() : this(null!) { }

    public TelemetryBroadcaster(ILogger<TelemetryWebSocketServer> logger)
    {
        _logger = logger;
    }

    protected override void OnOpen()
    {
        _logger?.LogInformation("Client connected: {ClientId}", ID);
    }

    protected override void OnClose(CloseEventArgs e)
    {
        _logger?.LogInformation("Client disconnected: {ClientId}", ID);
    }

    protected override void OnError(WebSocketSharp.ErrorEventArgs e)
    {
        _logger?.LogError("WebSocket error: {Message}", e.Message);
    }
}

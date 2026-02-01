using SimOverlayStudio.iRacingBridge;
using SimOverlayStudio.iRacingBridge.Services;

var builder = Host.CreateApplicationBuilder(args);

// Register services
builder.Services.AddSingleton<iRacingTelemetryService>();
builder.Services.AddSingleton<TelemetryWebSocketServer>(sp => 
    new TelemetryWebSocketServer(8080, sp.GetRequiredService<ILogger<TelemetryWebSocketServer>>()));
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();

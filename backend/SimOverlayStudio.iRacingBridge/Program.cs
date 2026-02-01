using SimOverlayStudio.iRacingBridge;
using SimOverlayStudio.iRacingBridge.Services;

var builder = Host.CreateApplicationBuilder(args);

// Register services
builder.Services.AddSingleton<iRacingTelemetryService>();
builder.Services.AddSingleton(new TelemetryWebSocketServer(8080, builder.Services.BuildServiceProvider().GetRequiredService<ILoggerFactory>().CreateLogger<TelemetryWebSocketServer>()));
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();

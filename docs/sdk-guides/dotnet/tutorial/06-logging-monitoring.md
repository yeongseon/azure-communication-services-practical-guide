---
title: "Step 6: Logging & Monitoring"
description: Monitor your .NET communication application with Azure Monitor and Application Insights.
content_sources:
  diagrams:
    - id: dotnet-tutorial-logging-monitoring-flow
      type: flowchart
      source: mslearn-adapted
      based_on:
        - https://learn.microsoft.com/en-us/azure/communication-services/concepts/logging-and-diagnostics
validation:
  az_cli:
    last_tested: null
    cli_version: null
    sdk_version: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
---

# Step 6: Logging & Monitoring

Track the health and performance of your .NET communication features using standard .NET logging patterns and Azure Monitor.

This tutorial walks these steps in order:

<!-- diagram-id: dotnet-tutorial-logging-monitoring-flow -->
```mermaid
flowchart TD
    START[""Step 6: Logging & Monitoring""]
    N1["1. SDK Logging with ILogger"]
    N2["2. Application Insights Integration"]
    N3["3. Client Diagnostics"]
    N4["4. Custom Telemetry"]
    N5["5. Diagnostic Settings in Azure"]
    START --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
```

## 1. SDK Logging with ILogger

The Azure SDK for .NET integrates with `ILogger`. You can capture SDK logs by configuring your logging provider (e.g., Console, Serilog).

```csharp
using Azure.Core.Diagnostics;

// Listen to all SDK events and write them to the console
using AzureEventSourceListener listener = AzureEventSourceListener.CreateConsoleLogger();
```

## 2. Application Insights Integration

For ASP.NET Core applications, add the Application Insights SDK.

### Add NuGet Package
```bash
dotnet add package Microsoft.ApplicationInsights.AspNetCore
```

### Configure Startup
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddApplicationInsightsTelemetry(Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]);
}
```

## 3. Client Diagnostics

You can configure diagnostic options when initializing your ACS clients.

```csharp
var options = new SmsClientOptions();
options.Diagnostics.IsLoggingEnabled = true;
options.Diagnostics.LoggedHeaderNames.Add("x-ms-request-id");

var client = new SmsClient(connectionString, options);
```

## 4. Custom Telemetry

Use `TelemetryClient` to track custom events related to communications.

```csharp
using Microsoft.ApplicationInsights;

public class MyService
{
    private readonly TelemetryClient _telemetryClient;

    public MyService(TelemetryClient telemetryClient)
    {
        _telemetryClient = telemetryClient;
    }

    public void TrackSmsSent()
    {
        _telemetryClient.TrackEvent("SMSSent");
    }
}
```

## 5. Diagnostic Settings in Azure

Ensure your ACS resource is configured to send logs to Log Analytics:

1.  Navigate to your ACS resource in the Azure Portal.
2.  Select **Diagnostic settings** > **Add diagnostic setting**.
3.  Select categories like **SMS Operational Logs** or **Email Operational Logs**.
4.  Send to your **Log Analytics workspace**.

## Next Step

Finalize your solution with [Infrastructure as Code](./07-infrastructure-as-code.md).

## See Also
- [05. Voice Calling](./05-voice-calling.md)
- [07. Infrastructure as Code](./07-infrastructure-as-code.md)
- [Tutorial Index](./index.md)
- [.NET Recipes](../recipes/index.md)

## Sources
- [Azure Communication Services Logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/logging-and-diagnostics)
- [Logging with the Azure SDK for .NET](https://learn.microsoft.com/en-us/dotnet/azure/sdk/logging)

---
hide: [toc]
content_sources:
  - azure-monitor-acs
  - log-analytics-acs
---

# Detector Map

ACS diagnostic capabilities and how to use them for troubleshooting.

## ACS Diagnostic Architecture

ACS provides multiple layers of telemetry to help you understand service behavior and troubleshoot issues.

<!-- diagram-id: detector-architecture -->
```mermaid
graph TD
    Client[Client Device / SDK] --> UFD[User Facing Diagnostics]
    UFD --> LogAnalytics[Log Analytics]
    LogAnalytics --> AzureMonitor[Azure Monitor Metrics]
    AzureMonitor --> EventGrid[Event Grid Webhooks]
    
    UFD -- Real-time Feedback --> User[End User]
    EventGrid -- Automation --> App[Customer App]
```

## Diagnostic Capabilities

### 1. Azure Monitor Metrics
Metrics provide a high-level view of service health, error rates, and throughput.

* **SmsMessagesSent / SmsMessagesDelivered**: Track SMS delivery success rates.
* **EmailMessagesSent / EmailMessagesDelivered**: Track email delivery success rates.
* **CallMediaStreamQuality**: Monitor latency, jitter, and packet loss for calls.
* **ChatMessageReceived / ChatMessageSent**: Track chat message volume and error rates.

### 2. Log Analytics Tables
Log Analytics provides transaction-level details, error codes, and request/response metadata.

| Table Name | Description |
| --- | --- |
| `ACSSMSDeliveryReportEvents` | Detailed SMS delivery status reports. |
| `ACSEmailDeliveryReportEvents` | Detailed email delivery status reports. |
| `ACSCallSummaryEvents` | Summary of each call, including start/end times and reasons. |
| `ACSCallDiagnosticsEvents` | Real-time diagnostic events for voice and video quality. |
| `ACSChatMessageReceivedEvents` | Details on each chat message received. |
| `ACSTeamsInteroperabilityEvents` | Details on Teams meeting interop activities. |

### 3. Event Grid Events
Event Grid provides real-time webhooks for delivery reports, message events, and state changes.

* **Microsoft.Communication.SMSReceived**: Fired when a message is received.
* **Microsoft.Communication.SMSDeliveryReportReceived**: Fired when a delivery report is received.
* **Microsoft.Communication.ChatMessageReceived**: Fired when a chat message is received.
* **Microsoft.Communication.CallStarted / CallEnded**: Fired when a call session starts or ends.

### 4. Client-side User Facing Diagnostics (UFD)
UFD provides real-time feedback to the client app about network conditions and device issues.

* **network-quality**: Signal strength and network stability.
* **no-network**: Disconnection from the signaling service.
* **media-stream-dropped**: Loss of a specific audio or video stream.

## See Also
* [Evidence Map](../evidence-map.md)
* [Troubleshooting Methodology](troubleshooting-method.md)
* [KQL Query Library Overview](../kql/index.md)

## Sources
* [ACS Diagnostic Logs Documentation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/diagnostic-logging)
* Azure Monitor for Communication Services Overview

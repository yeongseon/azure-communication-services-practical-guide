---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/voice-and-video-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acscallsummary
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acscalldiagnostics
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Voice/Video KQL Overview

Analyze call quality, media performance, and call drops.

## Log Analytics Tables

* **ACSCallSummary**: Participant-level call summaries, including duration, participant end reason, endpoint type, SDK version, and call type.
* **ACSCallDiagnostics**: Media stream diagnostics, including jitter, round-trip time, packet loss, codec, media type, and stream direction.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Call Quality Analysis** | [Call Quality Metrics](call-quality-metrics.md) | Find the average and maximum latency, jitter, and packet loss for calls. |
| **Call End Reasons** | [Call End Trends](#call-end-reasons) | Track the reason for call completion over time. |
| **Media Quality Trends** | [Media Quality](#media-quality-trends) | Track the average media quality across all calls. |

## Query Examples

### Call End Reasons
Track the reasons for call completion grouped by time.

```kusto
ACSCallSummary
| where TimeGenerated > ago(24h)
| summarize CallCount = count() by ParticipantEndReason, ResultCategory, bin(TimeGenerated, 1h)
| render barchart
```

### Media Quality Trends
Track the percentage of calls with good, fair, or poor quality over time.

```kusto
ACSCallDiagnostics
| where TimeGenerated > ago(24h)
| summarize
    AvgRoundTripTimeMs = avg(RoundTripTimeAvg),
    AvgJitterMs = avg(JitterAvg),
    AvgPacketLoss = avg(PacketLossRateAvg)
    by MediaType, StreamDirection, bin(TimeGenerated, 1h)
| render stackedareachart
```

## See Also
* [Call Quality Metrics KQL](call-quality-metrics.md)
* [Call Quality Playbook](../../playbooks/voice-video/call-quality.md)

## Sources
* [Voice and video call logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/voice-and-video-logs)
* [ACSCallSummary table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acscallsummary)
* [ACSCallDiagnostics table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acscalldiagnostics)

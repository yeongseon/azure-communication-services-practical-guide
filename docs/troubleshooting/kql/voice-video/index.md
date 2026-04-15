---
content_sources:
  - azure-docs
  - calling-log-analytics
---

# Voice/Video KQL Overview

Analyze call quality, media performance, and call drops.

## Log Analytics Tables

* **ACSCallSummaryEvents**: Detailed logs for each call's start and end, including the reason for completion.
* **ACSCallDiagnosticsEvents**: Detailed logs for each call's real-time media diagnostics, including jitter, latency, and packet loss.

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
ACSCallSummaryEvents
| where TimeGenerated > ago(24h)
| summarize CallCount = count() by CallEndReason, bin(TimeGenerated, 1h)
| render barchart
```

### Media Quality Trends
Track the percentage of calls with good, fair, or poor quality over time.

```kusto
ACSCallDiagnosticsEvents
| where TimeGenerated > ago(24h)
| summarize QualityCount = count() by MediaPathQuality, bin(TimeGenerated, 1h)
| render stackedareachart
```

## See Also
* [Call Quality Metrics KQL](call-quality-metrics.md)
* [Call Quality Playbook](../../playbooks/voice-video/call-quality.md)

## Sources
* Azure Monitor Calling Diagnostic Log Reference

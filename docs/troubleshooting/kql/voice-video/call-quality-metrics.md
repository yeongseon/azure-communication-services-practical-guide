---
hide: [toc]
content_sources:
  - azure-docs
  - calling-log-analytics
---

# Call Quality Metrics KQL

Analyze call quality and identify common media performance issues.

## Query Description

This query retrieves recent call diagnostic events, filters for poor quality, and summarizes the average latency, jitter, and packet loss for each call.

## KQL Query

```kusto
ACSCallDiagnosticsEvents
| where TimeGenerated > ago(1h)
| where MediaPathQuality != "Good"
| extend Latency = PacketLatencyMs, Jitter = PacketJitterMs, Loss = PacketLossRate
| summarize 
    AverageLatency = avg(Latency), 
    AverageJitter = avg(Jitter), 
    AverageLoss = avg(Loss) 
    by CallId, MediaPathQuality
| order by AverageLoss desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Filters results to the last hour to focus on current issues and improve performance. |
| `MediaPathQuality != "Good"` | Selects only calls with poor quality or media drops. |
| `extend Latency, Jitter, Loss` | Renames the diagnostic metrics to more readable names. |
| `summarize AverageLatency, AverageJitter, AverageLoss` | Calculates the average values for each call ID and quality level. |
| `by CallId, MediaPathQuality` | Groups the results by call ID and media path quality. |

## Insights

* **Observed Latency**: Look for average latency greater than 200ms, which may be noticeable to users.
* **Network Performance**: High jitter or packet loss for a specific call ID suggests a network issue.
* **Volume Analysis**: A high count of calls with poor quality may suggest a service-level issue or heavy load.

## See Also
* [Voice/Video KQL Overview](index.md)
* [Call Quality Playbook](../../playbooks/voice-video/call-quality.md)

## Sources
* Azure Call Diagnostic Log Reference

---
content_sources:
  - azure-log-analytics
  - acs-kql-library
---

# KQL Query Library

A collection of pre-built KQL queries for analyzing and troubleshooting ACS activities in Log Analytics.

## Categories

| Category | Description | Overview |
| --- | --- | --- |
| **SMS** | Delivery tracking, error analysis, and rate limiting logs. | [SMS KQL Overview](sms/index.md) |
| **Email** | Bounces, domain verification, and delivery performance. | [Email KQL Overview](email/index.md) |
| **Chat** | Latency, message delivery, and thread activity analysis. | [Chat KQL Overview](chat/index.md) |
| **Voice/Video** | Call quality, media performance, and call drops. | [Voice/Video KQL Overview](voice-video/index.md) |
| **General** | Resource-level diagnostic events and summary logs. | [Detector Map](../methodology/detector-map.md) |

## Quick Queries

* [SMS Delivery Status](sms/delivery-status.md)
* [Email Delivery Status](email/delivery-status.md)
* [Chat Message Latency](chat/message-latency.md)
* [Call Quality Metrics](voice-video/call-quality-metrics.md)

## Best Practices

* **Filter by Time**: Always include `TimeGenerated > ago(1h)` to limit the query scope and improve performance.
* **Join Tables Carefully**: Use `join` sparingly, especially on large per-stream tables like `ACSCallDiagnostics`.
* **Use Summarize**: Group data by relevant fields (e.g., `ResultSignature`, `Status`) to identify common failure patterns.
* **Visualize Results**: Use `render barchart` or `render timechart` to visualize trends and anomalies.

## See Also
* [Evidence Map](../evidence-map.md)
* [Detector Map](../methodology/detector-map.md)

## Sources
* Azure Monitor Kusto Query Language (KQL) Documentation
* [ACS Log Analytics Reference](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/diagnostic-logging)

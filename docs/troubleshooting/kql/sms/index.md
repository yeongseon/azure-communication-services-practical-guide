---
hide: [toc]
content_sources:
  - azure-docs
  - sms-log-analytics
---

# SMS KQL Overview

Analyze SMS delivery performance, error patterns, and throughput.

## Log Analytics Tables

* **ACSSMSDeliveryReportEvents**: Detailed logs for each outbound SMS, including its status and any error details.
* **ACSIncomingSMSEvents**: Detailed logs for each inbound SMS, including its content and the recipient number.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Delivery Failure Analysis** | [SMS Delivery Status](delivery-status.md) | Find the most common reasons for undelivered messages. |
| **Incoming Message Trends** | [Incoming Trends](#incoming-trends) | Track the volume of incoming messages over time. |
| **Throttling Analysis** | [Throttling](#throttling-analysis) | Identify if any sender numbers are hitting rate limits. |

## Query Examples

### Incoming Trends
Track the volume of incoming SMS messages grouped by time.

```kusto
ACSIncomingSMSEvents
| where TimeGenerated > ago(24h)
| summarize MessageCount = count() by bin(TimeGenerated, 1h)
| render timechart
```

### Throttling Analysis
Identify if any sender numbers are hitting rate limits.

```kusto
ACSSMSDeliveryReportEvents
| where TimeGenerated > ago(1h)
| where DeliveryStatusDetails has "Throttled" or DeliveryStatusDetails has "429"
| summarize ThrottledCount = count() by From
| order by ThrottledCount desc
```

## See Also
* [SMS Delivery Status KQL](delivery-status.md)
* [SMS Delivery Failures Playbook](../../playbooks/sms/delivery-failures.md)

## Sources
* Azure Monitor SMS Diagnostic Log Reference

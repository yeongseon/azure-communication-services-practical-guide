---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/sms-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acssmsincomingoperations
---

# SMS KQL Overview

Analyze SMS delivery performance, error patterns, and throughput.

## Log Analytics Tables

* **ACSSMSIncomingOperations**: SMS operation logs, including result type, result signature, result description, message ID, phone number, number type, and request duration.

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
ACSSMSIncomingOperations
| where TimeGenerated > ago(24h)
| summarize MessageCount = count() by OperationName, bin(TimeGenerated, 1h)
| render timechart
```

### Throttling Analysis
Identify if any sender numbers are hitting rate limits.

```kusto
ACSSMSIncomingOperations
| where TimeGenerated > ago(1h)
| where ResultSignature == "429" or ResultDescription has "Throttled"
| summarize ThrottledCount = count() by PhoneNumber, NumberType
| order by ThrottledCount desc
```

## See Also
* [SMS Delivery Status KQL](delivery-status.md)
* [SMS Delivery Failures Playbook](../../playbooks/sms/delivery-failures.md)

## Sources
* [SMS logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/sms-logs)
* [ACSSMSIncomingOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acssmsincomingoperations)

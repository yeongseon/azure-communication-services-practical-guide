---
hide: [toc]
content_sources:
  - azure-docs
  - email-log-analytics
---

# Email KQL Overview

Analyze email delivery performance, error patterns, and throughput.

## Log Analytics Tables

* **ACSEmailDeliveryReportEvents**: Detailed logs for each outbound email, including its status and any error details.
* **ACSEmailDeliveryStatusEvents**: Detailed logs for each email's delivery status updates.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Delivery Failure Analysis** | [Email Delivery Status](delivery-status.md) | Find the most common reasons for bounced or failed emails. |
| **Bounce Rate Trends** | [Bounce Trends](#bounce-rate-trends) | Track the bounce rate of emails over time. |
| **Sending Tier Analysis** | [Sending Tier](#sending-tier-analysis) | Identify if any domains are hitting sending tier limits. |

## Query Examples

### Bounce Rate Trends
Track the percentage of emails that failed delivery over time.

```kusto
ACSEmailDeliveryReportEvents
| where TimeGenerated > ago(24h)
| summarize 
    TotalSent = count(), 
    TotalFailed = countif(Status != "Delivered") 
    by bin(TimeGenerated, 1h)
| project TimeGenerated, BounceRate = (toreal(TotalFailed) / TotalSent) * 100
| render timechart
```

### Sending Tier Analysis
Identify if any sender domains are hitting rate limits.

```kusto
ACSEmailDeliveryReportEvents
| where TimeGenerated > ago(1h)
| where Status has "Throttled" or Status has "429"
| summarize ThrottledCount = count() by SenderEmailAddress
| order by ThrottledCount desc
```

## See Also
* [Email Delivery Status KQL](delivery-status.md)
* [Email Delivery Failures Playbook](../../playbooks/email/delivery-failures.md)

## Sources
* Azure Monitor Email Diagnostic Log Reference

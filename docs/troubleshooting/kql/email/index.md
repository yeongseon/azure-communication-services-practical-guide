---
content_sources:
  - azure-docs
  - email-log-analytics
---

# Email KQL Overview

Analyze email delivery performance, error patterns, and throughput.

## Log Analytics Tables

ACS Email surfaces three Operational tables (see the [ACS Email Logs schema](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/email-logs)):

* **`ACSEmailSendMailOperational`** — One row per `SendEmail` API call. Tracks send-side metadata (correlation ID, recipient counts, attachment counts, size). Does **not** expose delivery status.
* **`ACSEmailStatusUpdateOperational`** — One row per lifecycle transition. Tracks per-recipient delivery state (`Delivered`, `Bounced`, `Failed`, etc.) via `DeliveryStatus`, plus `SmtpStatusCode`, `EnhancedSmtpStatusCode`, and `IsHardBounce` (boolean).
* **`ACSEmailUserEngagementOperational`** — One row per recipient interaction (open, click) when engagement tracking is enabled.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Delivery Failure Analysis** | [Email Delivery Status](delivery-status.md) | Find the most common reasons for bounced or failed emails. |
| **Bounce Rate Trends** | [Bounce Trends](#bounce-rate-trends) | Track the bounce rate of emails over time. |
| **Sender Failure Rate** | [Sender Failure Rate](#sender-failure-rate) | Surface senders with elevated failure rates (a proxy for throttling or reputation issues). |

## Query Examples

### Bounce Rate Trends
Track the percentage of recipient-level rows that did not reach `Delivered`, bucketed hourly.

```kusto
ACSEmailStatusUpdateOperational
| where TimeGenerated > ago(24h)
| where isnotempty(RecipientId)
| summarize
    TotalRecipients = count(),
    Failed = countif(DeliveryStatus != "Delivered")
    by bin(TimeGenerated, 1h)
| project TimeGenerated, BounceRate = (toreal(Failed) / TotalRecipients) * 100
| render timechart
```

`isnotempty(RecipientId)` filters out the message-level rows (`Dropped`, `OutForDelivery`, `Queued`), keeping only recipient-level transitions so each recipient is counted exactly once.

### Sender Failure Rate
The Email schema does not expose an explicit `Throttled` delivery status. To surface senders that may be hitting throttling or reputation issues, look for elevated failure rates per `SenderDomain` instead:

```kusto
ACSEmailStatusUpdateOperational
| where TimeGenerated > ago(1h)
| where isnotempty(RecipientId)
| summarize
    Total = count(),
    Failed = countif(DeliveryStatus in ("Failed", "Bounced", "Quarantined"))
    by SenderDomain
| extend FailureRate = todouble(Failed) / todouble(Total)
| where Total >= 20 and FailureRate > 0.10
| order by FailureRate desc
```

If you need finer-grained signals, group by `SenderDomain, SenderUsername` and inspect `SmtpStatusCode` / `EnhancedSmtpStatusCode` on the failing rows for the carrier's reason code.

## See Also
* [Email Delivery Status KQL](delivery-status.md)
* [Email Delivery Failures Playbook](../../playbooks/email/delivery-failures.md)
* [Monitoring Azure Communication Services](../../../operations/monitoring.md) — full Log Analytics + alert setup

## Sources
* [ACS Email Logs Reference (Microsoft Learn)](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/email-logs)

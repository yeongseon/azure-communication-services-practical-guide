---
content_sources:
  - azure-docs
  - email-log-analytics
---

# Email Delivery Status KQL

Analyze email delivery performance and identify common bounce reasons using `ACSEmailStatusUpdateOperational`.

## Query Description

These queries retrieve email delivery status updates, analyze failed deliveries, and track individual message lifecycles to ensure high deliverability and identify transient or persistent issues.

## KQL Queries

### Query 1: Delivery Status Summary
```kusto
ACSEmailStatusUpdateOperational
| where TimeGenerated > ago(1h)
| where DeliveryStatus != ""
| summarize Count = count() by DeliveryStatus
| sort by Count desc
```

### Query 2: Failed Deliveries Analysis
```kusto
ACSEmailStatusUpdateOperational
| where TimeGenerated > ago(24h)
| where isnotempty(RecipientId)
| where DeliveryStatus in ("Bounced", "Failed", "FilteredSpam", "Quarantined")
| summarize
    BounceCount = count(),
    SampleDomain = take_any(SenderDomain)
    by DeliveryStatus, IsHardBounce
| order by BounceCount desc
```

### Query 3: Per-Message Lifecycle
```kusto
ACSEmailStatusUpdateOperational
| summarize
    StatusChanges = count(),
    FirstEvent = min(TimeGenerated),
    LastEvent = max(TimeGenerated)
    by CorrelationId
| extend DurationSec = datetime_diff("second", LastEvent, FirstEvent)
| sort by FirstEvent desc
```

## Explanation

| Field | Description |
| --- | --- |
| `ACSEmailStatusUpdateOperational` | The operational table for Azure Email status updates. |
| `DeliveryStatus` | The current state of the email delivery (e.g., `Delivered`, `Bounced`, `Failed`). |
| `CorrelationId` | Unique identifier for a single email send request, used to track its full lifecycle. Populated with the MessageID returned by Email send requests. |
| `RecipientId` | Per-recipient email address. Empty on message-level rows (e.g., `Dropped`, `OutForDelivery`) and populated on recipient-level rows (e.g., `Delivered`, `Bounced`, `Failed`). |
| `IsHardBounce` | String flag (documented type: string) indicating whether the failure is a permanent (hard) bounce. `IsHardBounce == "true"` means a permanent mailbox issue. Populated for `Bounced` status only. |
| `FailureMessage` | Verbatim error message returned by the recipient mail server for the given SMTP or EnhancedSmtp status code. |
| `FailureReason` | Failure reason for the given SMTP or EnhancedSmtp status code. |
| `RecipientMailServerHostName` | The mail server host name of the recipient. |
| `SmtpStatusCode` | The standard SMTP status code returned by the recipient mail server. |
| `EnhancedSmtpStatusCode` | Detailed enhanced SMTP status code for more specific error diagnosis. |
| `SenderDomain` | Sending domain (the part after `@` in the sender address). |

## Insights

* **Observed Patterns**: Most emails transition from submission to `Delivered` within 3-6 seconds in optimal conditions.
* **Hard Bounces vs. Soft Bounces**: Monitor `IsHardBounce` (string per the documented schema — compare against the literal `"true"`) to identify invalid addresses that should be removed from mailing lists.
* **Spam Filtering**: If `DeliveryStatus` is `FilteredSpam` or `Quarantined`, inspect `EnhancedSmtpStatusCode` and `SmtpStatusCode` for machine-parseable classification and `FailureMessage` / `FailureReason` for the verbatim error context returned by the recipient server.
* **Recipient Provider Patterns**: The `RecipientMailServerHostName` column captures the recipient's mail server host when the provider returns one. To group by destination domain (e.g., `gmail.com`) instead of exact host, derive the recipient domain from `RecipientId`: `extend RecipientDomain = tostring(split(RecipientId, "@")[1])`.

## Verified Results (April 2026)

!!! success "Verified: Real Query Results"
    These KQL queries and results were validated against actual ACSEmailStatusUpdateOperational data on April 14, 2026.

**From our actual testing (9 emails sent, all delivered to Gmail recipients):**

| Metric | Value |
|---|---|
| Total emails sent | 9 |
| Delivery status | 9/9 Delivered |
| Recipient domain (derived from `RecipientId` `@`-suffix) | gmail.com |
| Sender domain | `<azure-managed-domain>.azurecomm.net` |
| Avg lifecycle (submit → Delivered) | 3-6 seconds |
| Hard bounces | 0 |
| Failures | 0 |

## See Also
* [Email KQL Overview](index.md)
* [Email Delivery Failures Playbook](../../playbooks/email/delivery-failures.md)

## Sources
* [ACSEmailStatusUpdateOperational — Azure Monitor Logs reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acsemailstatusupdateoperational)

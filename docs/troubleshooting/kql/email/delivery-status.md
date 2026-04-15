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
| `CorrelationId` | Unique identifier for a single email send request, used to track its full lifecycle. |
| `IsHardBounce` | Boolean flag indicating if the failure is a permanent (hard) bounce. |
| `SmtpStatusCode` | The standard SMTP status code returned by the recipient mail server. |
| `EnhancedSmtpStatusCode` | Detailed enhanced SMTP status code for more specific error diagnosis. |
| `RecipientMailServerHostName` | The hostname of the mail server that received (or rejected) the email. |

## Insights

* **Observed Patterns**: Most emails transition from submission to `Delivered` within 3-6 seconds in optimal conditions.
* **Hard Bounces vs. Soft Bounces**: Monitor `IsHardBounce` to identify invalid addresses that should be removed from mailing lists.
* **Spam Filtering**: If `DeliveryStatus` is `FilteredSpam`, check the `FailureMessage` or `EnhancedSmtpStatusCode` for clues about content or reputation issues.
* **Recipient Server Issues**: `RecipientMailServerHostName` helps identify if delivery problems are localized to specific providers like Gmail or Outlook.

## Verified Results (April 2026)

!!! success "Verified: Real Query Results"
    These KQL queries and results were validated against actual ACSEmailStatusUpdateOperational data on April 14, 2026.

**From our actual testing (9 emails sent, all delivered to Gmail):**

| Metric | Value |
|---|---|
| Total emails sent | 9 |
| Delivery status | 9/9 Delivered |
| Recipient mail server | gmail-smtp-in.l.google.com |
| Sender domain | fc135b5e-...kr2.azurecomm.net |
| Avg lifecycle (submit → Delivered) | 3-6 seconds |
| Hard bounces | 0 |
| Failures | 0 |

## See Also
* [Email KQL Overview](index.md)
* [Email Delivery Failures Playbook](../../playbooks/email/delivery-failures.md)

## Sources
* Azure Email Delivery Status Codes Reference

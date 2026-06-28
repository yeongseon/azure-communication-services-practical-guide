---
content_sources:
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations
content_validation:
  status: verified
  last_reviewed: 2026-06-29
  reviewer: agent
  core_claims:
    - claim: "ACS SMS diagnostic logs land in a single table, ACSSMSIncomingOperations, with event types discriminated by OperationName"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs
      verified: true
    - claim: "OperationName values are SMSMessagesSent, SMSDeliveryReportsReceived, and SMSMessagesReceived"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs
      verified: true
    - claim: "Outcome is reported via ResultType (Succeeded or Failed) with ResultSignature carrying the HTTP status (for example 429 for throttling) and ResultDescription holding the diagnostic message"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations
      verified: true
---

# SMS KQL Overview

Analyze SMS send activity, delivery report outcomes, inbound receives, and throttling using the diagnostic log table that ACS actually emits.

## Log Analytics Tables

ACS emits **one** SMS diagnostic table. Discriminate event types with `OperationName`.

| Table | Purpose | Discriminator |
| --- | --- | --- |
| `ACSSMSIncomingOperations` | All incoming requests to SMS operations: sends, delivery report callbacks, and inbound receives. | `OperationName` |

`OperationName` values:

* `SMSMessagesSent` — outbound send request to ACS.
* `SMSDeliveryReportsReceived` — per-recipient delivery outcome the carrier returned to ACS.
* `SMSMessagesReceived` — inbound SMS received on an ACS-owned number.

Key columns used across the queries below:

* `ResultType` — `Succeeded` or `Failed`.
* `ResultSignature` — HTTP status code (for example `200`, `400`, `429`).
* `ResultDescription` — diagnostic message string.
* `PhoneNumber` — the ACS-owned number associated with the operation. For sends this is the sender number; for receives and delivery reports it is the ACS number that owned the message.
* `MessageId` — correlator that joins a send to its later delivery report row.
* `DeliveryAttempts`, `OutgoingMessageLength`, `IncomingMessageLength`, `Country`, `NumberType` — context fields documented on the table reference.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Delivery Failure Analysis** | [SMS Delivery Status](delivery-status.md) | Find the most common reasons for undelivered messages. |
| **Incoming Message Trends** | [Incoming Trends](#incoming-trends) | Track the volume of incoming messages over time. |
| **Throttling Analysis** | [Throttling](#throttling-analysis) | Identify if sender numbers are hitting HTTP 429 throttling on send. |

## Query Examples

### Incoming Trends
Track the volume of inbound SMS messages over time.

```kusto
ACSSMSIncomingOperations
| where TimeGenerated > ago(24h)
| where OperationName == "SMSMessagesReceived"
| summarize MessageCount = count() by bin(TimeGenerated, 1h)
| render timechart
```

### Throttling Analysis
Identify ACS-owned numbers whose **send** requests are being throttled. The signal of throttling is `ResultSignature == 429` on `SMSMessagesSent` rows.

```kusto
ACSSMSIncomingOperations
| where TimeGenerated > ago(1h)
| where OperationName == "SMSMessagesSent"
| where ResultSignature == 429
| summarize ThrottledCount = count() by PhoneNumber
| order by ThrottledCount desc
```

## See Also
* [SMS Delivery Status KQL](delivery-status.md)
* [SMS Delivery Failures Playbook](../../playbooks/sms/delivery-failures.md)

## Sources
* [Azure Communication Services SMS logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs)
* [ACSSMSIncomingOperations table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations)
* [Sample KQL queries for ACSSMSIncomingOperations](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/acssmsincomingoperations)

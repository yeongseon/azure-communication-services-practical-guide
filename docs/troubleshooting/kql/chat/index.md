---
content_sources:
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/chat-logs
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
content_validation:
  status: verified
  last_reviewed: 2026-07-01
  reviewer: agent
  core_claims:
    - claim: "ACS chat operational logs land in a single table, ACSChatIncomingOperations, containing incoming requests to chat operations"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
      verified: true
    - claim: "ACSChatIncomingOperations columns include OperationName, UserId, ChatThreadId, ChatMessageId, DurationMs, ResultType, ResultSignature, and CorrelationId"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
      verified: true
    - claim: "DurationMs on ACSChatIncomingOperations is the duration of the operation in milliseconds, computed server-side by the service"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
      verified: true
---

# Chat KQL Overview

Analyze chat operation activity, latency, and failure patterns using the diagnostic log table that ACS actually emits.

## Log Analytics Tables

ACS emits **one** chat operational log table. Different chat API operations (thread creation, message send, participant management, and so on) are discriminated by `OperationName`.

| Table | Purpose | Discriminator |
| --- | --- | --- |
| `ACSChatIncomingOperations` | All incoming requests to ACS chat operations, one row per API request. | `OperationName` |

Key columns used across the queries below:

* `OperationName` — the chat API operation associated with the log record.
* `ResultType` — the status of the operation.
* `ResultSignature` — the sub-status of the operation; for REST API calls this is the HTTP status code (for example `200`, `429`).
* `DurationMs` — the duration of the operation in milliseconds, computed server-side by the service.
* `UserId` — the request sender's user ID.
* `ChatThreadId` — the chat thread ID associated with the request.
* `ChatMessageId` — the chat message ID associated with the request.
* `CorrelationId` — the ID for correlated events across tables.
* `SdkType`, `PlatformType`, `URI`, `CallerIpAddress` — additional context fields documented on the table reference.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Operation Latency Analysis** | [Chat Message Latency](message-latency.md) | Analyze server-side operation duration for chat operations. |
| **Operation Volume by Type** | [Operation Volume](#operation-volume) | Track the volume of chat operations grouped by OperationName over time. |
| **Failure Rate by Operation** | [Failure Rate](#failure-rate) | Identify which chat operations are failing and their HTTP status codes. |

## Query Examples

### Operation Volume
Track the volume of chat operations grouped by `OperationName` over time. This shows which operations (thread creation, message send, participant management, and so on) dominate traffic and how volume shifts.

```kusto
ACSChatIncomingOperations
| where TimeGenerated > ago(24h)
| summarize OperationCount = count() by OperationName, bin(TimeGenerated, 1h)
| render timechart
```

### Failure Rate
Identify chat operations that are returning non-2xx HTTP status codes. `ResultSignature` carries the HTTP status code returned to the caller.

```kusto
ACSChatIncomingOperations
| where TimeGenerated > ago(1h)
| where ResultSignature !startswith "2"
| summarize FailureCount = count() by OperationName, ResultSignature, ResultDescription
| order by FailureCount desc
```

## See Also
* [Chat Message Latency KQL](message-latency.md)
* [Chat Message Delivery Playbook](../../playbooks/chat/message-delivery.md)

## Sources
* [Azure Communication Services chat logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/chat-logs)
* [ACSChatIncomingOperations table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations)
* [Sample KQL queries for ACSChatIncomingOperations](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/acschatincomingoperations)

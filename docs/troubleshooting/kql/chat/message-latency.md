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
    - claim: "ACSChatIncomingOperations exposes DurationMs as an integer column representing the server-side duration of the operation in milliseconds"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
      verified: true
    - claim: "ACSChatIncomingOperations uses ChatThreadId (string) and UserId (string) as the request-scoped identifiers; there is no From or ThreadId column"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
      verified: true
    - claim: "ResultSignature on ACSChatIncomingOperations carries the HTTP status code for REST API calls; success can be filtered as values that start with 2"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations
      verified: true
---

# Chat Message Latency KQL

Analyze server-side operation duration for ACS chat operations using `ACSChatIncomingOperations.DurationMs`, which the service already emits per request.

## Query Description

`ACSChatIncomingOperations` records one row per incoming chat API request. The `DurationMs` column is the server-side duration of the operation in milliseconds — there is no separate start-time column to subtract from `TimeGenerated`. The query below aggregates that duration per chat thread and per calling user for successful requests only.

## KQL Query

```kusto
ACSChatIncomingOperations
| where TimeGenerated > ago(1h)
| where ResultSignature startswith "2"
| summarize
    AverageDurationMs = avg(DurationMs),
    MaxDurationMs = max(DurationMs),
    RequestCount = count()
    by OperationName, ChatThreadId, UserId
| order by MaxDurationMs desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Restricts the scan to the last hour to keep queries cheap and focused on current issues. |
| `ResultSignature startswith "2"` | Keeps only requests that returned an HTTP 2xx status. `ResultSignature` is documented as the sub-status of the operation, which for REST API calls is the HTTP status code. |
| `avg(DurationMs)`, `max(DurationMs)` | Aggregates the server-side operation duration that ACS already emits — no arithmetic against `TimeGenerated` is required. |
| `by OperationName, ChatThreadId, UserId` | Groups by the chat API operation, the thread, and the calling user's ID. `ChatThreadId` and `UserId` are the request-scoped identifiers on this table. |

## Insights

* **Server-side view only**: `DurationMs` measures how long ACS took to process the request. It does not include client-side send latency, network delivery to other participants, or push-notification fan-out. Client-perceived message delivery latency is not observable from this table alone.
* **Compare by operation**: A latency spike scoped to a single `OperationName` (for example `SendChatMessage` vs `ListChatMessages`) points to a specific API path rather than a whole-service regression.
* **Correlate failures**: Filter `ResultSignature !startswith "2"` and inspect `ResultDescription` to see which requests are failing and why.

## See Also
* [Chat KQL Overview](index.md)
* [Chat Message Delivery Playbook](../../playbooks/chat/message-delivery.md)

## Sources
* [Azure Communication Services chat logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/chat-logs)
* [ACSChatIncomingOperations table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acschatincomingoperations)

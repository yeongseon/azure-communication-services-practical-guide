---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/chat-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acschatincomingoperations
---

# Chat Message Latency KQL

Analyze chat message delivery times and identify common performance bottlenecks.

## Query Description

This query retrieves recent chat operations and summarizes the average and maximum server-side duration for each thread and operation.

## KQL Query

```kusto
ACSChatIncomingOperations
| where TimeGenerated > ago(1h)
| where ResultType == "Succeeded"
| summarize
    AverageDurationMs = avg(DurationMs),
    MaxDurationMs = max(DurationMs)
    by ChatThreadId, OperationName
| order by MaxDurationMs desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Filters results to the last hour to focus on current issues and improve performance. |
| `ResultType == "Succeeded"` | Selects only successful chat operations. |
| `summarize AverageDurationMs = avg(DurationMs)` | Calculates average and maximum server-side operation duration. |
| `by ChatThreadId, OperationName` | Groups results by thread and operation. |

## Insights

* **Observed Latency**: Look for average latency greater than 500ms, which may be noticeable to users.
* **Performance Bottlenecks**: High latency for a specific thread or sender may suggest a network or device issue.
* **Volume Analysis**: A high count of messages with latency may suggest a service-level issue or heavy load.

## See Also
* [Chat KQL Overview](index.md)
* [Chat Message Delivery Playbook](../../playbooks/chat/message-delivery.md)

## Sources
* [Chat logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/chat-logs)
* [ACSChatIncomingOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acschatincomingoperations)

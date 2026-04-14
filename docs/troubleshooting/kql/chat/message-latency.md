---
hide: [toc]
content_sources:
  - azure-docs
  - chat-log-analytics
---

# Chat Message Latency KQL

Analyze chat message delivery times and identify common performance bottlenecks.

## Query Description

This query retrieves recent chat message sent events, filters for those with latency, and summarizes the average and maximum latency for each thread and sender.

## KQL Query

```kusto
ACSChatMessageSentEvents
| where TimeGenerated > ago(1h)
| where ResultType == "Succeeded"
| extend Latency = datetime_diff('millisecond', TimeGenerated, StartTime)
| summarize 
    AverageLatency = avg(Latency), 
    MaxLatency = max(Latency) 
    by ThreadId, From
| order by MaxLatency desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Filters results to the last hour to focus on current issues and improve performance. |
| `ResultType == "Succeeded"` | Selects only messages that were successfully sent. |
| `datetime_diff('millisecond', TimeGenerated, StartTime)` | Calculates the latency in milliseconds between the message start and completion times. |
| `summarize AverageLatency = avg(Latency)` | Groups the results and calculates the average and maximum latency for each thread and sender. |
| `by ThreadId, From` | Groups the results by thread ID and sender identity. |

## Insights

* **Observed Latency**: Look for average latency greater than 500ms, which may be noticeable to users.
* **Performance Bottlenecks**: High latency for a specific thread or sender may suggest a network or device issue.
* **Volume Analysis**: A high count of messages with latency may suggest a service-level issue or heavy load.

## See Also
* [Chat KQL Overview](index.md)
* [Chat Message Delivery Playbook](../../playbooks/chat/message-delivery.md)

## Sources
* Azure Chat Diagnostic Log Reference

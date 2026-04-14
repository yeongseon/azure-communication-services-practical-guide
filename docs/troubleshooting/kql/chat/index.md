---
hide: [toc]
content_sources:
  - azure-docs
  - chat-log-analytics
---

# Chat KQL Overview

Analyze chat message delivery performance, error patterns, and latency.

## Log Analytics Tables

* **ACSChatMessageReceivedEvents**: Detailed logs for each chat message received by a user.
* **ACSChatMessageSentEvents**: Detailed logs for each chat message sent by a user.
* **ACSChatThreadCreatedEvents**: Detailed logs for each chat thread created.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Message Latency Analysis** | [Chat Message Latency](message-latency.md) | Find the average and maximum latency for chat messages. |
| **Message Delivery Trends** | [Delivery Trends](#delivery-trends) | Track the volume of chat messages over time. |
| **Thread Creation Volume** | [Thread Volume](#thread-creation-volume) | Track the number of chat threads created per resource. |

## Query Examples

### Delivery Trends
Track the volume of chat messages grouped by time.

```kusto
ACSChatMessageSentEvents
| where TimeGenerated > ago(24h)
| summarize MessageCount = count() by bin(TimeGenerated, 1h)
| render timechart
```

### Thread Creation Volume
Track the number of chat threads created per resource.

```kusto
ACSChatThreadCreatedEvents
| where TimeGenerated > ago(24h)
| summarize ThreadCount = count() by bin(TimeGenerated, 1h)
| render timechart
```

## See Also
* [Chat Message Latency KQL](message-latency.md)
* [Chat Message Delivery Playbook](../../playbooks/chat/message-delivery.md)

## Sources
* Azure Monitor Chat Diagnostic Log Reference

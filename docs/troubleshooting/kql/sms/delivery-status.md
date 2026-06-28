---
content_sources:
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/acssmsincomingoperations
content_validation:
  status: verified
  last_reviewed: 2026-06-29
  reviewer: agent
  core_claims:
    - claim: "Per-recipient SMS delivery outcomes are emitted as ACSSMSIncomingOperations rows with OperationName == 'SMSDeliveryReportsReceived'"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs
      verified: true
    - claim: "Failure is indicated by ResultType == 'Failed' and the diagnostic text is carried in ResultDescription, with the HTTP status in ResultSignature"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations
      verified: true
    - claim: "MessageId joins a delivery report row back to its originating send"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations
      verified: true
---

# SMS Delivery Status KQL

Analyze SMS delivery success rates and identify the most common failure reasons using the canonical ACS diagnostic log table.

## Query Description

This query reads the `ACSSMSIncomingOperations` table, narrows to delivery report rows (`OperationName == "SMSDeliveryReportsReceived"`), keeps only failures (`ResultType == "Failed"`), and summarizes by failure reason.

## KQL Query

```kusto
ACSSMSIncomingOperations
| where TimeGenerated > ago(1h)
| where OperationName == "SMSDeliveryReportsReceived"
| where ResultType == "Failed"
| summarize
    FailureCount = count(),
    SamplePhoneNumber = take_any(PhoneNumber),
    SampleMessageId = take_any(MessageId),
    SampleSignature = take_any(ResultSignature)
    by ResultDescription
| order by FailureCount desc
```

## Explanation

| Field | Description |
| --- | --- |
| `OperationName == "SMSDeliveryReportsReceived"` | Restricts to delivery report callbacks. Other rows in the same table (`SMSMessagesSent`, `SMSMessagesReceived`) are excluded. |
| `TimeGenerated > ago(1h)` | Limits scan to the last hour for performance and recency. |
| `ResultType == "Failed"` | Keeps only failed deliveries. `ResultType` is the documented outcome column; values are `Succeeded` or `Failed`. |
| `summarize FailureCount = count()` | Counts occurrences per failure reason. |
| `by ResultDescription` | Groups by the diagnostic message string carried in `ResultDescription`. |
| `SamplePhoneNumber` | The ACS-owned number associated with the row, taken with `take_any` for a single example. |
| `SampleMessageId` | An example message correlator that joins back to the originating `SMSMessagesSent` row. |
| `SampleSignature` | The HTTP status code carried in `ResultSignature` for the failed delivery report. |

## Insights

* **What the table tells you**: each failed row gives you `ResultType`, `ResultSignature` (HTTP status), and `ResultDescription` (diagnostic message). Group on the columns the table actually emits — not on assumed carrier-specific subcodes.
* **Find originating sends**: pivot from a high-count `ResultDescription` group back to the matching `SMSMessagesSent` rows using `MessageId` to see the request payload metadata (size, country, attempt count).
* **Volume signal**: a sustained spike of failures on a single ACS number plus `ResultSignature == 429` on its `SMSMessagesSent` rows points to throughput throttling rather than per-recipient delivery failure.
* **Do not assume substring matches**: ACS does not document a fixed enumeration of `ResultDescription` strings. Treat them as opaque text — group, sort by `FailureCount`, then investigate the top buckets.

## See Also
* [SMS KQL Overview](index.md)
* [SMS Delivery Failures Playbook](../../playbooks/sms/delivery-failures.md)

## Sources
* [Azure Communication Services SMS logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/sms-logs)
* [ACSSMSIncomingOperations table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acssmsincomingoperations)
* [Sample KQL queries for ACSSMSIncomingOperations](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/queries/acssmsincomingoperations)

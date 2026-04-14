---
hide: [toc]
content_sources:
  - azure-docs
  - sms-log-analytics
---

# SMS Delivery Status KQL

Analyze SMS delivery success rates and identify common failure reasons.

## Query Description

This query retrieves recent SMS delivery reports, filters for failures, and summarizes the most common reasons and destination numbers.

## KQL Query

```kusto
ACSSMSDeliveryReportEvents
| where TimeGenerated > ago(1h)
| where DeliveryStatus == "Failed"
| summarize 
    FailureCount = count(), 
    SampleTo = take_any(To), 
    SampleMessageId = take_any(MessageId) 
    by DeliveryStatusDetails
| order by FailureCount desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Filters results to the last hour to focus on current issues and improve performance. |
| `DeliveryStatus == "Failed"` | Selects only messages that were not successfully delivered. |
| `summarize FailureCount = count()` | Counts the number of occurrences for each failure reason. |
| `by DeliveryStatusDetails` | Groups the results by the specific error message provided by the carrier. |
| `SampleTo, SampleMessageId` | Provides representative examples to help with further investigation and reproduction. |

## Insights

* **Observed Errors**: Look for codes like `400`, `429`, or carrier-specific messages like `OptedOut`.
* **Carrier Filtering**: If the `DeliveryStatusDetails` mentions `Spam` or `Filter`, the message content may need to be adjusted.
* **Volume Analysis**: A high count of `Throttled` errors suggests that the MPS limit for the sender number has been exceeded.

## See Also
* [SMS KQL Overview](index.md)
* [SMS Delivery Failures Playbook](../../playbooks/sms/delivery-failures.md)

## Sources
* Azure SMS Delivery Status Codes Reference

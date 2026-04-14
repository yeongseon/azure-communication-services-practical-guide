---
hide: [toc]
content_sources:
  - azure-docs
  - email-log-analytics
---

# Email Delivery Status KQL

Analyze email delivery performance and identify common bounce reasons.

## Query Description

This query retrieves recent email delivery reports, filters for failures, and summarizes the most common status codes and recipient domains.

## KQL Query

```kusto
ACSEmailDeliveryReportEvents
| where TimeGenerated > ago(1h)
| where Status != "Delivered"
| summarize 
    BounceCount = count(), 
    SampleRecipient = take_any(RecipientEmailAddress), 
    SampleStatusDetails = take_any(StatusDetails) 
    by Status
| order by BounceCount desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Filters results to the last hour to focus on current issues and improve performance. |
| `Status != "Delivered"` | Selects only messages that were not successfully delivered. |
| `summarize BounceCount = count()` | Counts the number of occurrences for each failure status. |
| `by Status` | Groups the results by the specific status code provided by the recipient's mail server. |
| `SampleRecipient, SampleStatusDetails` | Provides representative examples to help with further investigation and reproduction. |

## Insights

* **Observed Errors**: Look for codes like `550`, `554`, or carrier-specific messages like `Spam` or `Filter`.
* **Carrier Filtering**: If the `StatusDetails` mentions `Spam` or `Filter`, the email content or domain reputation may need to be adjusted.
* **Volume Analysis**: A high count of `Throttled` errors suggests that the sending tier for the sender domain has been exceeded.

## See Also
* [Email KQL Overview](index.md)
* [Email Delivery Failures Playbook](../../playbooks/email/delivery-failures.md)

## Sources
* Azure Email Delivery Status Codes Reference

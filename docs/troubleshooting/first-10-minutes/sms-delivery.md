---
content_sources:
  - azure-docs
  - sms-delivery-guide
---

# SMS Delivery Checklist (First 10 Minutes)

When SMS delivery failures occur, follow this checklist to quickly isolate the cause.

## Immediate Checklist

1. **Check Phone Number Status**: Is the number active?
2. **Review Opt-out Lists**: Is the recipient on a suppression or STOP list?
3. **Analyze Message Content**: Does it contain spam keywords or suspicious URLs?
4. **Check Rate Limits**: Are you exceeding your throughput (MPS) limits?
5. **Verify Number Format**: Is the recipient number in correct E.164 format?

## Essential CLI Commands

```bash
# Check phone number status
az communication sms number list --connection-string "<your_connection_string>"

# Get the latest delivery reports for a specific message
# Replace message-id with the actual ID from your logs
az communication sms get-delivery-report --message-id "<message_id>" --connection-string "<your_connection_string>"
```

| Command | Purpose |
|---------|---------|
| `az communication sms number list` | Lists the phone numbers provisioned on the ACS resource. |
| `--connection-string "<your_connection_string>"` | Authenticates the request using the ACS connection string. |
| `az communication sms get-delivery-report` | Retrieves the delivery report for a specific SMS message. |
| `--message-id "<message_id>"` | Identifies the SMS message to report on. |

## Key KQL Queries

Run this in Log Analytics to see recent delivery failures and their reasons:

```kusto
ACSSMSIncomingOperations
| where TimeGenerated > ago(1h)
| where OperationName == "SMSDeliveryReportsReceived"
| where ResultType == "Failed"
| summarize Count = count() by ResultDescription, ResultSignature, PhoneNumber
| order by Count desc
```

## Immediate Triage Questions

* Is the failure happening for all carriers or just one?
* Are you sending international messages from a local number?
* Is your ACS resource in a region that supports the destination?

## See Also
* [SMS Delivery Failures Playbook](../playbooks/sms/delivery-failures.md)
* [SMS Rate Limiting Playbook](../playbooks/sms/rate-limiting.md)

## Sources
* Azure Communication Services SMS Troubleshooting Documentation
* Global SMS Carrier Best Practices

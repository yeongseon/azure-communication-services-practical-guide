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
# List the phone numbers provisioned on the ACS resource
az communication phonenumber list --connection-string "<your_connection_string>"

# Delivery status is not read from the CLI. Request a delivery report when sending,
# then consume the result through Event Grid (SMS Delivery Report event).
az communication sms send --sender "<from_number>" --recipient "<to_number>" --message "test" --deliveryReport --connection-string "<your_connection_string>"
```

| Command | Purpose |
|---------|---------|
| `az communication phonenumber list` | Lists the phone numbers provisioned on the ACS resource. |
| `--connection-string "<your_connection_string>"` | Authenticates the request using the ACS connection string. |
| `az communication sms send` | Sends an SMS, optionally requesting a delivery report. |
| `--deliveryReport` | Enables delivery reporting; the report is delivered via Event Grid, not the CLI. |

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

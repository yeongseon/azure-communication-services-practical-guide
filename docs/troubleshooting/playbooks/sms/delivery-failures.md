---
content_sources:
  - azure-docs
  - sms-troubleshooting
---

# SMS Delivery Failures Playbook

**Symptom**: SMS not delivered to recipient.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Wrong phone format | Number not in E.164 format (e.g., missing `+1`) | [Observed] |
| Recipient opt-out | Recipient is on a STOP list or has previously opted out | [Inferred] |
| Carrier blocking | Content triggered spam filters or suspicious pattern detection | [Correlated] |
| Rate limiting | Exceeding the messages per second (MPS) limit for the number | [Measured] |
| Invalid number | Destination number is disconnected or does not exist | [Observed] |

## Evidence Collection

### 1. Delivery Reports
Query the `ACSSMSIncomingOperations` table in Log Analytics, filtering for `OperationName == "SMSDeliveryReportsReceived"` and inspecting `ResultType`, `ResultSignature`, and `ResultDescription` per row.

### 2. Monitor Metrics
Review the `SMS API Requests` metric in Azure Monitor and split by the `Operation` dimension (`SMSMessageSent` vs `SMSDeliveryReportsReceived`) to compare send volume against delivery report volume. Filter by the `Status Code` dimension (for example `200`, `400`, `429`) or `StatusSubClass` (`2xx`, `4xx`, `5xx`) to separate successful from failed API calls.

### 3. CLI Check
Use the CLI to get the status of a specific message ID.

```bash
az communication sms get-delivery-report --message-id "<id>" --connection-string "<cs>"
```

| Command | Purpose |
|---------|---------|
| `az communication sms get-delivery-report` | Retrieves the delivery report for a specific SMS message. |
| `--message-id "<id>"` | Identifies the SMS message to report on. |
| `--connection-string "<cs>"` | Authenticates the request using the ACS connection string. |

## Validation

### [Observed] Validate Phone Format
Ensure the number starts with `+` followed by the country code. If not, the SDK or service will reject the request with a `400 Bad Request`.

### [Inferred] Check Opt-out Status
Review recipient communication history. If they sent a `STOP` keyword, the carrier will block future messages.

### [Measured] Review MPS Throttling
Check for `429 Too Many Requests` in your app logs. Azure Monitor will show spikes in throttled requests.

## Mitigation

1. **Fix Format**: Normalize all phone numbers to E.164 before sending.
2. **Handle Opt-outs**: Respect STOP keywords and implement a local suppression list.
3. **Optimize Content**: Avoid short-links and suspicious keywords. Use a consistent sender name.
4. **Scale Throughput**: If hitting rate limits, request a higher MPS limit or use a toll-free number.

## See Also
* [SMS Opt-out Handling](opt-out-handling.md)
* [SMS Rate Limiting](rate-limiting.md)

## Sources
* Azure SMS Delivery Report Status Codes
* CTIA Messaging Principles and Best Practices

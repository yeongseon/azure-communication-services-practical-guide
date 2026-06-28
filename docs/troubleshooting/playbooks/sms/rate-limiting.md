---
content_sources:
  - azure-docs
  - sms-rate-limiting-guide
---

# SMS Rate Limiting Playbook

**Symptom**: SMS sending throttled or failing with `429 Too Many Requests`.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Exceeded throughput | The number of messages per second (MPS) for the sender's number was exceeded | [Measured] |
| Burst traffic | A sudden spike in sending volume beyond the burst capacity | [Observed] |
| Wrong tier | Using a free or basic tier with lower throughput than required | [Correlated] |
| Concurrent connections | Too many parallel requests to the ACS endpoint from the client app | [Inferred] |

## Evidence Collection

### 1. Azure Monitor Metrics
Split the `SMS API Requests` metric by the `Operation` dimension (filter to `SMSMessageSent`) and filter by `Status Code` (`429`) to isolate throttled send requests. Per-row evidence lives in Log Analytics: `ACSSMSIncomingOperations | where OperationName == "SMSMessagesSent" and ResultSignature == 429`.

### 2. App Logs
Look for `429 Too Many Requests` in your application logs or HTTP traces.

### 3. CLI Check
Verify current number and its tier.

```bash
az communication sms number list --connection-string "<cs>"
```

## Validation

### [Measured] Monitor Throughput
Count rows in `ACSSMSIncomingOperations` where `OperationName == "SMSMessagesSent"` over a 1-second bin per `PhoneNumber`. If the count exceeds the number's MPS limit (for example 1 MPS for a standard toll-free number), the service will throttle and you will see `ResultSignature == 429` on the affected rows.

### [Observed] Track Burst Traffic
Identify if the `429` errors occur only during high-volume events (e.g., promotional campaigns or mass notifications).

### [Correlated] Review Number Type
A local long code (10DLC) number has lower MPS than a toll-free number or a short code. Match your sending volume to the number's capacity.

## Mitigation

1. **Implement Exponential Backoff**: When a `429` error is received, wait and retry the request after a short delay.
2. **Queuing and Buffering**: Implement a message queue (e.g., Azure Service Bus or RabbitMQ) to smooth out sending spikes and stay within the MPS limit.
3. **Upgrade Number Type**: Move from a local 10DLC number to a toll-free number (up to 3 MPS) or a short code (up to 100+ MPS) if higher throughput is required.
4. **Distribute Traffic**: Use multiple phone numbers (number pooling) to distribute the sending load. Note that this requires Careful coordination to avoid carrier-level filtering.

## See Also
* [SMS Delivery Failures](delivery-failures.md)
* [SMS Opt-out Handling](opt-out-handling.md)

## Sources
* [ACS SMS Service Limits](https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits#sms)
* Handling Throttling and Retries for Azure Services

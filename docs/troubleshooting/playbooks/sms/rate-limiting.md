---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/service-limits
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/sms-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acssmsincomingoperations
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
Check ACS API request metrics filtered to SMS operations and `Status Code` / `StatusSubClass`. For transaction evidence, query `ACSSMSIncomingOperations` for `ResultSignature == "429"` or throttling text in `ResultDescription`.

### 2. App Logs
Look for `429 Too Many Requests` in your application logs or HTTP traces.

### 3. CLI Check
Verify current number and its tier.

```bash
az communication sms number list --connection-string "<cs>"
```

## Validation

### [Measured] Monitor Throughput
Count send operations by `PhoneNumber` and `NumberType` in `ACSSMSIncomingOperations`. Compare the count with the current Microsoft Learn limit for that sender type instead of applying a single generic MPS value.

### [Observed] Track Burst Traffic
Identify if the `429` errors occur only during high-volume events (e.g., promotional campaigns or mass notifications).

### [Correlated] Review Number Type
A local long code (10DLC) number has lower MPS than a toll-free number or a short code. Match your sending volume to the number's capacity.

## Mitigation

1. **Implement Exponential Backoff**: When a `429` error is received, wait and retry the request after a short delay.
2. **Queuing and Buffering**: Implement a message queue (e.g., Azure Service Bus or RabbitMQ) to smooth out sending spikes and stay within the MPS limit.
3. **Upgrade Number Type**: Move to a sender type whose documented throughput matches the workload, or request higher throughput through Azure Support where available.
4. **Distribute Traffic**: Use multiple phone numbers (number pooling) to distribute the sending load. Note that this requires Careful coordination to avoid carrier-level filtering.

## See Also
* [SMS Delivery Failures](delivery-failures.md)
* [SMS Opt-out Handling](opt-out-handling.md)

## Sources
* [ACS service limits](https://learn.microsoft.com/azure/communication-services/concepts/service-limits#sms)
* [SMS logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/sms-logs)
* [ACSSMSIncomingOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acssmsincomingoperations)

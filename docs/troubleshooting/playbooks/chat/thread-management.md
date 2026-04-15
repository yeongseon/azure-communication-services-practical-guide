---
content_sources:
  - communication-services-sdk
  - chat-thread-guide
---

# Thread Management Playbook

**Symptom**: Cannot create or access chat threads.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Participant limit | Exceeded the maximum number of participants for a single chat thread | [Measured] |
| Permission issues | The user's token does not have the required `chat` scope | [Observed] |
| Resource limits | Exceeded the maximum number of chat threads per ACS resource | [Correlated] |
| Concurrency conflict | Multiple requests to update the thread were sent simultaneously | [Inferred] |

## Evidence Collection

### 1. Browser Console
Look for `400 Bad Request` or `403 Forbidden` errors with a specific error code.

### 2. Service Limits
Review the [ACS Chat Service Limits](https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits#chat).

### 3. Log Analytics
Query the `ACSChatThreadCreatedEvents` table.

## Validation

### [Measured] Monitor Participant Count
Verify if the thread has reached the maximum of 250 participants. If exceeded, new participants cannot be added.

### [Observed] Validate Token Scopes
Ensure the identity token was generated with the `chat` scope. Without it, thread creation will fail with `401` or `403`.

### [Correlated] Identify Resource Caps
If you're creating thousands of threads per second, you may hit the service-level throttling limits for ACS.

## Mitigation

1. **Manage Participant List**: Regularly prune inactive participants if the thread size approaches the limit.
2. **Assign Correct Scopes**: Always include the `chat` scope when generating tokens for users.
3. **Handle Throttling**: Implement exponential backoff for thread creation and update requests.
4. **Use Group Chat Wisely**: Avoid creating new threads for the same group of users if an existing thread can be reused.

## See Also
* [Message Delivery](message-delivery.md)
* [Real-time Notifications](real-time-notifications.md)

## Sources
* Azure Communication Services Chat Service Limits
* Chat Architecture and Best Practices

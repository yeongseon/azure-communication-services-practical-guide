---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/chat-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acschatincomingoperations
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Chat Message Delivery Playbook

**Symptom**: Chat messages not arriving at the recipient's device.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Token expired | The user's access token is no longer valid for the session | [Observed] |
| Participant removed | The user was removed from the chat thread and can no longer receive messages | [Measured] |
| Thread deleted | The entire chat thread was deleted by an admin or another participant | [Observed] |
| Network issue | Firewall or local proxy is blocking the WebSocket connection | [Correlated] |
| Missing notifications | The app is not correctly listening for real-time notification events | [Inferred] |

## Evidence Collection

### 1. Browser Console
Look for `401 Unauthorized`, `403 Forbidden`, or `404 Not Found` errors in the developer tools.

### 2. Log Analytics
Query `ACSChatIncomingOperations` for failed chat operations, result signatures, operation names, and thread IDs.

### 3. Identity Verification
Confirm the user's communication identity still exists.

```bash
az communication identity list-tokens --user-id "<user_id>" --connection-string "<cs>"
```

## Validation

### [Observed] Check Token Expiration
Verify if the token was generated more than 24 hours ago. If so, a new token must be requested and provided to the Chat Client.

### [Measured] Validate Thread Membership
Retrieve the list of participants for the thread ID. If the user is not listed, they will not receive notifications for that thread.

### [Correlated] Identify WebSocket Blockage
If the client can send messages but cannot receive them, check if the WebSocket connection to `*.communication.azure.com` is established or interrupted by a firewall.

## Mitigation

1. **Refresh Access Tokens**: Implement a proactive token refresh mechanism in your client app before the token expires.
2. **Handle Membership Events**: Subscribe to thread-level events to update the UI when a user is added or removed.
3. **Check Connection Health**: Use a heartbeat or connection state listener to detect and recover from WebSocket disconnection.
4. **Cleanse Deleted Threads**: Update your local state when a thread is deleted to prevent sending to a non-existent resource.

## See Also
* [Thread Management](thread-management.md)
* [Real-time Notifications](real-time-notifications.md)

## Sources
* [Chat logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/chat-logs)
* [ACSChatIncomingOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acschatincomingoperations)

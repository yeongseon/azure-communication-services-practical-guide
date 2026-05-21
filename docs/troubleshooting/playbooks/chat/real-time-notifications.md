---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/chat-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acschatincomingoperations
---

# Real-time Notifications Playbook

**Symptom**: Real-time notifications not working in the chat app.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| WebSocket blocked | Local firewall or proxy is blocking the WebSocket connection | [Measured] |
| Token scope missing | The user's token does not have the `chat` scope | [Observed] |
| Notification hub misconfigured | The Azure Notification Hub or Firebase configuration is incorrect | [Correlated] |
| SDK not listening | The app has not correctly registered for the `chatMessageReceived` event | [Inferred] |

## Evidence Collection

### 1. Browser Console
Check for `WebSocket` connection failures or `401 Unauthorized` errors.

### 2. Service-to-Service Events
Monitor the `Microsoft.Communication.ChatMessageReceived` events in Event Grid.

### 3. Log Analytics
Query `ACSChatIncomingOperations` and filter by chat message operation names and result status.

## Validation

### [Measured] Test WebSocket Connectivity
Ensure the client can connect to `*.communication.azure.com` over port `443`. If the connection fails, real-time events will not arrive.

### [Observed] Validate Token Scopes
Ensure the identity token was generated with the `chat` scope. Without it, real-time event subscription will fail.

### [Correlated] Identify Hub Misconfiguration
If using push notifications (e.g., via FCM or APNs), verify the ACS resource is correctly linked to the Notification Hub and the credentials are valid.

## Mitigation

1. **Allow WebSocket Traffic**: Ensure that the client's firewall and proxy allow traffic to the required ACS endpoints.
2. **Assign Correct Scopes**: Always include the `chat` scope when generating tokens for users who need real-time notifications.
3. **Register for Events**: Double-check the SDK code to ensure the `startRealtimeNotifications()` method is called and event handlers are registered correctly.
4. **Update Push Config**: Regularly verify and update the FCM/APNs credentials in the linked Notification Hub to prevent notification delivery failures.

## See Also
* [Message Delivery](message-delivery.md)
* [Thread Management](thread-management.md)

## Sources
* [Chat logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/chat-logs)
* [ACSChatIncomingOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acschatincomingoperations)

---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/voice-and-video-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acscallsummary
---

# Call Drops Playbook

**Symptom**: Calls disconnecting unexpectedly.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Network instability | Sudden loss of Wi-Fi or cellular connectivity | [Measured] |
| Token expiry during call | The user's access token expired while the call was active | [Observed] |
| SRTP timeout | Secure Real-time Transport Protocol session timed out | [Correlated] |
| Signaling failure | The WebSocket signaling connection was lost and could not be recovered | [Inferred] |
| Participant removed | An admin or another participant disconnected the user | [Observed] |

## Evidence Collection

### 1. User Facing Diagnostics (UFD)
Look for `no-network`, `call-ended`, or `network-disconnected` events.

### 2. Log Analytics
Query `ACSCallSummary` for `ParticipantEndReason`, `ParticipantEndSubCode`, and `ResultCategory`.

### 3. App Logs
Look for `401 Unauthorized` or `403 Forbidden` errors around the time of the call drop.

## Validation

### [Measured] Monitor Connection State
Check the `CallConnectionState` property in the SDK. If it transition from `Connected` to `Disconnected` without a user action, a drop occurred.

### [Observed] Validate Token Expiration
Verify if the token expired during the call. If so, a new token should have been provided via the `onTokenExpired` event.

### [Correlated] Identify Timeout Errors
Check for specific error codes like `SignalingConnectionLost` or `MediaConnectionLost` in the call summary logs.

## Mitigation

1. **Implement Token Refresh**: Use the `onTokenExpired` event to refresh the token in the background and prevent session termination.
2. **Handle Reconnection**: Implement logic to automatically reconnect if the signaling connection is lost.
3. **Notify User**: Use UFD to inform the user when their network is unstable and the call may be at risk of dropping.
4. **Log End Reasons**: Collect and analyze the `CallEndReason` from the SDK to identify patterns of drops across users and regions.
5. **Optimize Network**: Advise users to use a stable Wi-Fi connection and avoid switching between networks during a call.

## See Also
* [Call Quality](call-quality.md)
* [Connection Failures](oode-quality.md)

## Sources
* [User Facing Diagnostics](https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics)
* [Voice and video call logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/voice-and-video-logs)
* [ACSCallSummary table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acscallsummary)

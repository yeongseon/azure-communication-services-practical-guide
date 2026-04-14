---
hide: [toc]
content_sources:
  - communication-services-sdk
  - teams-interop-guide
---

# Teams Join Failures Playbook

**Symptom**: Cannot join a Teams meeting from an ACS application.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Invalid meeting URL | The provided Teams meeting link is incorrect or expired | [Observed] |
| Admin policy blocking | The Teams admin has disabled external access for meetings | [Measured] |
| Token scope wrong | The user's access token is missing the required scopes | [Observed] |
| Join before start | The user is attempting to join a meeting that has not yet started or has no lobby enabled | [Inferred] |
| Cross-tenant issue | The ACS resource and Teams meeting are in different tenants with no trust established | [Correlated] |

## Evidence Collection

### 1. Browser Console
Look for `400 Bad Request`, `401 Unauthorized`, or `403 Forbidden` errors with a specific Teams-related error code.

### 2. Log Analytics
Query the `ACSTeamsInteroperabilityEvents` table.

### 3. Teams Admin Center
Check for external access and guest policies for the Teams tenant.

## Validation

### [Observed] Validate Meeting URL
Verify that the URL follows the standard Teams format (`https://teams.microsoft.com/l/meetup-join/...`). If incorrect, the ACS SDK will return an `Invalid meeting link` error.

### [Measured] Review Admin Policy
Ensure that "External access" is enabled in the Teams Admin Center. If disabled, external users (like those from ACS) cannot join any meetings.

### [Correlated] Identify Cross-tenant Conflicts
If the ACS and Teams resources are in different tenants, verify that the required trust and policy settings are in place for both organizations.

## Mitigation

1. **Verify Meeting URL**: Double-check the meeting URL before attempting to join from the ACS client.
2. **Enable External Access**: Work with the Teams admin to enable the required external access and guest policies.
3. **Assign Correct Scopes**: Ensure the identity token was generated with the `voip` and `teams` (if applicable) scopes.
4. **Handle Lobby State**: Use the SDK to monitor the lobby state and inform the user if they are waiting for admission.
5. **Check Meeting State**: Ensure the meeting is currently active and hasn't been cancelled or finished.

## See Also
* [Teams Permission Issues](permission-issues.md)
* [Call Quality](../voice-video/call-quality.md)

## Sources
* [ACS Teams Interoperability Documentation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/teams-interop)
* Teams Admin Center External Access Guide

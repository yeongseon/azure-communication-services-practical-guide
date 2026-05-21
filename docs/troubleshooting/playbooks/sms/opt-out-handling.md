---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/sms-logs
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acssmsincomingoperations
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acsoptoutmanagementoperations
---

# SMS Opt-out Handling Playbook

**Symptom**: Recipients not receiving SMS after opting out or in.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Opt-out list stale | App is out of sync with carrier-level suppression list | [Correlated] |
| STOP keyword processing | Carrier-level blocking is active for the recipient | [Measured] |
| Number reassignment | Recipient's phone number was reassigned to a new user | [Inferred] |
| Opt-in logic failure | The user's `START` or `JOIN` keyword was not processed correctly | [Observed] |

## Evidence Collection

### 1. Delivery Reports
Look for failed SMS operation results in `ACSSMSIncomingOperations` and opt-out activity in `ACSOptOutManagementOperations`.

### 2. Event Grid Reports
Check `Microsoft.Communication.SMSReceived` for incoming `STOP`, `UNSUBSCRIBE`, or `START` keywords.

### 3. App Tracking
Review local database of user communication preferences.

## Validation

### [Measured] Monitor Incoming Keywords
Verify that the ACS resource received the `STOP` keyword from the recipient. If it's missing, the app cannot process the opt-out locally.

### [Observed] Validate Delivery Error Details
Check if the delivery report status code is `BlockedByCarrier` or `OptedOut`. These signals confirm carrier-level suppression.

### [Correlated] Review Timing
Match the user's last received `STOP` keyword with subsequent delivery failures to that number.

## Mitigation

1. **Process Opt-out Events**: Subscribe to the `SMSReceived` event and update your user database immediately when a `STOP` keyword arrives.
2. **Handle Opt-in Keywords**: If a user wants to resume, they must send a `START` or `UNSUBSCRIBE` keyword. ACS will automatically handle carrier-level unblocking.
3. **Local Suppression**: Always check your local opt-out database before attempting to send an SMS to prevent wasted requests.
4. **Number Management**: Periodically verify number ownership if delivery failures persist for an extended period.

## See Also
* [SMS Delivery Failures](delivery-failures.md)
* [SMS Rate Limiting](rate-limiting.md)

## Sources
* [SMS logs](https://learn.microsoft.com/azure/communication-services/concepts/analytics/logs/sms-logs)
* [ACSSMSIncomingOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acssmsincomingoperations)
* [ACSOptOutManagementOperations table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acsoptoutmanagementoperations)

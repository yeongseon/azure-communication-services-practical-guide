---
content_sources:
  diagrams:
    - id: sms-optout-hypothesis-flow
      type: flowchart
      source: self-generated
      justification: Visualizes this playbook's hypothesis triage and evidence-collection sequence, synthesized from the playbook content below.
content_validation:
  status: verified
  last_reviewed: 2026-07-25
  reviewer: agent
  core_claims:
    - claim: "ACS SMS supports two-way conversations, which is why SMS operational playbooks must account for user replies and carrier-driven state changes"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/concepts
      verified: true
    - claim: "ACS publishes SMS service guidance and limits by scenario, so opt-out handling has to be designed with channel-specific operational rules rather than generic email assumptions"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
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

<!-- diagram-id: sms-optout-hypothesis-flow -->
```mermaid
flowchart TD
    S["Opt-out handling misbehaving"] --> H1{"Opt-out list stale?"}
    H1 -- yes --> R1["Sync suppression state from delivery reports"]
    H1 -- no --> H2{"STOP keyword processing failing?"}
    H2 -- yes --> R2["Fix incoming keyword handling"]
    H2 -- no --> H3{"Number reassigned by carrier?"}
    H3 -- yes --> R3["Treat recipient as new opt-in required"]
    H3 -- no --> H4{"App opt-in logic wrong?"]
    H4 -- yes --> R4["Fix consent capture in app"]
    H4 -- no --> EV["Collect evidence: delivery reports, Event Grid, app logs"]
    EV --> M["Apply mitigation and verify keyword round-trip"]
```

## Evidence Collection

### 1. Delivery Reports
Filter `ACSSMSIncomingOperations` for `OperationName == "SMSDeliveryReportsReceived"` and inspect `ResultType` (expect `Failed`) and `ResultDescription` for opt-out or blocked indicators on outbound messages to the recipient.

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
* Azure SMS Opt-out and Keywords Documentation
* Carrier Requirements for SMS Marketing

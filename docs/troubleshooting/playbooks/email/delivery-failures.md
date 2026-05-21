---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/email/email-domain-and-sender-authentication
  - https://learn.microsoft.com/azure/communication-services/concepts/service-limits
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acsemailsendmailoperational
  - https://learn.microsoft.com/azure/azure-monitor/reference/tables/acsemailstatusupdateoperational
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Email Delivery Failures Playbook

**Symptom**: Email not delivered or bouncing.

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Domain not verified | Domain is in `Pending` or `Failed` status in Azure Portal | [Observed] |
| SPF/DKIM failure | Email rejected by recipient because it failed authentication checks | [Measured] |
| Recipient invalid | The destination email address does not exist or has a full mailbox | [Observed] |
| Content filtered | Email was blocked due to suspicious content or attachments | [Inferred] |
| Rate limiting | Sending more emails than allowed by the current sender tier | [Correlated] |

## Evidence Collection

### 1. Delivery Reports
Check `ACSEmailStatusUpdateOperational` in Log Analytics for delivery status updates. Use `CorrelationId` to correlate status events with the message ID returned by send requests.

### 2. Monitor Metrics
Review ACS API request metrics by email operation and status dimensions. Delivery and bounce rates should be calculated from `ACSEmailStatusUpdateOperational`, not from undocumented metric names such as `EmailMessagesDelivered`.

### 3. SMTP Status Codes
Look for bounce messages containing standard SMTP status codes (e.g., `550`, `554`).

## Validation

### [Observed] Check Domain Verification
Confirm the domain status is `Verified` in the ACS resource. If it's `Pending`, messages cannot be sent.

### [Measured] Test SPF/DKIM
Use a third-party tool (e.g., Mail-Tester) to send a test email and verify that authentication headers are correct and pass verification.

### [Inferred] Review Spam Logs
Identify whether `FailureReason`, `FailureMessage`, `SmtpStatusCode`, or `EnhancedSmtpStatusCode` in `ACSEmailStatusUpdateOperational` points to spam filtering, mailbox issues, or authentication failures.

## Mitigation

1. **Complete Verification**: Ensure all required DNS records (SPF, DKIM) are correctly added to your DNS provider.
2. **Correct Sender Address**: Use only verified sender addresses that match your domain.
3. **Cleanse Recipient Lists**: Implement an email verification step to remove invalid or inactive addresses.
4. **Follow Best Practices**: Avoid suspicious keywords in the subject line and ensure a valid `Unsubscribe` link is present.
5. **Request Tier Increase**: If consistently hitting rate limits, request a higher sending tier from Azure support.

## See Also
* [Domain Verification](domain-verification.md)
* [Spam Filtering](spam-filtering.md)

## Sources
* [Email domain and sender authentication](https://learn.microsoft.com/azure/communication-services/concepts/email/email-domain-and-sender-authentication)
* [ACS service limits](https://learn.microsoft.com/azure/communication-services/concepts/service-limits)
* [ACSEmailSendMailOperational table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acsemailsendmailoperational)
* [ACSEmailStatusUpdateOperational table](https://learn.microsoft.com/azure/azure-monitor/reference/tables/acsemailstatusupdateoperational)

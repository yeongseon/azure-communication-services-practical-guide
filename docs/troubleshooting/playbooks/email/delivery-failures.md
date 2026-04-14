---
hide: [toc]
content_sources:
  - azure-docs
  - email-delivery-troubleshooting
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
Check the `ACSEmailDeliveryReportEvents` table in Log Analytics.

### 2. Monitor Metrics
Review `EmailMessagesSent` vs `EmailMessagesDelivered` metrics.

### 3. SMTP Status Codes
Look for bounce messages containing standard SMTP status codes (e.g., `550`, `554`).

## Validation

### [Observed] Check Domain Verification
Confirm the domain status is `Verified` in the ACS resource. If it's `Pending`, messages cannot be sent.

### [Measured] Test SPF/DKIM
Use a third-party tool (e.g., Mail-Tester) to send a test email and verify that authentication headers are correct and pass verification.

### [Inferred] Review Spam Logs
Identify if the `StatusDetails` field in `ACSEmailDeliveryReportEvents` mentions `Spam` or `Filter`.

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
* Azure Communication Services Email Status Codes
* Gmail/Outlook Sending Guidelines

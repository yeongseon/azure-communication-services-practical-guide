---
hide: [toc]
content_sources:
  - azure-docs
  - email-delivery-guide
---

# Email Delivery Checklist (First 10 Minutes)

When email delivery fails or domain verification is blocked, follow these initial steps.

## Immediate Checklist

1. **Domain Verification Status**: Is the domain status `Verified` in the Azure Portal?
2. **DNS Record Check**: Are SPF, DKIM, and DMARC records correctly propagated?
3. **Sender Address Validity**: Does the `From` address match the verified domain?
4. **Spam Signals**: Is the email content triggering spam filters?
5. **Rate Limits**: Are you exceeding your sending tier (E.g., 100 emails/minute)?

## Essential CLI Commands

```bash
# Check domain verification status
az communication email domain list --resource-group "<rg>" --email-service-name "<email-service>"

# List all sender usernames for a domain
az communication email domain sender-username list --domain-name "<domain>" --email-service-name "<email-service>"
```

## Key KQL Queries

Run this to see recent email delivery issues:

```kusto
ACSEmailDeliveryReportEvents
| where TimeGenerated > ago(1h)
| where Status != "Delivered"
| summarize Count=count() by Status, RecipientEmailAddress
| order by Count desc
```

## Immediate Triage Questions

* Are you using a free domain like `@outlook.com` or `@gmail.com` as the sender? (Not supported)
* Is this a new domain that needs warming up?
* Are the emails bouncing with a specific SMTP code (e.g., 550)?

## See Also
* [Email Delivery Failures Playbook](../playbooks/email/delivery-failures.md)
* [Domain Verification Playbook](../playbooks/email/domain-verification.md)

## Sources
* Azure Communication Services Email Troubleshooting Documentation
* Email Deliverability Best Practices

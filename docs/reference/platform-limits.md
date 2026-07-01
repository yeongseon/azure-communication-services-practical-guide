---
content_sources:
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/sms-faq
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-quota-increase
content_validation:
  status: verified
  last_reviewed: 2026-07-01
  reviewer: agent
  core_claims:
    - claim: "ACS SMS rate limits are documented per 60-second timeframe: toll-free 200 per number, short code 6,000 per number, alphanumeric sender ID 600 per resource"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
    - claim: "ACS Email rate limits are per subscription and differ by domain type: custom domains allow 30 emails per minute and 100 emails per hour (upgradable via support), while Azure managed domains allow 5 emails per minute and 10 emails per hour (not upgradable)"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
    - claim: "ACS Email total email request size (including attachments) is 10 MB, and up to 30 MB is available via support request"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
    - claim: "ACS Chat threads support up to 250 participants and messages up to 28 KB"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
    - claim: "ACS group calls support up to 350 participants; PSTN outbound concurrent calls default to 2 per number and can be increased via support"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
    - claim: "For most ACS APIs, exceeding a documented rate limit returns HTTP status code 429 (Too Many Requests); Job Router surfaces ThrottleLimitExceededException"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
---

# Platform Limits for ACS

Reference summary of Azure Communication Services service limits, extracted from the Microsoft Learn [service limits](https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits) page. Some tables explicitly mark whether higher limits are available; other sections describe support-based increases in prose. Use the linked Microsoft Learn page as the final authority for whether a specific limit is soft or hard.

## SMS

### Rate limits

SMS rate limits are documented per 60-second timeframe (not per second).

| Number type | Scope | Timeframe (seconds) | Limit (requests) | Message units per minute |
| --- | --- | --- | --- | --- |
| Toll-free | Per number | 60 | 200 | 200 |
| Short code | Per number | 60 | 6,000 | 6,000 |
| Alphanumeric sender ID | Per resource | 60 | 600 | 600 |

Higher limits are available through Azure Support.

### Character limits per SMS segment

| Encoding | When it's used | Maximum characters in a single segment |
| --- | --- | --- |
| GSM-7 | Text (GSM standard character set) | 160 |
| UCS-2 | Unicode (emoji or international languages) | 70 |

Single SMS message payload is 140 bytes at the carrier layer; the character maximum depends on the encoding above.

### Toll-free verification limits

As of January 31, 2024, only fully verified toll-free numbers can send traffic. All traffic from unverified or pending-verification toll-free numbers to US and Canadian phone numbers is blocked. See the [SMS FAQ](https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/sms-faq#what-happens-if-i-dont-verify-my-toll-free-numbers) for the current enforcement table.

## Email

### Rate limits — Custom Domains (per subscription)

| Operation | Timeframe (minutes) | Limit (number of emails) | Higher limits available |
| --- | --- | --- | --- |
| Send Email | 1 | 30 | Yes |
| Send Email | 60 | 100 | Yes |
| Get Email Status | 1 | 60 | Yes |
| Get Email Status | 60 | 200 | Yes |

### Rate limits — Azure Managed Domains (per subscription)

Azure Managed Domains are intended for testing. These limits **cannot** be increased.

| Operation | Timeframe (minutes) | Limit (number of emails) | Higher limits available |
| --- | --- | --- | --- |
| Send Email | 1 | 5 | No |
| Send Email | 60 | 10 | No |
| Get Email Status | 1 | 10 | No |
| Get Email Status | 60 | 20 | No |

### Size limits

| Name | Limit |
| --- | --- |
| Number of recipients in email (To/Cc/Bcc combined) | 50 |
| Total email request size (including attachments) | 10 MB |
| Maximum authenticated connections per subscription | 250 |

Attachment size up to 30 MB and recipient counts above 50 are available via Azure Support. For attachments larger than 30 MB, store the file in Azure Blob Storage and include a SAS link in the email body.

Base64 encoding inflates message size by about 33%, so a nominal 10 MB request accommodates roughly 7.5 MB of pre-encoded content.

### Resource limits

| Name | Limit |
| --- | --- |
| SenderUsername / Mailfrom resource per domain | 100 |
| Domains linked to a Communication Service resource | 100 |

## Chat

### Size limits

| Name | Limit |
| --- | --- |
| Participants per thread | 250 |
| Batch size: `CreateThread` | 200 |
| Batch size: `AddParticipant` | 200 |
| Page size: `ListMessages` | 200 |
| Message size | 28 KB |
| Azure Communication Services resources per Azure Bot Service | 1,000 |

### Rate limits (excerpt)

Chat rate limits are documented per operation and per scope. The most common ones:

| Operation | Scope | Limit per 10 seconds | Limit per minute |
| --- | --- | --- | --- |
| Create chat thread | Per user | 10 | — |
| Create chat thread | Per resource | — | 3,000 |
| Send / Update / Delete message | Per chat thread | 10 | 30 |
| Add / remove participants | Per chat thread | 10 | 30 |
| Add participants | Per resource | — | 3,000 |
| List chat messages | Per user, per chat thread | 50 | 200 |
| List chat messages | Per chat thread | 250 | 400 |
| Send read receipt | Per user, per chat thread | 10 | 30 |
| Send typing indicator | Per user, per chat thread | 5 | 15 |

See the [service limits page](https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits#chat) for the complete table.

Read receipts and typing indicators aren't supported on chat threads with more than 20 participants.

### Chat storage

Retention policy is set at thread creation and supports either indefinite retention or automatic deletion between 30 and 90 days.

## Voice and video calling

### Call limits

| Name | Scope | Limit |
| --- | --- | --- |
| Participants per group call | Per call | 350 |
| PSTN outbound concurrent calls (default) | Per number | 2 |

There are no limits on inbound PSTN concurrent calls. The outbound concurrent call limit can be increased via Azure Support after vetting.

### Calling SDK — simultaneous streams

| Limit | Web | Windows / Android / iOS |
| --- | --- | --- |
| Outgoing local streams | One video OR one screen sharing | One video + one screen sharing |
| Incoming remote streams | Nine videos + one screen sharing | Nine videos + one screen sharing |

The Calling SDK doesn't hard-enforce these numbers; exceeding them may cause performance degradation.

### Calling SDK timeouts

| Action | Timeout (seconds) |
| --- | --- |
| Reconnect or remove a participant | 120 |
| Add or remove new modality (start / stop video or screen sharing) | 40 |
| Call transfer operation | 60 |
| 1:1 call establishment | 85 |
| Group call establishment | 85 |
| PSTN call establishment | 115 |
| Promote a 1:1 call to a group call | 115 |

### Virtual Rooms (grouped by resource id)

| API | Threshold |
| --- | --- |
| Create Room | 20 req/sec |
| Update Room | 20 req/sec |
| Delete Room | 20 req/sec |
| Get Room | 40 req/sec |
| List Rooms | 10 req/sec |
| Update participant | 20 req/sec |
| List participants | 40 req/sec |

## Identity (per resource)

| Operation | Timeframe (seconds) | Limit (number of requests) |
| --- | --- | --- |
| Create identity | 30 | 1,000 |
| Delete identity | 30 | 500 |
| Issue access token | 30 | 1,000 |
| Revoke access token | 30 | 500 |
| `createUserAndToken` | 30 | 1,000 |
| `exchangeTokens` | 30 | 500 |

Microsoft Learn recommends acquiring identities and tokens up front (for example, on page load) rather than at the moment they're needed.

## Phone number acquisition

| Operation | Scope | Timeframe | Limit (number of requests) |
| --- | --- | --- | --- |
| Purchase phone number | Azure tenant | — | 1 |
| Search for phone numbers | Azure tenant | One week | 5 |

Higher purchase limits are available via Azure Support.

## Job Router

Job Router surfaces throttling as `ThrottleLimitExceededException` rather than HTTP 429.

| Operation | Scope | Timeframe (seconds) | Limit (number of requests) | Timeout (seconds) |
| --- | --- | --- | --- | --- |
| General requests | Per resource | 10 | 3,000 | 5 |
| Get Jobs | Per resource | 10 | 332 | 5 |
| Get Queue Statistics | Per resource | 10 | 166 | 5 |
| Get In-Queue Position | Per resource | 10 | 166 | 5 |
| Get Workers | Per resource | 10 | 332 | 5 |

For higher throughput, contact `acs-ccap@microsoft.com`.

## Throttling behavior

When a client exceeds a documented rate limit, most ACS APIs return HTTP status code **429 (Too Many Requests)** (Job Router is an exception — see the [Job Router](#job-router) section above). Microsoft Learn recommends:

- Reduce the number of operations per request.
- Reduce the frequency of calls.
- Avoid immediate retries, because all requests accrue against your usage limits.

For Microsoft Graph interoperability (Teams Interop scenarios), use the `Retry-After` response header from the 429 response to back off requests. See the [Microsoft Graph throttling documentation](https://learn.microsoft.com/en-us/graph/throttling) for Graph-specific behavior.

## Requesting a quota increase

For channels marked "Higher limits available: Yes" and for other soft caps, follow the general Azure quota request flow:

1. Open the [Azure portal](https://ms.portal.azure.com/).
2. Select **Help + Support** → **Create new support request**.
3. In the **Describe your issue** text box, enter **Technical**, then select **Go**.
4. Select service **Service and Subscription Limits (Quotas)** → **Next**.
5. Choose the **Issue type**, **Subscription**, and **Quota type**.
6. Complete the remaining tabs and submit.

For **email quota increases** specifically, use the dedicated [Quota increase for email domains](https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-quota-increase) process. Note that higher email limits require a verified custom domain — Azure Managed Domain limits cannot be increased. Email quota approval may take up to 72 hours, and requests submitted late Friday can be delayed.

## See Also

- [Best Practices — Scaling](../best-practices/scaling.md)
- [Best Practices — Reliability](../best-practices/reliability.md)
- [SMS Rate Limiting Playbook](../troubleshooting/playbooks/sms/rate-limiting.md)
- [Reference — KQL Queries](kql-queries.md)

## Sources

- [Service limits for Azure Communication Services](https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits)
- [SMS FAQ — Character and rate limits](https://learn.microsoft.com/en-us/azure/communication-services/concepts/sms/sms-faq#character-and-rate-limits)
- [Quota increase for email domains](https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-quota-increase)
- [How to create an Azure support request](https://learn.microsoft.com/en-us/azure/azure-portal/supportability/how-to-create-azure-support-request)

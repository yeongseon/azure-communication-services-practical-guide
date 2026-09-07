---
content_sources:
  diagrams:
    - id: anti-pattern-decision
      type: flowchart
      source: mslearn-adapted
      mslearn_url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/best-practices
content_validation:
  status: verified
  last_reviewed: 2026-07-25
  reviewer: agent
  core_claims:
    - claim: "ACS authentication guidance treats access keys and connection strings as secrets that must be protected on trusted servers rather than embedded in clients or source code"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/authentication
      verified: true
    - claim: "ACS best-practices guidance tells production workloads to plan for documented service limits and operational constraints instead of discovering them in production"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/best-practices
      verified: true
---

# Common Anti-Patterns

Anti-patterns are common mistakes that can lead to security vulnerabilities, performance issues, and increased costs in Azure Communication Services (ACS). This document identifies these anti-patterns and provides guidance on how to avoid them.

## Storing Connection Strings in Code

One of the most common and dangerous anti-patterns is hardcoding ACS connection strings directly into your application's source code.

*   **Risk**: If your code is leaked or committed to a public repository, anyone with access can control your ACS resource.
*   **Fix**: Use **Azure Key Vault** to store your connection string and access it using a **Managed Identity** for your backend service.

## Not Implementing Token Refresh

Failing to implement token refresh logic in your client applications can lead to service interruptions for your users.

*   **Risk**: Once an access token expires (default 24 hours), the client application will lose connection to ACS.
*   **Fix**: Monitor the token expiration time and proactively request a new token from your backend before the current one expires.

## Ignoring SMS Opt-Out Requirements

Sending SMS messages to users who have opted out is not only poor practice but also a violation of regulations in many countries.

*   **Risk**: Your phone number may be blocked by carriers, and your business could face legal penalties.
*   **Fix**: Always implement and respect opt-out logic (e.g., "Reply STOP to unsubscribe") and maintain a suppression list of users who have opted out.

## Not Verifying Email Domains Properly

Sending emails from unverified or improperly configured domains can lead to low deliverability.

*   **Risk**: Your emails are more likely to be flagged as spam by mailbox providers.
*   **Fix**: Verify your custom domain via DNS and configure **SPF** and **DKIM** to ensure high deliverability and sender authenticity.

## Polling Instead of Using Event Grid

Polling the ACS API to check for new messages or status changes is inefficient and can lead to rate limiting.

*   **Risk**: Increased latency, higher resource usage, and potential 429 (Too Many Requests) errors.
*   **Fix**: Use **Azure Event Grid** to receive real-time notifications of events (e.g., incoming SMS, call status changes) directly at your webhook endpoint.

<!-- diagram-id: anti-pattern-decision -->
```mermaid
graph TD
    A[Requirement: Check Call Status] --> B{Poll or Event?}
    B -- Poll API --> C[Anti-Pattern: High RPS/Latency]
    B -- Use Event Grid --> D[Best Practice: Real-time/Efficient]
    C --> E[Risk: 429 Rate Limits]
    D --> F[Result: Low Latency/Reliable]
```

## Not Handling Rate Limits Gracefully

Many developers fail to implement proper retry logic and backoff strategies for ACS API calls.

*   **Risk**: Transient errors and rate limits can cause your application to fail.
*   **Fix**: Use **exponential backoff** and respect the `Retry-After` header when you receive a 429 error from the ACS API.

## Hardcoding Phone Numbers

Hardcoding phone numbers in your application code or configuration files can make it difficult to manage and scale your communication services.

*   **Risk**: Changing a phone number requires a code deployment, and managing multiple numbers for different campaigns becomes cumbersome.
*   **Fix**: Store and manage phone numbers in a database or external configuration service, allowing your application to dynamically retrieve the correct number based on the use case.

## Why This Matters

Each anti-pattern above maps to a concrete production risk: a leaked connection string hands over full control of your resource, missing token refresh drops live sessions, and ignoring opt-out rules gets your numbers blocked by carriers. Avoiding these patterns is cheaper than remediating the incident they cause.

## Recommended Practices

- Store connection strings in **Azure Key Vault** and authenticate backend services with **managed identity** instead of embedding secrets.
- Proactively refresh user access tokens from the backend before they expire.
- Implement and honor SMS opt-out ("Reply STOP"), and keep a suppression list.
- Verify custom email domains and configure **SPF** and **DKIM** for deliverability.
- Subscribe to **Azure Event Grid** for status changes instead of polling the API.
- Apply **exponential backoff** and respect `Retry-After` on 429 responses.
- Externalize phone numbers into configuration or a database rather than hardcoding them.

## Common Mistakes / Anti-Patterns

The sections above enumerate the seven anti-patterns this guide flags most often: hardcoded connection strings, missing token refresh, ignored SMS opt-out, unverified email domains, polling instead of Event Grid, ungraceful rate-limit handling, and hardcoded phone numbers. Treat each as a review checkpoint before go-live.

## Validation Checklist

- [ ] No connection strings or access keys appear in source, config, or client code.
- [ ] Client apps refresh access tokens before expiry.
- [ ] SMS opt-out handling and a suppression list are in place.
- [ ] Email domains are verified with SPF and DKIM configured.
- [ ] Status changes are consumed via Event Grid, not polling.
- [ ] API callers apply exponential backoff and honor `Retry-After`.
- [ ] Phone numbers are managed through configuration, not hardcoded.

## See Also

- [Security Best Practices](security.md)
- [Reliability Best Practices](reliability.md)
- [Production Baseline](production-baseline.md)

## Sources

*   [ACS Service Limits](https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits)
*   [ACS Authentication Concepts](https://learn.microsoft.com/en-us/azure/communication-services/concepts/authentication)
*   [Azure Well-Architected Framework: Anti-Patterns](https://learn.microsoft.com/en-us/azure/architecture/antipatterns/)

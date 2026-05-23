---
title: JavaScript SDK Tutorial
description: Learn to build communication features with Azure Communication Services
  for JavaScript.
content_sources:
- https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=azure-portal&pivots=platform-azp
validation:
  az_cli:
    last_tested: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
content_validation:
  status: verified
  last_reviewed: '2026-05-23'
  reviewer: agent
  core_claims:
  - claim: This page uses Microsoft Learn as the primary source basis for its Azure-specific
      guidance.
    source: https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=azure-portal&pivots=platform-azp
    verified: true
---
# JavaScript SDK Tutorial

This tutorial provides a step-by-step guide to building communication features with Azure Communication Services (ACS) for JavaScript.

## What You'll Build

By the end of this tutorial, you'll have a JavaScript application capable of:
- Managing user identities and access tokens.
- Sending SMS and email notifications.
- Creating real-time chat threads.
- Building browser-based video calling experiences.
- Monitoring ACS operations.

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [An Azure Subscription](https://azure.microsoft.com/free/)
- [Visual Studio Code](https://code.visualstudio.com/) or another IDE.

## Tutorial Learning Path

The following path guides you through setting up and using ACS features.

<!-- diagram-id: javascript-tutorial-path -->
```mermaid
graph TD
    Step1[1. Local Setup] --> Step2[2. Send SMS]
    Step2 --> Step3[3. Send Email]
    Step3 --> Step4[4. Real-time Chat]
    Step4 --> Step5[5. Video Calling]
    Step5 --> Step6[6. Monitoring]
    Step6 --> Step7[7. Infrastructure as Code]
```

## Tutorial Steps

| Step | Topic | Description |
| --- | --- | --- |
| **01** | [Local Setup](./01-local-setup.md) | Install SDKs, configure environment variables, and verify with identity token creation. |
| **02** | [Send SMS](./02-send-sms.md) | Use the `SmsClient` to send messages and handle delivery reports. |
| **03** | [Send Email](./03-send-email.md) | Configure an `EmailClient` to send simple and HTML-formatted emails. |
| **04** | [Real-time Chat](./04-chat.md) | Build a chat system with threads, participants, and real-time messaging. |
| **05** | [Video Calling](./05-video-calling.md) | Build a browser-based video calling experience with media streams and UI components. |
| **06** | [Monitoring](./06-logging-monitoring.md) | Configure logging and use KQL queries to monitor your ACS resource. |
| **07** | [Infrastructure as Code](./07-infrastructure-as-code.md) | Deploy ACS resources using Bicep templates and Python scripts. |

## See Also

- [Guide home](../../../index.md)
- [Start here](../../../start-here/overview.md)

## Sources
- [ACS JavaScript SDK Documentation](https://learn.microsoft.com/en-us/javascript/api/overview/azure/communication?view=azure-node-latest)

---
title: .NET SDK Tutorial
description: Step-by-step guide to building communication features with .NET.
content_sources:
  - id: dotnet-tutorial-overview
    type: documentation
    source: self
    justification: Overview of the .NET tutorial path.
    based_on: https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource
validation:
  az_cli:
    last_tested: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
---

# .NET SDK Tutorial

This tutorial series walks you through building a comprehensive communication application using the Azure Communication Services .NET SDK.

## What You'll Build

You will create a C# console application that can:
- Generate identity tokens for users.
- Send SMS and Email notifications.
- Manage real-time Chat threads.
- Automate voice calls with DTMF recognition.
- Deploy and monitor the solution.

## Prerequisites

- .NET 6.0 SDK or higher.
- An Azure account with an active subscription.

## Tutorial Steps

| Step | Focus | Description |
| --- | --- | --- |
| [01. Local Setup](./01-local-setup.md) | **Infrastructure** | Project creation, NuGet dependencies, and identity verification. |
| [02. Send SMS](./02-send-sms.md) | **Messaging** | Sending messages and handling delivery options. |
| [03. Send Email](./03-send-email.md) | **Messaging** | Sending HTML emails with attachments and tracking status. |
| [04. Chat](./04-chat.md) | **Real-time** | Thread management, participants, and SignalR integration concepts. |
| [05. Voice Calling](./05-voice-calling.md) | **Telephony** | Call invites, playing audio, and DTMF recognition. |
| [06. Logging & Monitoring](./06-logging-monitoring.md) | **Operations** | ILogger integration and Application Insights. |
| [07. Infrastructure as Code](./07-infrastructure-as-code.md) | **DevOps** | Bicep templates and CI/CD with GitHub Actions. |

## Learning Path

<!-- diagram-id: dotnet-tutorial-path -->
```mermaid
graph TD
    Start[Local Setup] --> Messaging[SMS & Email]
    Messaging --> RealTime[Chat & Voice]
    RealTime --> Operations[Logging & Monitoring]
    Operations --> DevOps[IaC & CI/CD]
```

## Sources
- [Azure Communication Services Documentation](https://learn.microsoft.com/azure/communication-services/)

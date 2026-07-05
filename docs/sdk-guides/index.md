---
title: SDK Guides Overview
description: Comprehensive documentation for Azure Communication Services SDKs across multiple languages.
content_sources:
  diagrams:
    - id: sdk-architecture
      type: flowchart
      source: mslearn-adapted
      mslearn_url: https://learn.microsoft.com/azure/communication-services/overview
      based_on: High-level ACS SDK architecture across supported languages
---

# SDK Guides Overview

Azure Communication Services (ACS) provides SDKs for multiple platforms, enabling developers to integrate communication features into their applications. This guide covers common scenarios and best practices for Python and JavaScript.

## Supported Features by SDK

The table below provides a high-level overview of feature support across the primary SDKs.

| Feature | Python | JavaScript | Java | .NET |
| --- | --- | --- | --- | --- |
| **Identity** | ✅ | ✅ | ✅ | ✅ |
| **SMS** | ✅ | ✅ | ✅ | ✅ |
| **Email** | ✅ | ✅ | ✅ | ✅ |
| **Chat** | ✅ | ✅ | ✅ | ✅ |
| **Calling (Client)** | ❌ | ✅ | ✅ | ✅ |
| **Calling (Automation)** | ✅ | ✅ | ✅ | ✅ |
| **Phone Numbers** | ✅ | ✅ | ✅ | ✅ |
| **Teams Interop** | ✅ | ✅ | ✅ | ✅ |

## SDK Architecture

ACS SDKs follow a consistent architectural pattern across languages, separating management (Identity, Numbers) from communication (Chat, SMS, Email, Calling).

<!-- diagram-id: sdk-architecture -->
```mermaid
graph TD
    Client[Client Application] --> IdentityClient[Identity SDK]
    Client --> CommSDKs[Communication SDKs]
    
    subgraph CommSDKs
        SMS[SMS SDK]
        Email[Email SDK]
        Chat[Chat SDK]
        Calling[Calling SDK]
    end
    
    IdentityClient --> ACS[Azure Communication Services]
    SMS --> ACS
    Email --> ACS
    Chat --> ACS
    Calling --> ACS
```

## Available Guides

Choose your preferred language to get started with tutorials and code recipes.

- **[Python SDK Guide](./python/index.md)**: Server-side automation and integrations.
- **[JavaScript SDK Guide](./javascript/index.md)**: Web-based client applications and server-side logic.

## See Also
- [Azure Communication Services SDK Overview](https://learn.microsoft.com/azure/communication-services/concepts/sdk-options)
- [SDK Release Notes](https://learn.microsoft.com/azure/communication-services/concepts/release-notes)

## Sources
- [Azure Communication Services Documentation](https://learn.microsoft.com/azure/communication-services/)

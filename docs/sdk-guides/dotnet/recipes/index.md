---
title: .NET Recipes
description: Practical code snippets for Azure Communication Services with .NET.
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
content_sources:
  sources:
  - type: mslearn-adapted
    url: https://learn.microsoft.com/en-us/azure/communication-services/overview
  diagrams:
  - id: index-page-flow
    type: flowchart
    source: self-generated
    justification: Synthesized from the page structure and Microsoft Learn sources
      listed in this document.
    based_on:
    - https://learn.microsoft.com/en-us/azure/communication-services/overview
---
# .NET Recipes

A collection of focused code snippets for specific Azure Communication Services scenarios.

| Recipe | Description |
| --- | --- |
| [Managed Identity](./managed-identity.md) | Authenticate using `DefaultAzureCredential`. |
| [Key Vault Reference](./key-vault-reference.md) | Retrieve connection strings securely. |
| [Event Grid Webhooks](./event-grid-webhooks.md) | Handle ACS events with ASP.NET Core. |
| [Phone Number Management](./phone-number-management.md) | Search and purchase numbers programmatically. |
| [Teams Interop](./teams-interop.md) | Integrate with Microsoft Teams meetings. |

## Page Flow

<!-- diagram-id: index-page-flow -->
```mermaid
flowchart TD
    A[".NET Recipes"]
    B["Review source basis"]
    C["Apply guidance"]
    D["Validate outcome"]
    A --> B
    B --> C
    C --> D
```

## See Also

- [Guide home](../../../index.md)
- [Start here](../../../start-here/overview.md)

## Sources

- [Microsoft Learn source 1](https://learn.microsoft.com/en-us/azure/communication-services/overview)

---
title: JavaScript SDK Recipes
description: Focused code recipes for Azure Communication Services with JavaScript.
content_sources:
  sources:
  - type: mslearn-adapted
    url: https://learn.microsoft.com/en-us/javascript/api/overview/azure/communication?view=azure-node-latest
  diagrams:
  - id: index-page-flow
    type: flowchart
    source: self-generated
    justification: Synthesized from the page structure and Microsoft Learn sources
      listed in this document.
    based_on:
    - https://learn.microsoft.com/en-us/javascript/api/overview/azure/communication?view=azure-node-latest
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---
# JavaScript SDK Recipes

This section contains focused code recipes for specific Azure Communication Services (ACS) tasks.

## Recipe Catalog

| Recipe | When to Use |
| --- | --- |
| **[Managed Identity](./managed-identity.md)** | Authenticating with ACS using Azure Managed Identities instead of connection strings. |
| **[Key Vault Reference](./key-vault-reference.md)** | Storing and retrieving ACS connection strings securely from Azure Key Vault. |
| **[Event Grid Webhooks](./event-grid-webhooks.md)** | Handling ACS events (SMS received, Email delivered) using Express or Fastify. |
| **[Phone Number Management](./phone-number-management.md)** | Searching, purchasing, and releasing ACS phone numbers. |
| **[Email with Attachments](./email-with-attachments.md)** | Sending emails with multiple file attachments and handling size limits. |
| **[Calling UI Composite](./calling-ui-composite.md)** | Adding comprehensive video calling UI with minimal code using the ACS UI Library. |
| **[Teams Interop](./teams-interop.md)** | Joining Microsoft Teams meetings from a browser application. |

## Quick Link: Managed Identity

```javascript
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = "https://<your-acs-resource-name>.communication.azure.com";
const client = new CommunicationIdentityClient(endpoint, new DefaultAzureCredential());
```

## Page Flow

<!-- diagram-id: index-page-flow -->
```mermaid
flowchart TD
    A["JavaScript SDK Recipes"]
    B["Recipe Catalog"]
    C["Quick Link: Managed Identity"]
    A --> B
    B --> C
```

## See Also
- [JavaScript SDK Reference](https://learn.microsoft.com/en-us/javascript/api/overview/azure/communication?view=azure-node-latest)
- [ACS Documentation](https://learn.microsoft.com/azure/communication-services/)

## Sources
- [Azure Communication Services SDK Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/communication)

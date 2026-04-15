---
title: JavaScript SDK Recipes
description: Focused code recipes for Azure Communication Services with JavaScript.
content_sources:
  - https://learn.microsoft.com/javascript/api/overview/azure/communication-services
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

## See Also
- [JavaScript SDK Reference](https://learn.microsoft.com/javascript/api/overview/azure/communication-services)
- [ACS Documentation](https://learn.microsoft.com/azure/communication-services/)

## Sources
- [Azure Communication Services SDK Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/communication)

---
title: Managed Identity Authentication
description: Authenticating Azure Communication Services with JavaScript using Managed Identities.
hide:
  - toc
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/authentication?pivots=programming-language-javascript
---

# Managed Identity Authentication

This recipe demonstrates how to authenticate with Azure Communication Services (ACS) using Azure Managed Identities with the JavaScript SDK.

## Prerequisites

- [Azure Managed Identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) enabled on your compute resource.
- Appropriate RBAC roles assigned (e.g., **Cognitive Services User**).

## DefaultAzureCredential with ACS

The `@azure/identity` package provides the `DefaultAzureCredential` class.

```bash
npm install @azure/identity
```

### System-Assigned Managed Identity

```javascript
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const { DefaultAzureCredential } = require("@azure/identity");

// Get the endpoint from an environment variable
const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;

// Initialize the client
const client = new CommunicationIdentityClient(endpoint, new DefaultAzureCredential());

async function main() {
  const user = await client.createUser();
  console.log(`Created user with managed identity: ${user.communicationUserId}`);
}

main();
```

### User-Assigned Managed Identity

```javascript
const { CommunicationIdentityClient } = require("@azure/communication-identity");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;
const userAssignedClientId = "<your-user-assigned-identity-client-id>";

// Specify the user-assigned identity client ID
const credential = new DefaultAzureCredential({
  managedIdentityClientId: userAssignedClientId
});

const client = new CommunicationIdentityClient(endpoint, credential);
```

## Client Examples

### SMS Client

```javascript
const { SmsClient } = require("@azure/communication-sms");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;
const smsClient = new SmsClient(endpoint, new DefaultAzureCredential());
```

### Email Client

```javascript
const { EmailClient } = require("@azure/communication-email");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;
const emailClient = new EmailClient(endpoint, new DefaultAzureCredential());
```

## See Also
- [RBAC for ACS](https://learn.microsoft.com/azure/communication-services/concepts/authentication#role-based-access-control)
- [Managed Identities for Azure Resources](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

## Sources
- [Authenticate to Azure Communication Services with Managed Identities](https://learn.microsoft.com/azure/communication-services/concepts/authentication?pivots=programming-language-javascript)

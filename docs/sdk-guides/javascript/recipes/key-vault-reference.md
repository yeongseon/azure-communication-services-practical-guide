---
title: Key Vault Reference
description: Securing Azure Communication Services connection strings with Key Vault
  and JavaScript.
content_sources:
  sources:
  - type: mslearn-adapted
    url: https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-cli
  diagrams:
  - id: key-vault-reference-page-flow
    type: flowchart
    source: self-generated
    justification: Synthesized from the page structure and Microsoft Learn sources
      listed in this document.
    based_on:
    - https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-cli
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---
# Key Vault Reference

This recipe shows how to securely store and retrieve Azure Communication Services (ACS) connection strings from Azure Key Vault using JavaScript.

## Prerequisites

- [Azure Key Vault](https://learn.microsoft.com/azure/key-vault/general/overview) resource.
- [ACS Resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- [Managed Identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) enabled and configured with access to Key Vault secrets.

## SDK Installation

```bash
npm install @azure/identity @azure/keyvault-secrets
```

## Store Connection String in Key Vault

```bash
# Store the connection string as a secret
az keyvault secret set --vault-name <your-vault-name> --name "AcsConnectionString" --value "<your-acs-connection-string>"
```

## Access from Node.js App

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const { CommunicationIdentityClient } = require("@azure/communication-identity");

// Key Vault name and secret name
const vaultName = process.env.KEY_VAULT_NAME;
const secretName = "AcsConnectionString";

// Vault URL
const vaultUrl = `https://${vaultName}.vault.azure.net`;

async function main() {
  // Initialize SecretClient with DefaultAzureCredential
  const credential = new DefaultAzureCredential();
  const secretClient = new SecretClient(vaultUrl, credential);

  // Retrieve secret
  const retrievedSecret = await secretClient.getSecret(secretName);
  const connectionString = retrievedSecret.value;

  // Initialize ACS client with retrieved connection string
  const acsClient = new CommunicationIdentityClient(connectionString);

  // Perform ACS operations
  const user = await acsClient.createUser();
  console.log(`Created user using connection string from Key Vault: ${user.communicationUserId}`);
}

main();
```

## Rotation Strategy

Regularly rotating your secrets is a security best practice. ACS connection strings can be rotated manually or automated using Azure Functions and Event Grid.

1. Generate a new key for your ACS resource.
2. Update the secret in Key Vault with the new connection string.
3. Your application will automatically retrieve the updated secret upon the next restart or if you implement a periodic refresh mechanism.

!!! info "Important"
    Key Vault supports versioning, allowing you to easily roll back if a new key fails.

## Page Flow

<!-- diagram-id: key-vault-reference-page-flow -->
```mermaid
flowchart TD
    A["Key Vault Reference"]
    B["Prerequisites"]
    C["SDK Installation"]
    D["Store Connection String in Key Vault"]
    E["Store the connection string as a secret"]
    A --> B
    B --> C
    C --> D
    D --> E
```

## Review Matrix

| Review area | Page-specific check |
|---|---|
| Scope | Confirm the guidance applies to Key Vault Reference. |
| Source basis | Validate the recommendation against the Microsoft Learn sources in this page. |
| Evidence | Capture command output, portal state, metrics, logs, or screenshots before treating the result as proven. |

## See Also
- [Azure Key Vault Secrets JavaScript Client](https://learn.microsoft.com/javascript/api/overview/azure/keyvault-secrets-readme)
- [Key Vault Authentication](https://learn.microsoft.com/azure/key-vault/general/authentication)

## Sources
- [Use Azure Key Vault from a Node.js application](https://learn.microsoft.com/en-us/azure/key-vault/general/quick-create-cli)

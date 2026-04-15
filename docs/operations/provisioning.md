---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource
  - https://learn.microsoft.com/azure/communication-services/quickstarts/email/create-email-communication-resource
---

# Provisioning ACS Resources

Provisioning Azure Communication Services (ACS) involves creating the core resource, configuring data residency, and optionally setting up communication channels like SMS and Email.

<!-- diagram-id: provisioning-workflow -->
```mermaid
graph LR
    Start[New Project] --> Core[Create ACS Resource]
    Core --> Data[Configure Data Residency]
    Data --> SMS[Phone Number Acquisition]
    Data --> Email[Email Domain Setup]
    SMS --> Ready[Ready for Development]
    Email --> Ready
```

## Creating ACS Resources

### Azure CLI
The most efficient way to create a resource for repeatable environments.

```bash
az communication create \
    --name my-acs-resource \
    --location Global \
    --data-location UnitedStates \
    --resource-group my-rg
```

### Bicep
For Infrastructure as Code, use the `Microsoft.Communication/communicationServices` resource type.

```bicep
resource acsResource 'Microsoft.Communication/communicationServices@2023-04-01-preview' = {
  name: 'my-acs-resource'
  location: 'Global'
  properties: {
    dataLocation: 'UnitedStates'
  }
}
```

## Resource Configuration Options

| Option | Description |
| --- | --- |
| `dataLocation` | Specifies where data at rest is stored (e.g., UnitedStates, Europe, Australia). |
| `linkedDomains` | Connects an Email Communication Service domain to the ACS resource. |
| `tags` | Key-value pairs for resource organization and billing. |

## Communication Channels Setup

### Phone Number Acquisition
Phone numbers can be acquired via the Azure Portal or via CLI:
```bash
az communication phone-number list-area-codes \
    --location US \
    --number-type TollFree
```

### Email Domain Setup
1. Create an Email Communication Service resource.
2. Add and verify a custom domain or use an Azure Managed Domain.
3. Link the verified domain to your ACS resource.

## See Also
- [Quickstart: Create and manage Communication Services resources](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource)
- [How to: Create an Email Communication Service](https://learn.microsoft.com/azure/communication-services/quickstarts/email/create-email-communication-resource)

## Sources
- [ACS Documentation](https://learn.microsoft.com/azure/communication-services/)

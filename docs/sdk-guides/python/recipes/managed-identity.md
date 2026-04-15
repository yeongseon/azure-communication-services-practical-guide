---
title: Managed Identity Authentication
description: Authenticating Azure Communication Services with Python using Managed Identities.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/authentication?pivots=programming-language-python
---

# Managed Identity Authentication

This recipe demonstrates how to authenticate with Azure Communication Services (ACS) using Azure Managed Identities, which provides a more secure approach than using connection strings.

## Prerequisites

- [Azure Managed Identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) enabled on your application's compute resource (e.g., Azure App Service, Azure Function, Azure VM).
- Appropriate role-based access control (RBAC) assigned to the managed identity for your ACS resource (e.g., **Cognitive Services User**).

## DefaultAzureCredential with ACS

The `azure-identity` package provides the `DefaultAzureCredential` class, which automatically handles multiple authentication methods, including managed identities.

```bash
pip install azure-identity
```

### System-Assigned Managed Identity

A system-assigned identity is tied directly to the resource lifecycle.

```python
import os
from azure.communication.identity import CommunicationIdentityClient
from azure.identity import DefaultAzureCredential

# Get the endpoint from an environment variable
endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")

# Initialize the client using DefaultAzureCredential
client = CommunicationIdentityClient(endpoint, DefaultAzureCredential())

# Perform operations
user = client.create_user()
print(f"Created user with managed identity: {user.properties['id']}")
```

### User-Assigned Managed Identity

A user-assigned identity can be shared across multiple resources. To use a specific user-assigned identity, provide its client ID to the `DefaultAzureCredential`.

```python
import os
from azure.communication.identity import CommunicationIdentityClient
from azure.identity import DefaultAzureCredential

endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
user_assigned_client_id = "<your-user-assigned-identity-client-id>"

# Specify the user-assigned identity client ID
credential = DefaultAzureCredential(managed_identity_client_id=user_assigned_client_id)

client = CommunicationIdentityClient(endpoint, credential)
```

## Client Examples

All ACS Python SDK clients support `DefaultAzureCredential`.

### SMS Client

```python
from azure.communication.sms import SmsClient
from azure.identity import DefaultAzureCredential

endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
sms_client = SmsClient(endpoint, DefaultAzureCredential())
```

### Email Client

```python
from azure.communication.email import EmailClient
from azure.identity import DefaultAzureCredential

endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
email_client = EmailClient(endpoint, DefaultAzureCredential())
```

### Phone Numbers Client

```python
from azure.communication.phonenumbers import PhoneNumbersClient
from azure.identity import DefaultAzureCredential

endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
phone_numbers_client = PhoneNumbersClient(endpoint, DefaultAzureCredential())
```

## See Also
- [RBAC for ACS](https://learn.microsoft.com/azure/communication-services/concepts/authentication#role-based-access-control)
- [Managed Identities for Azure Resources](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

## Sources
- [Authenticate to Azure Communication Services with Managed Identities](https://learn.microsoft.com/azure/communication-services/concepts/authentication?pivots=programming-language-python)

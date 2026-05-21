---
title: Teams Interop
description: Joining Microsoft Teams meetings with ACS and Python.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/teams-interop?pivots=programming-language-python
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Teams Interop

This recipe demonstrates how to join Microsoft Teams meetings and map identities between Azure Communication Services (ACS) and Teams using Python.

## Prerequisites

- [ACS Resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- [Microsoft Teams Meeting](https://learn.microsoft.com/microsoftteams/teams-meetings).
- [Managed Identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) or connection string.

## 1. SDK Installation

```bash
pip install azure-communication-identity
```

## 2. Join Teams Meeting from Python App

While joining a Teams meeting for video calling is typically done from a client application (using the Calling SDK), you can use the Python SDK to manage user identities and access tokens for Teams interop.

```python
import os
from azure.communication.identity import CommunicationIdentityClient
from azure.identity import DefaultAzureCredential

# Initialize client
endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
identity_client = CommunicationIdentityClient(endpoint, DefaultAzureCredential())

# Create an ACS user
user = identity_client.create_user()

# Get an access token with 'voip' scope for Teams interop
token_response = identity_client.get_token(user, ["voip"])

# You can now use this token and the Teams meeting URL to join the meeting from your client application.
# meeting_url = "https://teams.microsoft.com/l/meetup-join/..."

print(f"ACS User ID: {user.properties['id']}")
print(f"Access token for Teams interop: {token_response.token}")
```

## 3. Teams User Identity Mapping

You can map ACS user identities to Microsoft 365 (Teams) user identities using the `get_token_for_teams_user` method. This requires a Microsoft Entra ID (formerly Azure AD) access token for the Teams user.

```python
# Assuming you have an Entra ID token for the Teams user
entra_id_token = "<microsoft-entra-id-token>"

# Get an ACS access token for the Teams user
token_for_teams_user = identity_client.get_token_for_teams_user(entra_id_token, "<client-id>", "<user-object-id>")

print(f"ACS access token for Teams user: {token_for_teams_user.token}")
```

## 4. Meeting URL Handling

Teams meeting URLs are used by the Calling SDK to join specific meetings. You can parse these URLs to extract the meeting ID and thread ID if needed.

```python
# Sample Teams meeting URL
meeting_url = "https://teams.microsoft.com/l/meetup-join/19%3ameeting_MT...%40thread.v2/0?context=%7b%22Tid%22%3a%22...%22%2c%22Oid%22%3a%22...%22%7d"

# The Calling SDK handles this URL directly.
```

## 5. Security and Compliance

- Ensure your ACS resource is configured to allow Teams interop.
- Follow Microsoft's guidelines for handling Teams data and identities.
- Implement proper authentication and authorization to protect meeting access.

## 6. Best Practices

- Use the latest version of the ACS SDKs.
- Test your interop scenarios with different Teams meeting types (e.g., scheduled, ad-hoc).
- Monitor your ACS and Teams usage for any unexpected issues.

## See Also
- [Teams Interoperability Concepts](https://learn.microsoft.com/azure/communication-services/concepts/teams-interop)
- [Calling SDK for JavaScript (Client-side)](../../javascript/tutorial/05-video-calling.md)

## Sources
- [Azure Communication Identity client library for Python](https://learn.microsoft.com/python/api/overview/azure/communication-identity-readme)

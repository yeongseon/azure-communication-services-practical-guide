---
title: "Step 1: Local Setup"
description: Configure your .NET environment for Azure Communication Services.
content_sources:
  - id: dotnet-local-setup
    type: documentation
    source: self
    justification: Explains how to set up a .NET project with ACS dependencies.
    based_on: https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource
---

# Step 1: Local Setup

Prepare your development environment and Azure resources for .NET development.

## Prerequisites

1.  **.NET 6+ SDK**: Ensure the latest SDK is installed.
2.  **Azure CLI**: For resource management.
3.  **Visual Studio or VS Code**: Recommended IDEs.

## 1. Create ACS Resource

Use the Azure CLI to create a resource:

```bash
az communication create --name "MyACSResource" --location "Global" --data-location "United States" --resource-group "MyResourceGroup"
```

| Command | Purpose |
|---------|---------|
| `az communication create` | Creates an Azure Communication Services resource. |
| `--name "MyACSResource"` | Names the ACS resource to create. |
| `--location "Global"` | Sets the resource location (ACS resources are Global). |
| `--data-location "United States"` | Sets the immutable region where data at rest is stored. |
| `--resource-group "MyResourceGroup"` | Places the resource in the named resource group. |

Copy the **Connection String** from the output or the Azure Portal.

## 2. Initialize .NET Console App

Create a new console application:

```bash
dotnet new console -n CommunicationApp
cd CommunicationApp
```

## 3. Add NuGet Packages

Add the Identity SDK to get started:

```bash
dotnet add package Azure.Communication.Identity
```

## 4. Set Up User Secrets

For local development, use **User Secrets** to store your connection string securely.

```bash
dotnet user-secrets init
dotnet user-secrets set "CommunicationServices:ConnectionString" "<your-connection-string>"
```

## 5. Verify Setup

Update `Program.cs` to verify connectivity:

```csharp
using Azure.Communication.Identity;
using Microsoft.Extensions.Configuration;

var config = new ConfigurationBuilder().AddUserSecrets<Program>().Build();
string connectionString = config["CommunicationServices:ConnectionString"];

if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("Connection string not found in user secrets.");
    return;
}

var client = new CommunicationIdentityClient(connectionString);
var user = await client.CreateUserAsync();

Console.WriteLine($"Successfully created user with ID: {user.Value.Id}");
```

Run the application:
```bash
dotnet run
```

## Next Step

Now that your environment is ready, let's [Send an SMS](./02-send-sms.md).

## Sources
- [Quickstart: Create and manage Communication Services resources](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource)

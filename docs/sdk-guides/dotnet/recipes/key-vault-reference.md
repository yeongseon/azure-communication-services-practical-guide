---
content_sources:
  diagrams:
    - id: dotnet-recipe-key-vault-reference-flow
      type: flowchart
      source: self-generated
      justification: Sequential walkthrough of this page's own step structure.

title: Key Vault Reference with .NET
description: Securely retrieve Azure Communication Services connection strings using Azure Key Vault.
---

# Key Vault Reference with .NET

Store your ACS credentials securely in Azure Key Vault and retrieve them using the .NET SDK.

This recipe walks these steps in order:

<!-- diagram-id: dotnet-recipe-key-vault-reference-flow -->
```mermaid
flowchart TD
    START["Key Vault Reference with .NET"]
    N1["1. Add NuGet Packages"]
    N2["2. Retrieve Secret"]
    N3["3. ASP.NET Core Configuration Integration"]
    N4["4. Azure App Service / Functions Reference"]
    START --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
```

## 1. Add NuGet Packages

```bash
dotnet add package Azure.Security.KeyVault.Secrets
dotnet add package Azure.Identity
```

## 2. Retrieve Secret

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

string keyVaultUrl = "https://<your-keyvault-name>.vault.azure.net/";
var secretClient = new SecretClient(new Uri(keyVaultUrl), new DefaultAzureCredential());

KeyVaultSecret secret = await secretClient.GetSecretAsync("ACS-Connection-String");
string connectionString = secret.Value;
```

## 3. ASP.NET Core Configuration Integration

You can add Key Vault as a configuration source in `Program.cs`.

```csharp
using Azure.Identity;

builder.Configuration.AddAzureKeyVault(
    new Uri(builder.Configuration["KeyVaultUrl"]),
    new DefaultAzureCredential());

// Now access it like any other config
string acsConnectionString = builder.Configuration["ACS-Connection-String"];
```

## 4. Azure App Service / Functions Reference

Use the `@Microsoft.KeyVault` syntax in your Application Settings to automatically inject secrets as environment variables.

- **Setting Name**: `ACS_CONNECTION_STRING`
- **Value**: `@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/ACS-Connection-String/)`

In C#, read it via `Environment.GetEnvironmentVariable("ACS_CONNECTION_STRING")`.

## See Also
- [.NET Recipes](./index.md)
- [.NET SDK Guide](../index.md)

## Sources
- [Azure Key Vault Secret client library for .NET](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/security-keyvault-secrets-readme)

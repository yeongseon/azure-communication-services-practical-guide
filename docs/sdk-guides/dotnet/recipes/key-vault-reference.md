---
title: Key Vault Reference with .NET
description: Securely retrieve Azure Communication Services connection strings using Azure Key Vault.
---

# Key Vault Reference with .NET

Store your ACS credentials securely in Azure Key Vault and retrieve them using the .NET SDK.

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

## Sources
- [Azure Key Vault Secret client library for .NET](https://learn.microsoft.com/dotnet/api/overview/azure/security-keyvault-secrets-readme)

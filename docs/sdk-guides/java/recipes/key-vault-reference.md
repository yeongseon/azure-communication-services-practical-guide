---
content_sources:
  diagrams:
    - id: java-recipe-key-vault-reference-flow
      type: flowchart
      source: self-generated
      justification: Sequential walkthrough of this page's own step structure.

title: Key Vault Reference with Java
description: Securely retrieve Azure Communication Services connection strings using Azure Key Vault.
---

# Key Vault Reference with Java

Storing secrets in Azure Key Vault is a best practice for securing your communication resource credentials.

This recipe walks these steps in order:

<!-- diagram-id: java-recipe-key-vault-reference-flow -->
```mermaid
flowchart TD
    START["Key Vault Reference with Java"]
    N1["1. Add Key Vault Dependency"]
    N2["2. Retrieve Secret from Key Vault"]
    N3["3. App Service / Azure Functions Integration"]
    START --> N1
    N1 --> N2
    N2 --> N3
```

## 1. Add Key Vault Dependency

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-security-keyvault-secrets</artifactId>
    <version>4.7.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.10.0</version>
</dependency>
```

## 2. Retrieve Secret from Key Vault

Use the `SecretClient` to fetch your ACS connection string at runtime.

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;

public class KeyVaultApp {
    public static void main(String[] args) {
        String keyVaultUrl = "https://<your-keyvault-name>.vault.azure.net/";
        
        SecretClient secretClient = new SecretClientBuilder()
            .vaultUrl(keyVaultUrl)
            .credential(new DefaultAzureCredentialBuilder().build())
            .buildClient();

        KeyVaultSecret secret = secretClient.getSecret("ACS-Connection-String");
        String connectionString = secret.getValue();
        
        System.out.println("Retrieved secret from Key Vault.");
        // Initialize your ACS clients using the connectionString
    }
}
```

## 3. App Service / Azure Functions Integration

If you are using Azure App Service or Azure Functions, you can use **Key Vault References** in your application settings without writing extra code to fetch secrets.

Set the app setting value to:
`@Microsoft.KeyVault(SecretUri=https://<your-vault>.vault.azure.net/secrets/<secret-name>/)`

Your Java app can then read it like a normal environment variable:
`System.getenv("ACS_CONNECTION_STRING")`

## See Also
- [Java Recipes](./index.md)
- [Java SDK Guide](../index.md)

## Sources
- [Azure Key Vault Secret client library for Java](https://learn.microsoft.com/en-us/java/api/overview/azure/security-keyvault-secrets-readme)

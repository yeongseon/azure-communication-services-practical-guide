---
title: "Step 7: Infrastructure as Code"
description: Automate the deployment of your Java ACS application with Bicep and GitHub Actions.
content_sources:
  - id: java-iac
    type: documentation
    source: self
    justification: Explains IaC and CI/CD for Java ACS projects.
    based_on: https://learn.microsoft.com/azure/communication-services/quickstarts/resource-manager-template
---

# Step 7: Infrastructure as Code

Automating resource provisioning ensures consistency across environments. This step covers Bicep templates and CI/CD integration.

## 1. Bicep Template for ACS

Create a file named `main.bicep` to define your Communication Services resource.

```bicep
param location string = 'global'
param resourceName string = 'my-acs-resource'

resource acsResource 'Microsoft.Communication/CommunicationServices@2023-03-31' = {
  name: resourceName
  location: location
  properties: {
    dataLocation: 'United States'
  }
}

output acsId string = acsResource.id
```

Deploy using Azure CLI:
```bash
az deployment group create --resource-group MyRG --template-file main.bicep
```

| Command | Purpose |
|---------|---------|
| `az deployment group create` | Deploys an ARM/Bicep template to a resource group. |
| `--resource-group MyRG` | Names the target resource group for the deployment. |
| `--template-file main.bicep` | Points to the Bicep template to deploy. |

## 2. GitHub Actions Workflow

Automate your Maven build and deployment using GitHub Actions. Create `.github/workflows/main.yml`.

```yaml
name: Java CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
        
    - name: Build with Maven
      run: mvn -B package --file pom.xml

    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy Bicep
      run: |
        az deployment group create \
          --resource-group ${{ secrets.AZURE_RG }} \
          --template-file ./main.bicep
```

## 3. Managing Phone Numbers via CLI

Phone number **acquisition** is performed in the Azure Portal (Communication Service → Phone numbers → Get). The Azure CLI does not support searching or purchasing numbers; it supports inventorying and inspecting numbers already acquired on the resource.

```bash
# List phone numbers already acquired on the resource
az communication phonenumber list --connection-string "<connection-string>"

# Show details for a specific acquired number
az communication phonenumber show --phonenumber "<+1425XXXXXXX>" --connection-string "<connection-string>"
```

| Command | Purpose |
|---------|---------|
| `az communication phonenumber list` | Lists the phone numbers already acquired on the ACS resource. |
| `--connection-string "<connection-string>"` | Authenticates the request using the ACS connection string. |
| `az communication phonenumber show` | Shows details for a specific acquired phone number. |
| `--phonenumber "<+1425XXXXXXX>"` | Identifies the acquired phone number to inspect. |

## 4. Maven Plugin for Azure App Service

If you are deploying a web application, use the Maven plugin for Azure App Service.

```xml
<plugin>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-webapp-maven-plugin</artifactId>
    <version>2.12.0</version>
    <configuration>
        <schemaVersion>v2</schemaVersion>
        <resourceGroup>my-resource-group</resourceGroup>
        <appName>my-acs-java-app</appName>
        <region>westus</region>
        <runtime>
            <os>linux</os>
            <javaVersion>Java 17</javaVersion>
            <webContainer>Java SE</webContainer>
        </runtime>
    </configuration>
</plugin>
```

## Summary

Congratulations! You have built a complete communication application with Java, from local setup to automated deployment.

## Sources
- [Bicep documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

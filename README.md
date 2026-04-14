# Azure Communication Services Practical Guide

Comprehensive guide for Azure Communication Services — SMS, Voice, Email, Chat, Video Calling, and Teams Interop.

## What's Inside

| Section | Description |
|---|---|
| [Start Here](https://yeongseon.github.io/azure-communication-services-practical-guide/) | Overview, learning paths, repository map, and how to use the guide |
| [Platform](https://yeongseon.github.io/azure-communication-services-practical-guide/platform/) | How ACS works, resource types, messaging channels, networking, auth, events, and security |
| [Best Practices](https://yeongseon.github.io/azure-communication-services-practical-guide/best-practices/) | Production baseline, security, networking, reliability, scaling, cost, and anti-patterns |
| [SDK Guides](https://yeongseon.github.io/azure-communication-services-practical-guide/sdk-guides/) | Step-by-step tutorials and recipes for Python, JavaScript, Java, and .NET |
| [Operations](https://yeongseon.github.io/azure-communication-services-practical-guide/operations/) | Provisioning, monitoring, deployment, health recovery, security, and cost optimization |
| [Troubleshooting](https://yeongseon.github.io/azure-communication-services-practical-guide/troubleshooting/) | Decision trees, evidence maps, first-10-minute checks, playbooks, methodology, and KQL packs |
| [Reference](https://yeongseon.github.io/azure-communication-services-practical-guide/reference/) | CLI cheatsheet, platform limits, KQL queries, and SDK reference |
| [Visualization](https://yeongseon.github.io/azure-communication-services-practical-guide/visualization/) | Knowledge graphs, troubleshooting maps, and learning path visuals |
| [Meta](https://yeongseon.github.io/azure-communication-services-practical-guide/meta/taxonomy/) | Repository taxonomy and content model |

## SDK Coverage

- **Python** — SMS, email, chat, voice calling, monitoring, IaC, and recipes
- **JavaScript** — SMS, email, chat, video calling, monitoring, IaC, and UI recipes
- **Java** — SMS, email, chat, voice calling, monitoring, IaC, and production recipes
- **.NET** — SMS, email, chat, voice calling, monitoring, IaC, and production recipes

Each SDK track includes a tutorial path plus focused recipes for managed identity, Key Vault references, Event Grid webhooks, phone number management, email attachments, and Teams interop.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yeongseon/azure-communication-services-practical-guide.git

# Install MkDocs dependencies
pip install mkdocs-material mkdocs-minify-plugin

# Start local documentation server
mkdocs serve
```

Visit `http://127.0.0.1:8000` to browse the documentation locally.

## Repository Layout

- `docs/` — MkDocs source for platform guidance, SDK tutorials, operations guidance, troubleshooting content, and visualizations
- `apps/python/` — Python ACS reference app assets
- `apps/javascript/` — JavaScript ACS reference app assets
- `apps/java/` — Java ACS reference app assets
- `apps/dotnet/` — .NET ACS reference app assets
- `.github/workflows/docs.yml` — GitHub Pages deployment workflow
- `mkdocs.yml` — site configuration, theme settings, and global navigation

## Focus Areas

- **Messaging** — SMS delivery, opt-out handling, throughput, and observability
- **Email** — domain verification, delivery troubleshooting, spam filtering, and attachments
- **Chat** — thread management, message delivery, notifications, and file-sharing patterns
- **Voice & Video** — call quality, drops, diagnostics, and operational baselines
- **Teams Interop** — join flows, permissions, interoperability patterns, and failure isolation

## Contributing

Contributions welcome. Please ensure:

- All CLI examples use long flags
- All documents include clear source attribution where applicable
- Mermaid diagrams and visual assets remain consistent with the rest of the guide
- No secrets, phone numbers, tenant IDs, or other sensitive data appear in examples

## Related Projects

| Repository | Description |
|---|---|
| [azure-app-service-practical-guide](https://github.com/yeongseon/azure-app-service-practical-guide) | Azure App Service practical guide |
| [azure-architecture-practical-guide](https://github.com/yeongseon/azure-architecture-practical-guide) | Azure Architecture practical guide |
| [azure-aks-practical-guide](https://github.com/yeongseon/azure-aks-practical-guide) | Azure Kubernetes Service (AKS) practical guide |
| [azure-container-apps-practical-guide](https://github.com/yeongseon/azure-container-apps-practical-guide) | Azure Container Apps practical guide |
| [azure-functions-practical-guide](https://github.com/yeongseon/azure-functions-practical-guide) | Azure Functions practical guide |
| [azure-monitoring-practical-guide](https://github.com/yeongseon/azure-monitoring-practical-guide) | Azure Monitoring practical guide |
| [azure-networking-practical-guide](https://github.com/yeongseon/azure-networking-practical-guide) | Azure Networking practical guide |
| [azure-storage-practical-guide](https://github.com/yeongseon/azure-storage-practical-guide) | Azure Storage practical guide |
| [azure-virtual-machine-practical-guide](https://github.com/yeongseon/azure-virtual-machine-practical-guide) | Azure Virtual Machines practical guide |

## Disclaimer

This is an independent community project. Not affiliated with or endorsed by Microsoft. Azure and Azure Communication Services are trademarks of Microsoft Corporation.

## License

[MIT](LICENSE)

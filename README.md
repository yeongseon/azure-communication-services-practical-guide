# Azure Communication Services Practical Guide

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

Comprehensive guide for Azure Communication Services — SMS, Voice, Email, Chat, Video Calling, and Teams Interop.

## What's Inside

| Section | Description | Status |
|---|---|---|
| [Start Here](https://yeongseon.github.io/azure-communication-services-practical-guide/) | Overview, learning paths, repository map, and how to use the guide | Comprehensive |
| [Platform](https://yeongseon.github.io/azure-communication-services-practical-guide/platform/) | How ACS works, resource types, messaging channels, networking, auth, events, and security | Comprehensive |
| [Best Practices](https://yeongseon.github.io/azure-communication-services-practical-guide/best-practices/) | Production baseline, security, networking, reliability, scaling, cost, and anti-patterns | Comprehensive |
| [SDK Guides](https://yeongseon.github.io/azure-communication-services-practical-guide/sdk-guides/) | Step-by-step tutorials and recipes for Python, JavaScript, Java, and .NET | Comprehensive |
| [Operations](https://yeongseon.github.io/azure-communication-services-practical-guide/operations/) | Provisioning, monitoring, deployment, health recovery, security, and cost optimization | Comprehensive |
| [Troubleshooting](https://yeongseon.github.io/azure-communication-services-practical-guide/troubleshooting/) | Decision trees, evidence maps, first-10-minute checks, playbooks, methodology, and KQL packs | Comprehensive |
| [Reference](https://yeongseon.github.io/azure-communication-services-practical-guide/reference/) | CLI cheatsheet, platform limits, KQL queries, and SDK reference | Comprehensive |
| [Visualization](https://yeongseon.github.io/azure-communication-services-practical-guide/visualization/) | Knowledge graphs, troubleshooting maps, and learning path visuals | Published |
| [Meta](https://yeongseon.github.io/azure-communication-services-practical-guide/meta/taxonomy/) | Repository taxonomy and content model | Published |

**Status legend**: **Lab-validated** = Comprehensive + reproducible labs prove the guidance · **Comprehensive** = Full section, MSLearn-verified, production-ready · **Published** = Core content in place, still expanding · **In progress** = Partial content, active development · **Planned** = Placeholder, content not yet started

## SDK Coverage

- **Python** — SMS, email, chat, call automation, monitoring, IaC, and recipes
- **JavaScript** — SMS, email, chat, video calling, monitoring, IaC, and UI recipes
- **Java** — SMS, email, chat, call automation, monitoring, IaC, and production recipes
- **.NET** — SMS, email, chat, voice calling (Windows), monitoring, IaC, and production recipes

Each SDK track includes a tutorial path plus focused recipes for managed identity, Event Grid webhooks, phone number management, and email attachments. Calling and Teams interop capabilities vary by SDK platform.

## Quick Start

```bash
git clone https://github.com/yeongseon/azure-communication-services-practical-guide.git
cd azure-communication-services-practical-guide

python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements-docs.txt

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
- **Chat** — thread management, message delivery, notifications, and real-time messaging patterns
- **Voice & Video** — call quality, drops, diagnostics, and operational baselines
- **Teams Interop** — join flows, permissions, interoperability patterns, and failure isolation

## Contributing

Contributions welcome! Please see our [Contributing Guide](https://yeongseon.github.io/azure-communication-services-practical-guide/contributing/) for:

- Repository structure and content organization
- Document templates and writing standards
- CLI command style and PII rules
- Local development setup and build validation
- Pull request process

## Related Projects

| Repository | Description |
|---|---|
| [azure-virtual-machine-practical-guide](https://github.com/yeongseon/azure-virtual-machine-practical-guide) | Azure Virtual Machines practical guide |
| [azure-networking-practical-guide](https://github.com/yeongseon/azure-networking-practical-guide) | Azure Networking practical guide |
| [azure-storage-practical-guide](https://github.com/yeongseon/azure-storage-practical-guide) | Azure Storage practical guide |
| [azure-app-service-practical-guide](https://github.com/yeongseon/azure-app-service-practical-guide) | Azure App Service practical guide |
| [azure-functions-practical-guide](https://github.com/yeongseon/azure-functions-practical-guide) | Azure Functions practical guide |
| [azure-container-apps-practical-guide](https://github.com/yeongseon/azure-container-apps-practical-guide) | Azure Container Apps practical guide |
| [azure-kubernetes-service-practical-guide](https://github.com/yeongseon/azure-kubernetes-service-practical-guide) | Azure Kubernetes Service (AKS) practical guide |
| [azure-architecture-practical-guide](https://github.com/yeongseon/azure-architecture-practical-guide) | Azure Architecture practical guide |
| [azure-monitoring-practical-guide](https://github.com/yeongseon/azure-monitoring-practical-guide) | Azure Monitoring practical guide |

## Disclaimer

This is an independent community project. Not affiliated with or endorsed by Microsoft. Azure and Azure Communication Services are trademarks of Microsoft Corporation.

## License

[MIT](LICENSE)

# Azure Communication Services 实操指南

📘 **文档站点:** <https://yeongseon.github.io/azure-communication-services-practical-guide/>

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

[![Docs](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/docs.yml/badge.svg)](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/docs.yml)
[![CI](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/validate-content-sources.yml/badge.svg)](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/validate-content-sources.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Azure Communication Services 全方位实操指南——SMS、语音、电子邮件、聊天、视频通话和 Teams 互操作。

## 主要内容

| 章节 | 描述 | 状态 |
|---|---|---|
| [从这里开始](https://yeongseon.github.io/azure-communication-services-practical-guide/) | 概述、学习路径、仓库地图和指南使用方法 | 全面 |
| [平台](https://yeongseon.github.io/azure-communication-services-practical-guide/platform/) | ACS 工作原理、资源类型、消息通道、网络、身份验证、事件和安全 | 全面 |
| [最佳实践](https://yeongseon.github.io/azure-communication-services-practical-guide/best-practices/) | 生产基线、安全、网络、可靠性、扩展、成本和反模式 | 全面 |
| [SDK 指南](https://yeongseon.github.io/azure-communication-services-practical-guide/sdk-guides/) | 面向 Python、JavaScript、Java 和 .NET 的分步教程与实用示例 | 全面 |
| [运营](https://yeongseon.github.io/azure-communication-services-practical-guide/operations/) | 预配、监控、部署、健康恢复、安全和成本优化 | 全面 |
| [故障排除](https://yeongseon.github.io/azure-communication-services-practical-guide/troubleshooting/) | 决策树、证据图、前 10 分钟检查、实战手册、方法论和 KQL 包 | 全面 |
| [参考](https://yeongseon.github.io/azure-communication-services-practical-guide/reference/) | CLI 速查表、平台限制、KQL 查询和 SDK 参考 | 全面 |
| [可视化](https://yeongseon.github.io/azure-communication-services-practical-guide/visualization/) | 知识图谱、故障排除地图和学习路径可视化 | 已发布 |
| [元数据](https://yeongseon.github.io/azure-communication-services-practical-guide/meta/taxonomy/) | 仓库分类和内容模型 | 已发布 |

**状态图例**: **实验室验证** = 全面内容 + 可复现实验室验证 · **全面** = 完整章节、经 MSLearn 验证、可用于生产 · **已发布** = 核心内容就绪，仍在扩展 · **进行中** = 部分内容，积极开发中 · **计划中** = 占位符，内容尚未开始

## SDK 覆盖范围

- **Python** — SMS、电子邮件、聊天、通话自动化、监控、IaC 和实用示例
- **JavaScript** — SMS、电子邮件、聊天、视频通话、监控、IaC 和 UI 实用示例
- **Java** — SMS、电子邮件、聊天、通话自动化、监控、IaC 和生产实用示例
- **.NET** — SMS、电子邮件、聊天、语音通话 (Windows)、监控、IaC 和生产实用示例

每个 SDK 分支都包含教程路径以及针对托管身份、Event Grid Webhook、电话号码管理和电子邮件附件的重点示例。通话与 Teams 互操作能力因 SDK 平台而异。

## 快速入门

```bash
git clone https://github.com/yeongseon/azure-communication-services-practical-guide.git
cd azure-communication-services-practical-guide

python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements-docs.txt

mkdocs serve
```

访问 `http://127.0.0.1:8000` 在本地浏览文档。

## 仓库结构

- `docs/` — 面向平台指南、SDK 教程、运营指导、故障排除内容与可视化的 MkDocs 源码
- `.github/workflows/docs.yml` — GitHub Pages 部署工作流
- `mkdocs.yml` — 站点配置、主题设置和全局导航

这是一个以 SDK 为中心的文档仓库。SDK 代码示例内联在 `docs/sdk-guides/` 下的教程中，没有单独的 `apps/` 目录。

## 重点领域

- **消息传递** — SMS 投递、退订处理、吞吐量与可观测性
- **电子邮件** — 域验证、投递故障排除、垃圾邮件过滤与附件
- **聊天** — 线程管理、消息投递、通知与实时消息模式
- **语音与视频** — 通话质量、掉线、诊断与运营基线
- **Teams 互操作** — 加入流程、权限、互操作模式与故障隔离

## 贡献

欢迎贡献。详见 [贡献指南](https://yeongseon.github.io/azure-communication-services-practical-guide/contributing/):

- 仓库结构和内容组织
- 文档模板和写作标准
- CLI 命令风格与 PII 规则
- 本地开发环境和构建验证
- 拉取请求流程

## 相关项目

| 仓库 | 描述 |
|---|---|
| [azure-virtual-machine-practical-guide](https://github.com/yeongseon/azure-virtual-machine-practical-guide) | Azure Virtual Machines 实操指南 |
| [azure-networking-practical-guide](https://github.com/yeongseon/azure-networking-practical-guide) | Azure Networking 实操指南 |
| [azure-storage-practical-guide](https://github.com/yeongseon/azure-storage-practical-guide) | Azure Storage 实操指南 |
| [azure-app-service-practical-guide](https://github.com/yeongseon/azure-app-service-practical-guide) | Azure App Service 实操指南 |
| [azure-functions-practical-guide](https://github.com/yeongseon/azure-functions-practical-guide) | Azure Functions 实操指南 |
| [azure-communication-services-practical-guide](https://github.com/yeongseon/azure-communication-services-practical-guide) | Azure Communication Services 实操指南 |
| [azure-container-apps-practical-guide](https://github.com/yeongseon/azure-container-apps-practical-guide) | Azure Container Apps 实操指南 |
| [azure-kubernetes-service-practical-guide](https://github.com/yeongseon/azure-kubernetes-service-practical-guide) | Azure Kubernetes Service (AKS) 实操指南 |
| [azure-architecture-practical-guide](https://github.com/yeongseon/azure-architecture-practical-guide) | Azure Architecture 实操指南 |
| [azure-monitoring-practical-guide](https://github.com/yeongseon/azure-monitoring-practical-guide) | Azure Monitoring 实操指南 |

## 免责声明

这是一个独立的社区项目。与 Microsoft 无关，也不受其认可。Azure 和 Azure Communication Services 是 Microsoft Corporation 的商标。

## 许可证

[MIT](LICENSE)

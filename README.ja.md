# Azure Communication Services 実務ガイド

📘 **ドキュメントサイト:** <https://yeongseon.github.io/azure-communication-services-practical-guide/>

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md)

[![Docs](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/docs.yml/badge.svg)](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/docs.yml)
[![CI](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/validate-content-sources.yml/badge.svg)](https://github.com/yeongseon/azure-communication-services-practical-guide/actions/workflows/validate-content-sources.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Azure Communication Services — SMS、音声、メール、チャット、ビデオ通話、Teams 相互運用のための包括的な実務ガイドです。

## 主な内容

| セクション | 説明 | ステータス |
|---|---|---|
| [ここから開始](https://yeongseon.github.io/azure-communication-services-practical-guide/) | 概要、学習パス、リポジトリマップ、ガイドの使用方法 | 総合 |
| [プラットフォーム](https://yeongseon.github.io/azure-communication-services-practical-guide/platform/) | ACS の仕組み、リソースタイプ、メッセージングチャネル、ネットワーク、認証、イベント、セキュリティ | 総合 |
| [ベストプラクティス](https://yeongseon.github.io/azure-communication-services-practical-guide/best-practices/) | 本番ベースライン、セキュリティ、ネットワーク、信頼性、スケーリング、コスト、アンチパターン | 総合 |
| [SDK ガイド](https://yeongseon.github.io/azure-communication-services-practical-guide/sdk-guides/) | Python、JavaScript、Java、.NET 向けのステップバイステップチュートリアルとレシピ | 総合 |
| [運用](https://yeongseon.github.io/azure-communication-services-practical-guide/operations/) | プロビジョニング、モニタリング、デプロイ、ヘルスリカバリ、セキュリティ、コスト最適化 | 総合 |
| [トラブルシューティング](https://yeongseon.github.io/azure-communication-services-practical-guide/troubleshooting/) | 決定木、エビデンスマップ、最初の 10 分チェック、プレイブック、方法論、KQL パック | 総合 |
| [リファレンス](https://yeongseon.github.io/azure-communication-services-practical-guide/reference/) | CLI チートシート、プラットフォームの制限、KQL クエリ、SDK リファレンス | 総合 |
| [可視化](https://yeongseon.github.io/azure-communication-services-practical-guide/visualization/) | ナレッジグラフ、トラブルシューティングマップ、学習パスの視覚化 | 公開済み |
| [メタ](https://yeongseon.github.io/azure-communication-services-practical-guide/meta/taxonomy/) | リポジトリ分類とコンテンツモデル | 公開済み |

**ステータス凡例**: **ラボ検証済み** = 総合コンテンツ + 再現可能なラボで検証 · **総合** = 完全なセクション、MSLearn 検証済み、本番運用可能 · **公開済み** = コアコンテンツは配置済み、拡張中 · **進行中** = 一部コンテンツ、積極的に開発中 · **計画中** = プレースホルダー、コンテンツ未着手

## SDK カバレッジ

- **Python** — SMS、メール、チャット、コール自動化、モニタリング、IaC、レシピ
- **JavaScript** — SMS、メール、チャット、ビデオ通話、モニタリング、IaC、UI レシピ
- **Java** — SMS、メール、チャット、コール自動化、モニタリング、IaC、本番運用レシピ
- **.NET** — SMS、メール、チャット、音声通話 (Windows)、モニタリング、IaC、本番運用レシピ

各 SDK トラックには、チュートリアルパスと、マネージド ID、Event Grid Webhook、電話番号管理、メール添付ファイルに焦点を当てたレシピが含まれます。通話および Teams 相互運用機能は SDK プラットフォームによって異なります。

## クイックスタート

```bash
git clone https://github.com/yeongseon/azure-communication-services-practical-guide.git
cd azure-communication-services-practical-guide

python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements-docs.txt

mkdocs serve
```

ローカルで `http://127.0.0.1:8000` にアクセスしてドキュメントを閲覧してください。

## リポジトリ構造

- `docs/` — プラットフォームガイド、SDK チュートリアル、運用ガイダンス、トラブルシューティングコンテンツ、可視化のための MkDocs ソース
- `.github/workflows/docs.yml` — GitHub Pages デプロイワークフロー
- `mkdocs.yml` — サイト構成、テーマ設定、グローバルナビゲーション

これは SDK 中心のドキュメントリポジトリです。SDK のコード例は `docs/sdk-guides/` 配下のチュートリアルにインラインで含まれており、別途 `apps/` ディレクトリはありません。

## 重点領域

- **メッセージング** — SMS 配信、オプトアウト処理、スループット、可観測性
- **メール** — ドメイン検証、配信トラブルシューティング、スパムフィルタリング、添付ファイル
- **チャット** — スレッド管理、メッセージ配信、通知、リアルタイムメッセージングパターン
- **音声・ビデオ** — 通話品質、切断、診断、運用ベースライン
- **Teams 相互運用** — 参加フロー、権限、相互運用パターン、障害隔離

## 貢献

貢献を歓迎します。詳細は [貢献ガイド](https://yeongseon.github.io/azure-communication-services-practical-guide/contributing/) を参照してください:

- リポジトリ構造とコンテンツの構成
- ドキュメントテンプレートと執筆基準
- CLI コマンドスタイルと PII ルール
- ローカル開発環境とビルド検証
- プルリクエストのプロセス

## 関連プロジェクト

| リポジトリ | 説明 |
|---|---|
| [azure-virtual-machine-practical-guide](https://github.com/yeongseon/azure-virtual-machine-practical-guide) | Azure Virtual Machines 実務ガイド |
| [azure-networking-practical-guide](https://github.com/yeongseon/azure-networking-practical-guide) | Azure Networking 実務ガイド |
| [azure-storage-practical-guide](https://github.com/yeongseon/azure-storage-practical-guide) | Azure Storage 実務ガイド |
| [azure-app-service-practical-guide](https://github.com/yeongseon/azure-app-service-practical-guide) | Azure App Service 実務ガイド |
| [azure-functions-practical-guide](https://github.com/yeongseon/azure-functions-practical-guide) | Azure Functions 実務ガイド |
| [azure-communication-services-practical-guide](https://github.com/yeongseon/azure-communication-services-practical-guide) | Azure Communication Services 実務ガイド |
| [azure-container-apps-practical-guide](https://github.com/yeongseon/azure-container-apps-practical-guide) | Azure Container Apps 実務ガイド |
| [azure-kubernetes-service-practical-guide](https://github.com/yeongseon/azure-kubernetes-service-practical-guide) | Azure Kubernetes Service (AKS) 実務ガイド |
| [azure-architecture-practical-guide](https://github.com/yeongseon/azure-architecture-practical-guide) | Azure Architecture 実務ガイド |
| [azure-monitoring-practical-guide](https://github.com/yeongseon/azure-monitoring-practical-guide) | Azure Monitoring 実務ガイド |

## 免責事項

これは独立したコミュニティプロジェクトです。Microsoft との提携や承認を受けているものではありません。Azure および Azure Communication Services は Microsoft Corporation の商標です。

## ライセンス

[MIT](LICENSE)

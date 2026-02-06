# AI Assistant Guide (GEMINI.md)

このファイルは、AI アシスタント（Antigravity）が本プロジェクトで作業する際に参照すべき重要な背景とルールを記述したものです。

## 🚀 プロジェクトの重要事項

### 1. Prisma バージョンの固定 (v6.19.2)
- **重要**: 本プロジェクトでは Prisma を **v6.19.2** に固定しています。
- **理由**: Prisma 7 以降で導入された破壊的変更（`schema.prisma` のバリデーション強化等）により、デプロイ環境とローカル環境の不整合が発生するのを防ぐためです。
- **注意**: `npx prisma` を実行する際は、自動的に最新版が使われないよう、必ずプロジェクトローカルの `package.json` に基づくバージョンを使用させてください。

### 2. デプロイ構成 (Google Cloud)
- **ビルド環境**: すべて **Google Cloud Build** で実行します。ローカルでの Docker ビルド（Mac ARM）は、本番環境（x86_64）との互換性問題を引き起こすため避けてください。
- **自動化パイプライン**: `cloudbuild.yaml` がビルド、プッシュ、デプロイ、およびマイグレーション（Cloud Run Job）を統合管理しています。
- **DB 接続**: Cloud SQL への接続は Unix ソケットを使用します。`DATABASE_URL` には `host=/cloudsql/[INSTANCE_CONNECTION_NAME]` を含める必要があります。

### 3. ドキュメント構成
- プロジェクトの詳細な手順は `docs/` に集約されています。
  - `docs/local-development.md`: ローカル開発環境のセットアップ。
  - `docs/deploy-guide.md`: Google Cloud へのデプロイ手順。
  - `docs/functional-spec.md`: 機能仕様書。

## 🛠 AI 作業時のガイドライン

- **変更前の確認**: `cloudbuild.yaml` や `Dockerfile.prod` を変更する際は、Prisma 6 の固定設定が崩れないよう注意してください。
- **デプロイの推奨**: デプロイ作業が必要な場合は、既存の `cloudbuild.yaml` を活用することを提案してください。
- **言語設定**: コミュニケーションおよびドキュメント、コードコメントは原則として **日本語** で記述してください。
- **開発手法 (TDD)**: 今後の新機能追加やバグ修正は、必ず **TDD (テスト駆動開発)** のサイクル（Red-Green-Refactor）に従って進めてください。まずテストを書き、それが失敗することを確認してから実装を開始してください。

# AI Assistant Guide (GEMINI.md)

このファイルは、AI アシスタント（Antigravity）が本プロジェクトで作業する際に参照すべき重要な背景とルールを記述したものです。

## 🚀 プロジェクトの重要事項

### 1. Prisma 7 (ドライバーアダプター構成)
- **バージョン**: Prisma **v7.x** を使用しています。
- **ドライバーアダプター**: `@prisma/adapter-pg` + `pg` パッケージを使用して PostgreSQL に接続します。
- **Client 生成先**: `generated/prisma/` に出力（`node_modules` 外）。`@/generated/prisma` でインポートできます。
- **設定ファイル**: `prisma.config.ts` で `datasource.url` と `seed` コマンドを一元管理しています。
- **注意**: `schema.prisma` の `datasource` ブロックには `url` を記載しません（Prisma 7 の仕様）。

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

- **変更前の確認**: `cloudbuild.yaml` や `Dockerfile.prod` を変更する際は、Prisma 7 の構成（ドライバーアダプター、`generated/prisma` 出力先）が崩れないよう注意してください。
- **デプロイの推奨**: デプロイ作業が必要な場合は、既存の `cloudbuild.yaml` を活用することを提案してください。
- **言語設定**: コミュニケーションおよびドキュメント、コードコメントは原則として **日本語** で記述してください。
- **Git 操作の制限**: 作業完了時に自動で `git commit` や `git push` を行わないでください。変更内容はユーザーが確認した後、ユーザー自身で行うか、明示的な指示がある場合のみ実行してください。
- **開発手法 (TDD)**: 今後の新機能追加やバグ修正は、必ず **TDD (テスト駆動開発)** のサイクル（Red-Green-Refactor）に従って進めてください。まずテストを書き、それが失敗することを確認してから実装を開始してください。

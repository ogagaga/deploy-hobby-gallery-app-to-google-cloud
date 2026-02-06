# Google Cloud デプロイ手順書

このドキュメントでは、Hobby Gallery アプリケーションを Google Cloud (Cloud Run) にデプロイする手順を説明します。

## 1. 前提条件

- Google Cloud SDK (`gcloud`) がインストールされ、認証が完了していること。
- 対象プロジェクト (`dev-personal-yutaka-ogasawara`) への適切なアクセス権限があること。

## 2. デプロイフロー (自動化)

リポジトリのルートディレクトリにある `cloudbuild.yaml` を使用して、ビルド、デプロイ、マイグレーションを単一コマンドで実行します。

```bash
gcloud builds submit --config cloudbuild.yaml .
```

### 実行される内容:
1.  **ビルド**: `Dockerfile.prod` を使用して Docker イメージをビルド（x86_64 アーキテクチャ）。
2.  **プッシュ**: ビルドしたイメージを Artifact Registry へプッシュ。
3.  **デプロイ**: Cloud Run Service (`hobby-gallery`) を更新。
4.  **マイグレーション**: Cloud Run Job (`migration-job`) を実行し、DB スキーマを最新化。

## 3. 手動マイグレーション (必要な場合)

DB スキーマのみを更新したい場合は、作成済みの Cloud Run Job を直接実行します。

```bash
gcloud run jobs execute migration-job --region asia-northeast1 --wait
```

## 4. 環境変数とシークレット

本番環境の環境変数は主に Secret Manager で管理されています。

- `DATABASE_URL`: Cloud SQL への接続文字列。
- `NEXTAUTH_SECRET`: Auth.js 用のシークレット。
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google ログイン用。

これらを更新した場合は、Cloud Run Service の再デプロイまたはジョブ設定の更新が必要になります。

## 5. トラブルシューティング

- **500 エラーが発生する場合**:
  - `gcloud run services logs tail hobby-gallery` でログを確認してください。
  - データベース接続エラー（P1001/P1013）の場合は、シークレットのフォーマット（`host=/cloudsql/...`）が正しいか確認してください。
- **ビルドエラー**:
  - Prisma のバージョンが `package.json` で `6.19.2` に固定されていることを確認してください。

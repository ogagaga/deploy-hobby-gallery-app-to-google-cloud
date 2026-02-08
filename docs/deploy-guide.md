# Google Cloud デプロイ手順書

このドキュメントでは、Hobby Gallery アプリケーションを Google Cloud (Cloud Run) にデプロイする手順を説明します。

## 1. 前提条件

- Google Cloud SDK (`gcloud`) がインストールされ、認証が完了していること。
- 対象プロジェクトへの適切なアクセス権限があること。

## 2. デプロイフロー

本プロジェクトでは、**`main` ブランチにマージされたコードのみを本番環境へデプロイ**します。開発および検証は `develop` ブランチで行い、リリース準備が整った段階で `main` へマージしてください。

### デプロイの実行

リポジトリのルートディレクトリにある `cloudbuild.yaml` を使用して、ビルド、デプロイ、マイグレーションを単一コマンドで実行します。

```bash
# 1. develop から main へマージ（ローカルまたはプルリクエスト）
git checkout main
git merge develop
git push origin main

# 2. デプロイコマンドの実行（main ブランチから実行することを推奨）
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

## 6. リソースの停止と削除 (コスト削減・不要時)

コストを抑えるため、あるいはプロジェクトを終了する際にリソースを停止・削除する方法です。

### Cloud Run (サービス) の停止
Cloud Run はリクエストがない限り料金が発生しない（CPUを常時割り当てていない場合）ため、明示的な「停止」はありませんが、公開を止めたい場合は以下のいずれかを行います。

- **トラフィックを 0% にする**: 既存のリビジョンへのトラフィックを停止します。
- **サービスの削除**:
  ```bash
  gcloud run services delete hobby-gallery --region asia-northeast1
  ```

### Cloud SQL (データベース) の停止
Cloud SQL は実行中（起動中）に料金が発生します。一時的に止めたい場合は以下のコマンドを使用します。

- **停止**:
  ```bash
  gcloud sql instances patch hobby-gallery-db --activation-policy NEVER
  ```
- **起動 (再開)**:
  ```bash
  gcloud sql instances patch hobby-gallery-db --activation-policy ALWAYS
  ```
- **削除**:
  ```bash
  gcloud sql instances delete hobby-gallery-db
  ```

### Cloud Run Job の削除
```bash
gcloud run jobs delete migration-job --region asia-northeast1
```

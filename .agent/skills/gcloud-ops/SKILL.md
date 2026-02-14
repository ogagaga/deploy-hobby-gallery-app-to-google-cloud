---
name: gcloud-ops
description: Hobby Gallery プロジェクト向けの Google Cloud 操作 (Logging, Cloud Run, Storage) 支援コマンド集。
---

# Google Cloud 操作スキル

このスキルは、Hobby Gallery プロジェクトに関連する一般的な Google Cloud 操作のショートカットを提供します。

## Cloud Logging (ログ確認)

### 最近のエラーログを表示 (Cloud Run)
`hobby-gallery` サービスの直近20件のエラーログを表示します。

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=hobby-gallery AND severity>=ERROR" --limit=20 --format="table(timestamp,textPayload,resource.labels.revision_name)"
```

### 最近のシステムログを表示 (Cloud Run)
`hobby-gallery` サービスの直近20件のシステムログ (stdout/stderr) を表示します。

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=hobby-gallery" --limit=20 --format="table(timestamp,textPayload)"
```

## Cloud Run (サービス状態)

### サービスの詳細を確認
`hobby-gallery` サービスの完全な設定とステータスを取得します。

```bash
gcloud run services describe hobby-gallery --region asia-northeast1
```

### リビジョン一覧を表示
`hobby-gallery` サービスのリビジョン一覧を表示します。

```bash
gcloud run revisions list --service hobby-gallery --region asia-northeast1 --limit=10
```

## Cloud Storage (画像ストレージ)

### アップロード済み画像一覧
`dev-personal-yutaka-ogasawara-images` バケット (uploads ディレクトリ) 内のファイル一覧を表示します。

```bash
gsutil ls -l gs://dev-personal-yutaka-ogasawara-images/uploads/
```

---
description: Cloud Build を使用した本番環境へのデプロイ
---

# 本番環境デプロイ・ワークフロー

このワークフローは、Cloud Build を使用して `hobby-gallery` アプリケーションを Google Cloud Run へデプロイする手順をガイドします。

## 1. 事前確認

ローカル環境の状態を確認します。

### Git ステータスの確認
現在のブランチに未コミットの変更や、未プッシュのコミットがないか確認します。

// turbo
```bash
git status
```

> **注意**: 未コミットの変更がある場合は、続行する前にコミットするかスタッシュしてください。デプロイは通常、クリーンな状態から行うべきです。

## 2. デプロイの実行

Cloud Build の実行コマンドを発行します。これにより以下の処理が行われます：
1. Docker イメージのビルド (x86_64)
2. Artifact Registry へのプッシュ
3. Cloud Run へのデプロイ
4. データベースマイグレーションの実行

```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 3. デプロイ後の確認

ビルドが正常に完了したら、デプロイ状況を確認します。

### Cloud Run サービスのステータス確認

// turbo
```bash
gcloud run services describe hobby-gallery --region asia-northeast1 --format="value(status.url)"
```

> **アクション**: ブラウザで表示された URL を開き、アプリケーションが正しく動作していることを確認してください。

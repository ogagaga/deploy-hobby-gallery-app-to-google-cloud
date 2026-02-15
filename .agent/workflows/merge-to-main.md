---
description: develop → main へのマージとプロダクションデプロイ
---

# develop → main マージ＆デプロイ・ワークフロー

このワークフローは、`develop` ブランチの変更を `main` にマージし、本番環境へデプロイする一連の手順をガイドします。

## 1. develop ブランチの最終確認

### 現在のブランチとステータスを確認
// turbo
```bash
git checkout develop && git status
```

### テスト＆Lint を実行して品質を確認
```bash
npm run test && npm run lint
```

> **注意**: テストまたは Lint が失敗した場合は、修正してからマージを進めてください。

## 2. main ブランチへのマージ

### main を最新にしてから develop をマージ
```bash
git checkout main && git pull origin main && git merge develop
```

> **コンフリクトが発生した場合**: 手動で解決し、`git add .` → `git commit` してから続行してください。

## 3. リモートへプッシュ

```bash
git push origin main
```

## 4. 本番デプロイ（任意）

Cloud Build を使用してデプロイします。

```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 5. デプロイ後の確認

// turbo
```bash
gcloud run services describe hobby-gallery --region asia-northeast1 --format="value(status.url)"
```

> **アクション**: 表示された URL にアクセスし、アプリケーションが正常に動作していることを確認してください。

## 6. develop ブランチに戻る

// turbo
```bash
git checkout develop
```

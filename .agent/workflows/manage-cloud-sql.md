---
description: Cloud SQL (hobby-gallery-db) の管理 (起動/停止/状態確認)
---

# Cloud SQL 管理ワークフロー

開発コストを節約するために、Cloud SQL インスタンス `hobby-gallery-db` の状態を管理（起動・停止）します。

## 1. 現在のステータスを確認

まず、インスタンスの現在の状態を確認します。

// turbo
```bash
gcloud sql instances list --filter="name=hobby-gallery-db"
```

## 2. 操作を選択

上記の状態と目的に合わせて、以下のいずれかのアクションを選択・実行してください。

### オプション A: インスタンスを起動する (RUNNABLE にする)
インスタンスが停止 (STOPPED) しており、開発を開始したい場合に使用します。

// turbo
```bash
gcloud sql instances patch hobby-gallery-db --activation-policy ALWAYS
```

### オプション B: インスタンスを停止する (STOPPED にする)
開発が終了し、コストを節約したい場合に使用します。

// turbo
```bash
gcloud sql instances patch hobby-gallery-db --activation-policy NEVER
```

## 3. 結果を確認

インスタンスのステータスが期待通りに変更されたか確認します。

// turbo
```bash
gcloud sql instances list --filter="name=hobby-gallery-db"
```

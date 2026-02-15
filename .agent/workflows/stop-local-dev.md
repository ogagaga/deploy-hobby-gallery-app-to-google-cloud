---
description: ローカル開発環境の停止 (Next.js + Docker DB)
---

# ローカル開発環境停止ワークフロー

このワークフローは、起動中のローカル開発環境（Next.js 開発サーバーと Docker DB コンテナ）を停止します。

## 1. Next.js 開発サーバーの停止

実行中の開発サーバーのプロセスを停止します。

```bash
pkill -f "next dev" || echo "開発サーバーは起動していません"
```

## 2. Docker コンテナ (DB) の停止

// turbo
```bash
docker compose down
```

## 3. 停止確認

// turbo
```bash
docker ps --filter "name=deploy-hobby-gallery" --format "table {{.Names}}\t{{.Status}}" || echo "全コンテナ停止済み"
```

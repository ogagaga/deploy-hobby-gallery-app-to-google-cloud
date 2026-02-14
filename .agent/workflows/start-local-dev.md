---
description: ローカル開発環境の起動 (Docker DB + Next.js)
---

このワークフローは、ローカル開発環境をセットアップして起動します。
Docker でデータベースを起動し、Prisma マイグレーションを適用した後、Next.js 開発サーバーを立ち上げます。

1. Docker コンテナ (DB) の起動
   ```bash
   docker compose up -d db
   ```

2. DB 起動待機 (5秒) & マイグレーション適用
   ```bash
   sleep 5 && npx prisma migrate dev
   ```

3. 開発サーバーの起動
   ```bash
   npm run dev
   ```

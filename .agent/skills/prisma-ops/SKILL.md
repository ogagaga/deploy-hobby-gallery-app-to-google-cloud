---
name: prisma-ops
description: Prisma ORM の操作 (Studio, Migrate, Generate) 支援コマンド集。
---

# Prisma/DB 操作スキル

このスキルは、Prisma を使用したデータベース管理タスクを簡素化します。

> **注意**: これらのコマンドはプロジェクトルートで実行することを前提としています。

## Prisma Studio
データを閲覧・編集するための Prisma Studio GUI を起動します。

```bash
npx prisma studio
```

## Client の生成 (Generate)
Prisma Client を再生成します。スキーマを変更した後に実行してください。

```bash
npx prisma generate
```

## マイグレーション状況の確認
マイグレーションのステータスを確認します。

```bash
npx prisma migrate status
```

## データベースのリセット (開発用のみ)
**警告**: データベース内のすべてのデータが削除されます。開発環境でのリセット目的でのみ使用してください。

```bash
npx prisma migrate reset
```

# ローカル開発手順書

このドキュメントでは、Oga's Plastic Model Gallery アプリケーションをローカル環境（Mac）でセットアップし、起動する手順を説明します。

## 1. 前提条件

- Node.js (v20以上推奨)
- Docker Desktop (データベース用)
- npm

## 2. セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local.example` をコピーして `.env.local` を作成し、必要な値を設定してください。

```bash
cp .env.local.example .env.local
```

設定が必要な主な項目：
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google Cloud Console で取得した認証情報
- `AUTH_SECRET`: `npx auth secret` で生成したランダムな文字列
- `DATABASE_URL`: ローカル DB 用の接続文字列（デフォルトは Docker Compose 用に設定されています）

### 3. データベースの起動
Docker Compose を使用して、PostgreSQL を起動します。

```bash
docker compose up -d db
```

### 4. データベースの初期化 (Prisma)
スキーマをデータベースに反映し、クライアントを生成します。

```bash
npx prisma migrate dev
npx prisma generate
```

## 3. アプリケーションの起動

開発サーバーを起動します。

```bash
npm run dev
```

起動後、 [http://localhost:3000](http://localhost:3000) にアクセスして動作を確認してください。

## 4. 便利なコマンド

- **Prisma Studio (GUI でデータを確認)**:
  ```bash
  npx prisma studio
  ```
- **DB のリセット**:
  ```bash
  npx prisma migrate reset
  ```

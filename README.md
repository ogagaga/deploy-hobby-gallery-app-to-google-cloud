# Hobby Gallery

プラモデルや模型の完成品写真を管理・展示するためのモダンなギャラリーアプリケーションです。

## 🚀 プロジェクト概要

このアプリケーションは、モデラーが自身の作品を詳細な制作データ（キット名、使用塗料、制作期間など）と共に美しく展示できるように設計されています。Next.js と Prisma を基盤とし、Google Cloud 上で安定して動作します。

## 🛠 技術スタック

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (v6.19.2)
- **Authentication**: [Auth.js (NextAuth.js)](https://authjs.dev/)
- **Infrastructure**: [Google Cloud Run](https://cloud.google.com/run), [Cloud SQL](https://cloud.google.com/sql)
- **CI/CD**: [Google Cloud Build](https://cloud.google.com/build)

## 📖 ドキュメント

開発や運用に役立つ詳細なドキュメントは `docs/` ディレクトリに格納されています。

- **[ローカル開発手順書](./docs/local-development.md)**: Mac でのセットアップと起動方法。
- **[デプロイ手順書](./docs/deploy-guide.md)**: Google Cloud へのデプロイ・自動化・リソース管理について。
- **[機能仕様書](./docs/functional-spec.md)**: アプリケーションの画面遷移やデータモデルの仕様。

## 🚦 クイックスタート (ローカル)

詳細は [ローカル開発手順書](./docs/local-development.md) を参照してください。

1.  依存関係のインストール: `npm install`
2.  DB起動: `docker compose up -d db`
3.  DBマイグレーション: `npx prisma migrate dev`
4.  開発サーバー起動: `npm run dev`

---
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

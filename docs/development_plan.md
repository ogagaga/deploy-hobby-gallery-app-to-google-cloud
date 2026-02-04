# 開発計画・進捗管理 (development_plan.md)

## 1. 開発フェーズとタスク

### フェーズ1: 環境構築とベースの実装 [x]
- [x] 要件定義・開発計画の作成
- [x] Docker環境の構築 (Next.js, PostgreSQL)
- [x] Next.js (App Router) の初期セットアップ
- [x] Tailwind CSS + Shadcn UI の導入

### フェーズ2: 認証機能の実装 [x]
- [x] NextAuth.js (Auth.js) のセットアップ
- [x] Google Provider の設定
- [x] 管理者メールアドレスによるアクセス制限ロジックの実装

### フェーズ3: 作品投稿機能の実装 [/]
- [ ] データベーススキーマ設計 (Prisma/Drizzle等)
- [ ] 写真アップロード機能 (Local Storage保存)
- [ ] 投稿フォーム作成 (作品名、詳細、タグ等)

### フェーズ4: ギャラリー・閲覧機能の実装 [ ]
- [ ] トップページ（グリッド一覧）の実装
- [ ] フィルタリング・検索機能の実装
- [ ] 作品詳細ページの実装

### フェーズ5: ブラッシュアップ [ ]
- [ ] UI/UXの改善（アニメーション、レスポンシブ調整）
- [ ] バグ修正・動作検証

## 2. 技術スタックの確定
- **Framework**: Next.js (App Router, TypeScript)
- **Auth**: NextAuth.js (v5)
- **Style**: Tailwind CSS, Shadcn UI, Lucide React (Icons)
- **DB/ORM**: PostgreSQL, Prisma (または Drizzle)
- **Runtime**: Docker / Docker Compose

## 3. マイルストーン
- **Milestone 1**: 認証してログインし、自分専用のダッシュボードが表示されること
- **Milestone 2**: 写真をアップロードし、作品の基本情報を登録できること
- **Milestone 3**: 登録した作品がギャラリーに美しく表示されること

## 4. 進捗状況
- **開始日**: 2026-02-03
- **ステータス**: フェーズ1着手中

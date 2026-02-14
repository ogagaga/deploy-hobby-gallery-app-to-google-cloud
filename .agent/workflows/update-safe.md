---
description: 安全なライブラリ更新 (Update & Test)
---

このワークフローは、`package.json` の指定範囲内でライブラリを更新 (`npm update`) し、
その直後にテスト (`npm run test`) と Lint (`npm run lint`) を実行して安全性を確認します。

**Prisma のバージョン固定について**:
`package.json` で `prisma` と `@prisma/client` のバージョンが固定 ("6.19.2") されているため、
`npm update` を実行してもこれらのバージョンは勝手に上がりません。安心して実行してください。

1. ライブラリの更新
   ```bash
   npm update
   ```

2. テストとLintの実行 (安全性確認)
   // turbo
   ```bash
   npm run lint && npm run test
   ```

---
description: ライブラリ更新確認 (npm outdated)
---

このワークフローは、プロジェクト内の古くなったライブラリを確認します。
`Prisma` など、バージョン固定が必要なライブラリがある場合は注意してください。

1. 更新確認の実行
   ```bash
   npm outdated || true
   ```
   (exit code 1 が返ってもエラーにしないため `|| true` を付与しています)

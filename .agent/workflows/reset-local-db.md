---
description: ローカルDBのリセットと初期化
---

このワークフローは、ローカルデータベースを完全にリセットし、初期データを投入 (Seed) します。
**注意**: ローカルDBのデータはすべて消去されます。

1. DB リセット (確認なしで実行)
   ```bash
   npx prisma migrate reset --force
   ```

2. シードデータの投入確認 (Studio起動)
   Studio が起動したら、データが入っているか確認してください。確認後は `Ctrl+C` で終了してください。
   ```bash
   npx prisma studio
   ```

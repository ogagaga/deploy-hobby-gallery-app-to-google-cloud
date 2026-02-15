---
description: 新しいフィーチャーブランチの作成
---

# フィーチャーブランチ作成ワークフロー

このワークフローは、`develop` ブランチから新しい作業用ブランチを作成する手順をガイドします。

## 1. develop ブランチを最新に更新

// turbo
```bash
git checkout develop && git pull origin develop
```

## 2. 新しいブランチを作成

> **命名規則**:
> - 新機能: `feature/<機能名>` (例: `feature/add-search`)
> - バグ修正: `fix/<修正内容>` (例: `fix/image-upload-error`)
> - メンテナンス: `chore/<内容>` (例: `chore/update-node-v22`)

ユーザーにブランチ名を確認してから以下を実行してください。

```bash
git checkout -b <ブランチ名>
```

## 3. 作業の確認

// turbo
```bash
git branch --show-current
```

> ブランチが正しく作成されたことを確認し、作業を開始してください。

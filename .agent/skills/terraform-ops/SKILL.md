---
name: terraform-ops
description: Terraform によるインフラ構成管理・操作ガイド
---

# Terraform Ops Skill

このスキルは、Terraform を使用して Google Cloud インフラストラクチャを管理するための手順とコマンドを提供します。

## 前提条件
- `terraform` コマンドがインストールされていること。
- Google Cloud の認証が完了していること (`gcloud auth application-default login`)。
- 作業ディレクトリ: `terraform/`

## 利用可能な操作

### 1. コードの整形と検証
作業を開始する前や、コミットする前に必ず実行してください。

```bash
# フォーマット整形
terraform fmt -recursive

# 文法チェック
terraform validate
```

### 2. 変更計画の確認 (Plan)
インフラに変更を加える前に、どのような影響があるかを確認します。

```bash
terraform plan
```
**注意**: 出力内容をよく確認し、意図しないリソースの削除や変更が含まれていないかチェックしてください。

### 3. 変更の適用 (Apply)
確認した変更計画を実際に適用します。

```bash
terraform apply
```
**重要**: 実行時に `Execute?` と聞かれたら `yes` と入力する必要があります。

### 4. リソースの確認 (Show/State)
現在の状態や管理されているリソースを確認します。

```bash
# 現在の状態を表示
terraform show

# 管理リソース一覧を表示
terraform state list
```

## ベストプラクティス
- **state ファイル**: `terraform.tfstate` はローカルで管理されています（現状の構成）。チーム開発に移行する場合は GCS バックエンドへの移行を検討してください。
- **機密情報**: `secrets.tf` などで機密情報を扱う場合は、Git にコミットしないよう注意してください（`.gitignore` を確認）。

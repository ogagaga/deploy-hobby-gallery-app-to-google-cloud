resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro" # 最小構成

    ip_configuration {
      ipv4_enabled = true
    }
  }

  deletion_protection = false # 学習・デモ用のため無効
}

resource "google_sql_database" "database" {
  name     = var.app_name
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "admin" {
  name     = "admin"
  instance = google_sql_database_instance.main.name
  password = "password_replace_with_secret" # 後ほど Secret Manager 連携
}

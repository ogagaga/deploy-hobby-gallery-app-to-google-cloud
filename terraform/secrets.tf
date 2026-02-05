resource "google_secret_manager_secret" "database_url" {
  secret_id = "DATABASE_URL"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "nextauth_secret" {
  secret_id = "NEXTAUTH_SECRET"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "admin_email" {
  secret_id = "ADMIN_EMAIL"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "auth_google_id" {
  secret_id = "AUTH_GOOGLE_ID"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "auth_google_secret" {
  secret_id = "AUTH_GOOGLE_SECRET"
  replication {
    auto {}
  }
}

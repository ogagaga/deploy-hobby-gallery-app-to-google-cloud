resource "google_cloud_run_v2_service" "app" {
  name     = var.app_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.app_sa.email

    containers {
      image = "asia-northeast1-docker.pkg.dev/dev-personal-yutaka-ogasawara/hobby-gallery/web:latest"

      env {
        name  = "NEXTAUTH_URL"
        value = "https://hobby-gallery-586566698809.asia-northeast1.run.app"
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.id
            version = "latest"
          }
        }
      }
      
      env {
        name = "NEXTAUTH_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.nextauth_secret.id
            version = "latest"
          }
        }
      }

      env {
        name  = "AUTH_TRUST_HOST"
        value = "true"
      }

      env {
        name = "AUTH_GOOGLE_ID"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.auth_google_id.id
            version = "latest"
          }
        }
      }

      env {
        name = "AUTH_GOOGLE_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.auth_google_secret.id
            version = "latest"
          }
        }
      }

      env {
        name = "ADMIN_EMAIL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.admin_email.id
            version = "latest"
          }
        }
      }

      env {
        name  = "GCS_BUCKET_NAME"
        value = google_storage_bucket.images.name
      }

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "1024Mi"
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }

    # Cloud SQL 接続設定
    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.main.connection_name]
      }
    }
  }
}

# インターネットからのアクセス許可
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = var.app_name
  description   = "Docker repository for Hobby Gallery app"
  format        = "DOCKER"
}

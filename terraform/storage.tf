resource "google_storage_bucket" "images" {
  name     = "${var.project_id}-images"
  location = var.region
  
  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# 公開読み取り権限（すべてのユーザーに画像閲覧を許可）
resource "google_storage_bucket_iam_member" "public_viewer" {
  bucket = google_storage_bucket.images.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

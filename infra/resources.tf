resource "cloudflare_workers_kv_namespace" "client_data" {
  account_id = var.cloudflare_account_id
  title      = "autosao-client-data"
}

resource "cloudflare_workers_kv_namespace" "scan_cache" {
  account_id = var.cloudflare_account_id
  title      = "autosao-scan-cache"
}

resource "cloudflare_d1_database" "analytics" {
  account_id = var.cloudflare_account_id
  name       = "autosao-analytics"
}
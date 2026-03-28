terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  normalized_target_url = trimspace(var.target_url)
  target_host           = trimsuffix(replace(replace(local.normalized_target_url, "https://", ""), "http://", ""), "/")
  target_record_name    = var.target_record_name != "" ? var.target_record_name : var.project_name
  should_manage_domain  = var.manage_custom_domain && local.target_host != ""
}

resource "cloudflare_pages_project" "site" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  build_config {
    build_command   = "npm run build"
    destination_dir = "dist"
  }
}

resource "cloudflare_record" "target_cname" {
  count   = local.should_manage_domain ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = local.target_record_name
  content = cloudflare_pages_project.site.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
  allow_overwrite = true
}

resource "cloudflare_pages_domain" "target_domain" {
  count        = local.should_manage_domain ? 1 : 0
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.site.name
  domain       = local.target_host

  depends_on = [cloudflare_record.target_cname]
}

output "pages_project_name" {
  value = cloudflare_pages_project.site.name
}

output "pages_subdomain" {
  value = cloudflare_pages_project.site.subdomain
}

output "effective_target_url" {
  value = local.normalized_target_url != "" ? local.normalized_target_url : "https://${cloudflare_pages_project.site.subdomain}"
}

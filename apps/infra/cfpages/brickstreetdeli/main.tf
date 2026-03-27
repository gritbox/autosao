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

resource "cloudflare_pages_project" "brickstreetdeli" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  build_config {
    build_command   = "npm run build"
    destination_dir = "dist"
  }
}

resource "cloudflare_record" "brickstreetdeli_cname" {
  zone_id = var.cloudflare_zone_id
  name    = "brickstreetdeli"
  content = cloudflare_pages_project.brickstreetdeli.subdomain
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_pages_domain" "brickstreetdeli" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.brickstreetdeli.name
  domain       = "brickstreetdeli.autosao.com"

  depends_on = [cloudflare_record.brickstreetdeli_cname]
}

output "pages_project_name" {
  value = cloudflare_pages_project.brickstreetdeli.name
}

output "pages_subdomain" {
  value = cloudflare_pages_project.brickstreetdeli.subdomain
}

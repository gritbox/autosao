variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "project_name" {
  type    = string
  default = "brickstreetdeli"
}

variable "production_branch" {
  type    = string
  default = "main"
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_zone_id" {
  type    = string
  default = ""

  validation {
    condition     = !var.manage_custom_domain || var.cloudflare_zone_id != ""
    error_message = "cloudflare_zone_id is required when manage_custom_domain is true."
  }
}

variable "project_name" {
  type = string
}

variable "production_branch" {
  type    = string
  default = "main"
}

variable "target_url" {
  type    = string
  default = ""

  validation {
    condition     = !var.manage_custom_domain || var.target_url != ""
    error_message = "target_url is required when manage_custom_domain is true."
  }
}

variable "manage_custom_domain" {
  type    = bool
  default = false
}

variable "target_record_name" {
  type    = string
  default = ""
}

#!/bin/bash
set -euo pipefail

PROJECT_NAME="${PROJECT_NAME:-}"
OUTPUT_BASE="${OUTPUT_BASE:-}"
WORK_DIR="${WORK_DIR:-}"
DIST_DIR="${DIST_DIR:-}"
TARGET_URL="${TARGET_URL:-}"
PRODUCTION_BRANCH="${PRODUCTION_BRANCH:-main}"
MANAGE_CUSTOM_DOMAIN="${MANAGE_CUSTOM_DOMAIN:-false}"
TARGET_RECORD_NAME="${TARGET_RECORD_NAME:-}"

if [ -z "$PROJECT_NAME" ]; then
  echo "[FAIL] PROJECT_NAME is required." >&2
  exit 1
fi

if [ -z "$WORK_DIR" ] && [ -n "$OUTPUT_BASE" ]; then
  WORK_DIR="${OUTPUT_BASE%/}/${PROJECT_NAME}"
fi

if [ -z "$WORK_DIR" ]; then
  echo "[FAIL] WORK_DIR is required (or set OUTPUT_BASE and PROJECT_NAME)." >&2
  exit 1
fi

if [ -z "$DIST_DIR" ]; then
  DIST_DIR="${WORK_DIR%/}/dist"
fi

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "[FAIL] CLOUDFLARE_API_TOKEN is required." >&2
  exit 1
fi

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "[FAIL] CLOUDFLARE_ACCOUNT_ID is required." >&2
  exit 1
fi

if [ "$MANAGE_CUSTOM_DOMAIN" = "true" ]; then
  if [ -z "$TARGET_URL" ]; then
    echo "[FAIL] TARGET_URL is required when MANAGE_CUSTOM_DOMAIN=true." >&2
    exit 1
  fi
  if [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
    echo "[FAIL] CLOUDFLARE_ZONE_ID is required when MANAGE_CUSTOM_DOMAIN=true." >&2
    exit 1
  fi
fi

if [ -z "$TARGET_URL" ]; then
  TARGET_URL="https://${PROJECT_NAME}.pages.dev"
fi

echo "[CHECK] Verifying wrangler authentication..."
wrangler whoami || { echo "[FAIL] Wrangler not authenticated."; exit 1; }

echo "[CHECK] Verifying build output at $DIST_DIR..."
[ -d "$DIST_DIR" ] || { echo "[FAIL] dist/ not found."; exit 1; }
[ -f "$DIST_DIR/index.html" ] || { echo "[FAIL] dist/index.html missing."; exit 1; }

TF_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$TF_DIR"

echo "[INFRA] Running terraform..."
export TF_VAR_project_name="$PROJECT_NAME"
export TF_VAR_production_branch="$PRODUCTION_BRANCH"
export TF_VAR_target_url="$TARGET_URL"
export TF_VAR_manage_custom_domain="$MANAGE_CUSTOM_DOMAIN"
export TF_VAR_cloudflare_api_token="$CLOUDFLARE_API_TOKEN"
export TF_VAR_cloudflare_account_id="$CLOUDFLARE_ACCOUNT_ID"

if [ -n "${CLOUDFLARE_ZONE_ID:-}" ]; then
  export TF_VAR_cloudflare_zone_id="$CLOUDFLARE_ZONE_ID"
fi

if [ -n "$TARGET_RECORD_NAME" ]; then
  export TF_VAR_target_record_name="$TARGET_RECORD_NAME"
fi

terraform init
terraform apply -auto-approve

echo "[DEPLOY] Deploying to Cloudflare Pages..."
wrangler pages deploy "$DIST_DIR" --project-name="$PROJECT_NAME" --branch="$PRODUCTION_BRANCH"

echo "[DONE] Deployment complete."

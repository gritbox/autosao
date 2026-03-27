#!/bin/bash
set -e
DIST_DIR="/Users/wm/Code/GRITBOX_GH/autosao/apps/base44tf/transformed/dist"
PROJECT_NAME="brickstreetdeli"

echo "[CHECK] Verifying wrangler authentication..."
wrangler whoami || { echo "[FAIL] Wrangler not authenticated."; exit 1; }

echo "[CHECK] Verifying build output at $DIST_DIR..."
[ -d "$DIST_DIR" ] || { echo "[FAIL] dist/ not found."; exit 1; }
[ -f "$DIST_DIR/index.html" ] || { echo "[FAIL] dist/index.html missing."; exit 1; }

echo "[INFRA] Running terraform..."
terraform init
terraform apply -auto-approve

echo "[DEPLOY] Deploying to Cloudflare Pages..."
wrangler pages deploy "$DIST_DIR" --project-name="$PROJECT_NAME" --branch=main

echo "[DONE] Deployment complete."

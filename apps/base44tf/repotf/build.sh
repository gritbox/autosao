#!/bin/bash
set -e

WORK_DIR="${WORK_DIR:-/Users/wm/Code/GRITBOX_GH/autosao/apps/base44tf/transformed}"

echo "=== build.sh ==="
echo "Working directory: $WORK_DIR"

cd "$WORK_DIR"

echo "[build.sh] Running npm install..."
npm install

echo "[build.sh] Running npm run build..."
npm run build

echo "=== build.sh DONE ==="

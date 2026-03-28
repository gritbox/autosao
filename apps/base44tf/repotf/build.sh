#!/bin/bash
set -euo pipefail

PROJECT_NAME="${PROJECT_NAME:-}"
OUTPUT_BASE="${OUTPUT_BASE:-}"
WORK_DIR="${WORK_DIR:-}"

if [ -z "$WORK_DIR" ] && [ -n "$PROJECT_NAME" ] && [ -n "$OUTPUT_BASE" ]; then
  WORK_DIR="${OUTPUT_BASE%/}/${PROJECT_NAME}"
fi

if [ -z "$WORK_DIR" ]; then
  echo "[FAIL] WORK_DIR is required (or set PROJECT_NAME and OUTPUT_BASE)." >&2
  exit 1
fi

[ -d "$WORK_DIR" ] || { echo "[FAIL] WORK_DIR does not exist: $WORK_DIR" >&2; exit 1; }

echo "=== build.sh ==="
echo "Working directory: $WORK_DIR"

cd "$WORK_DIR"

echo "[build.sh] Running npm install..."
npm install

echo "[build.sh] Running npm run build..."
npm run build

echo "=== build.sh DONE ==="

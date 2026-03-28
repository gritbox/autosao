#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

SOURCE_PATH="${SOURCE_PATH:-}"
OUTPUT_BASE="${OUTPUT_BASE:-$REPO_ROOT/sites}"
PROJECT_NAME="${PROJECT_NAME:-}"
TARGET_URL="${TARGET_URL:-}"
WORK_DIR="${WORK_DIR:-}"

if [ -z "$SOURCE_PATH" ]; then
  echo "[FAIL] SOURCE_PATH is required." >&2
  exit 1
fi

[ -d "$SOURCE_PATH" ] || { echo "[FAIL] SOURCE_PATH does not exist: $SOURCE_PATH" >&2; exit 1; }

if [ -z "$PROJECT_NAME" ]; then
  PROJECT_NAME="$(basename "$SOURCE_PATH")"
fi

if [ -z "$TARGET_URL" ]; then
  TARGET_URL="https://${PROJECT_NAME}.pages.dev"
fi

if [ -z "$WORK_DIR" ]; then
  WORK_DIR="${OUTPUT_BASE%/}/${PROJECT_NAME}"
fi

export SOURCE_PATH OUTPUT_BASE PROJECT_NAME TARGET_URL WORK_DIR

echo "========================================"
echo "  transform.sh — Base44 Repo Transform"
echo "========================================"
echo "Project: $PROJECT_NAME"
echo "Target:  $TARGET_URL"
echo "Source:  $SOURCE_PATH"
echo "Output:  $OUTPUT_BASE"
echo "Working: $WORK_DIR"
echo "Scripts: $SCRIPT_DIR"
echo "========================================"

# ─── Step 1: Copy source → working directory ────────────────────────────────
echo ""
echo "[Step 1/5] Copying source to working directory..."
mkdir -p "$OUTPUT_BASE"
if [ -d "$WORK_DIR" ]; then
  rm -rf "$WORK_DIR"
fi
mkdir -p "$WORK_DIR"
cp -R "$SOURCE_PATH"/. "$WORK_DIR"/
# Remove node_modules if copied
rm -rf "$WORK_DIR/node_modules"
rm -rf "$WORK_DIR/.git"
echo "[Step 1/5] DONE"

# ─── Step 2: Strip Base44 dependencies ──────────────────────────────────────
echo ""
echo "[Step 2/5] Running strip_base44.js..."
if ! node "$SCRIPT_DIR/strip_base44.js"; then
  echo "[FAIL] strip_base44.js: see output above"
  exit 1
fi
echo "[Step 2/5] DONE"

# ─── Step 3: Fetch external assets ──────────────────────────────────────────
echo ""
echo "[Step 3/5] Running fetch_assets.js..."
if ! node "$SCRIPT_DIR/fetch_assets.js"; then
  echo "[FAIL] fetch_assets.js: see output above"
  exit 1
fi
echo "[Step 3/5] DONE"

# ─── Step 4: Flag remaining externals ───────────────────────────────────────
echo ""
echo "[Step 4/5] Running flag_externals.js..."
if ! node "$SCRIPT_DIR/flag_externals.js"; then
  echo "[FAIL] flag_externals.js: see output above"
  exit 1
fi
echo "[Step 4/5] DONE"

# ─── Step 5: Build ──────────────────────────────────────────────────────────
echo ""
echo "[Step 5/5] Running build.sh..."
if ! bash "$SCRIPT_DIR/build.sh"; then
  echo "[FAIL] build.sh: see output above"
  exit 1
fi
echo "[Step 5/5] DONE"

echo ""
echo "========================================"
echo "  transform.sh COMPLETE"
echo "========================================"

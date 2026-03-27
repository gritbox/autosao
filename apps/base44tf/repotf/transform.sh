#!/bin/bash
set -e

# ─── Configurable paths ─────────────────────────────────────────────────────
SOURCE_DIR="${SOURCE_DIR:-/Users/wm/Code/GRITBOX_GH/autosao/apps/base44tf/sampleRepo/repo}"
WORK_DIR="${WORK_DIR:-/Users/wm/Code/GRITBOX_GH/autosao/apps/base44tf/transformed}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

export WORK_DIR  # propagate to child scripts

echo "========================================"
echo "  transform.sh — Base44 Repo Transform"
echo "========================================"
echo "Source:  $SOURCE_DIR"
echo "Working: $WORK_DIR"
echo "Scripts: $SCRIPT_DIR"
echo "========================================"

# ─── Step 1: Copy source → working directory ────────────────────────────────
echo ""
echo "[Step 1/5] Copying source to working directory..."
if [ -d "$WORK_DIR" ]; then
  rm -rf "$WORK_DIR"
fi
cp -R "$SOURCE_DIR" "$WORK_DIR"
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

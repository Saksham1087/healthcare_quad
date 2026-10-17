#!/usr/bin/env bash
# Sync fork with upstream Saksham1087/healthcare.
# Merges new upstream commits into main, then pushes to fork and origin.
# No-ops while upstream is empty.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

if ! git fetch upstream 2>/dev/null; then
  echo "upstream fetch failed - check network/access"; exit 1
fi

if ! git rev-parse --verify upstream/main >/dev/null 2>&1; then
  echo "upstream/main does not exist yet (upstream is empty) - nothing to sync"
  exit 0
fi

if git rev-list --count "main..upstream/main" | grep -q '^0$'; then
  echo "already in sync with upstream"
  exit 0
fi

echo "merging upstream/main into main..."
git merge upstream/main --no-edit
git push fork main
git push origin main
echo "synced: main now at $(git rev-parse --short HEAD)"

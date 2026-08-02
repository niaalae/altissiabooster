#!/usr/bin/env bash
set -euo pipefail

# session-keeper launcher
# Installs every dependency needed, then runs session_keeper.py forever.
# Works on Debian/Ubuntu and GitHub Actions (ubuntu-latest).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[$(date)] === session-keeper launcher ==="

# 1. Install system packages (apt-based systems: local + GitHub Actions)
if command -v apt-get >/dev/null 2>&1; then
  echo "[$(date)] installing system packages (python3, chromium)..."
  sudo apt-get update -qq
  sudo apt-get install -y -qq python3 python3-pip python3-venv curl
  if ! command -v chromium >/dev/null 2>&1 && ! command -v chromium-browser >/dev/null 2>&1 && ! command -v google-chrome >/dev/null 2>&1; then
    sudo apt-get install -y -qq chromium
  fi
fi

# 2. Python venv + playwright
echo "[$(date)] setting up python venv + playwright..."
VENV_DIR="$SCRIPT_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi
"$VENV_DIR/bin/pip" install -q --upgrade pip
"$VENV_DIR/bin/pip" install -q playwright pynacl

# 3. Make sure a browser binary exists, then point config.json at it
BROWSER=""
for cand in chromium chromium-browser google-chrome google-chrome-stable; do
  if command -v "$cand" >/dev/null 2>&1; then
    BROWSER="$(command -v "$cand")"
    break
  fi
done

if [ -n "$BROWSER" ]; then
  echo "[$(date)] using browser: $BROWSER"
  "$VENV_DIR/bin/python" - "$BROWSER" <<'PYEOF'
import json, sys
from pathlib import Path
cfg_path = Path("config.json")
cfg = json.loads(cfg_path.read_text())
cfg["executable_path"] = sys.argv[1]
cfg_path.write_text(json.dumps(cfg, indent=2))
PYEOF
else
  echo "[$(date)] no system chromium found, installing playwright's bundled chromium..."
  "$VENV_DIR/bin/playwright" install chromium --with-deps
  "$VENV_DIR/bin/python" - <<'PYEOF'
import json
from pathlib import Path
cfg_path = Path("config.json")
cfg = json.loads(cfg_path.read_text())
cfg["executable_path"] = ""
cfg_path.write_text(json.dumps(cfg, indent=2))
PYEOF
fi

# 4. Run the keeper for one segment (5h50m, under the 6h job cap).
#    The keeper auto re-exports live cookies each cycle; the workflow
#    uploads the fresh file back to the GH secret afterwards.
echo "[$(date)] entering keep-alive segment (5h50m)..."
timeout 21000 "$VENV_DIR/bin/python" "$SCRIPT_DIR/session_keeper.py" || true
echo "[$(date)] segment ended, handing over to next job"

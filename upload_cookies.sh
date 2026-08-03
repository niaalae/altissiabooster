#!/usr/bin/env bash
set -euo pipefail

# Re-encrypts session-keeper/cookies-v0-app.txt (freshly re-exported by the
# keeper) and uploads it back to the COOKIES_B64 GitHub Actions secret, so the
# next 6h segment starts with live cookies. Requires: GH_PAT secret (PAT with
# repo scope + secrets write) and a python3 venv with pynacl.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COOKIE_FILE="${COOKIE_FILE:-$SCRIPT_DIR/session-keeper/cookies-v0-app.txt}"
SECRET_NAME="${SECRET_NAME:-COOKIES_B64}"
REPO="${GITHUB_REPOSITORY:-niaalae/altissiabooster}"

if [ -z "${GH_PAT:-}" ]; then
  echo "[$(date)] GH_PAT not set - skipping cookie secret upload"
  exit 0
fi

VENV_DIR="$SCRIPT_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
  "$VENV_DIR/bin/pip" install -q pynacl
fi

"$VENV_DIR/bin/python" - "$COOKIE_FILE" "$SECRET_NAME" "$REPO" "$GH_PAT" <<'PYEOF'
import base64, json, os, sys, urllib.request
from nacl.public import PublicKey, SealedBox

cookie_file, secret_name, repo, token = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

with open(cookie_file, "rb") as f:
    secret_value = base64.b64encode(f.read()).decode()

def api(path, method="GET", data=None):
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}{path}",
        headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"},
        data=json.dumps(data).encode() if data else None, method=method)
    return json.load(urllib.request.urlopen(req))

key_resp = api("/actions/secrets/public-key")
pubkey = PublicKey(base64.b64decode(key_resp["key"]))
encrypted = base64.b64encode(SealedBox(pubkey).encrypt(secret_value.encode())).decode()

req = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}",
    data=json.dumps({"encrypted_value": encrypted, "key_id": key_resp["key_id"]}).encode(),
    headers={"Authorization": f"token {token}", "Accept": "application/vnd.github+json"},
    method="PUT")
status = urllib.request.urlopen(req).status
print(f"[{__import__('datetime').datetime.now()}] cookie secret {secret_name} refreshed: {status}")
PYEOF

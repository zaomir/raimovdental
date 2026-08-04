#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

DOMAIN="${RAIMOV_STAGE_A_DOMAIN:-raimovdental.com}"
PROD_HOST="${RAIMOV_STAGE_A_HOST:-213.155.28.121}"
REMOTE_BASE="${RAIMOV_STAGE_A_WEBROOT:-/var/www/raimovdental-stage-a}"
SSH_USER="${EVO_SSH_USER:-root}"
KEY="${DEPLOY_KEY:-${EVO_SSH_KEY:-}}"
SOURCE_SHA="$(git rev-parse HEAD)"
RELEASE_ID="${SOURCE_SHA:0:12}"
PACKAGE_RELATIVE="artifacts/raimov-stage-a-preview/package"
PACKAGE_DIR="$ROOT/$PACKAGE_RELATIVE"
KEY_FILE=""

cleanup_local() {
  rm -rf "$PACKAGE_DIR"
  if [[ -n "$KEY_FILE" ]]; then
    rm -f "$KEY_FILE"
  fi
}
trap cleanup_local EXIT

if [[ -z "$KEY" ]]; then
  echo "BLOCKER: DEPLOY_KEY and EVO_SSH_KEY are empty" >&2
  exit 20
fi

node scripts/raimov/package-stage-a-preview.mjs "$PACKAGE_RELATIVE"
test -f "$PACKAGE_DIR/stage-a/index.html"
test -f "$PACKAGE_DIR/stage-a/stage-a.css"
test -f "$PACKAGE_DIR/stage-a/assets/atabek-portrait.jpg"
test -f "$PACKAGE_DIR/preview-manifest.json"

KEY_FILE="$(mktemp)"
printf '%s\n' "$KEY" > "$KEY_FILE"
chmod 600 "$KEY_FILE"
mkdir -p "$HOME/.ssh"
ssh-keyscan -H "$PROD_HOST" >> "$HOME/.ssh/known_hosts" 2>/dev/null || true

SSH=(ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no -o BatchMode=yes)
RSYNC_RSH="ssh -i $KEY_FILE -o StrictHostKeyChecking=no -o BatchMode=yes"
REMOTE_RELEASE="$REMOTE_BASE/releases/$RELEASE_ID"

"${SSH[@]}" "$SSH_USER@$PROD_HOST" \
  "set -e; mkdir -p '$REMOTE_RELEASE' '$REMOTE_BASE/releases' '$REMOTE_BASE/backups'"

rsync -az --delete \
  -e "$RSYNC_RSH" \
  "$PACKAGE_DIR/" "$SSH_USER@$PROD_HOST:$REMOTE_RELEASE/"

"${SSH[@]}" "$SSH_USER@$PROD_HOST" \
  "DOMAIN='$DOMAIN' PROD_IP='$PROD_HOST' REMOTE_BASE='$REMOTE_BASE' RELEASE_ID='$RELEASE_ID' SOURCE_SHA='$SOURCE_SHA' bash -s" <<'REMOTE'
set -Eeuo pipefail

CURRENT="$REMOTE_BASE/current"
RELEASE_DIR="$REMOTE_BASE/releases/$RELEASE_ID"
SNIPPET="/etc/nginx/snippets/raimov-stage-a-preview.conf"
HTPASSWD="/etc/nginx/.htpasswd-raimov-stage-a"
CREDENTIALS="/root/raimov-stage-a-preview.credentials"
DEPLOY_RECORD="$REMOTE_BASE/LAST_DEPLOY.json"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="$REMOTE_BASE/backups/${TIMESTAMP}-${RELEASE_ID}"
MARKER_BEGIN="# BEGIN RAIMOV_STAGE_A_PREVIEW"
MARKER_END="# END RAIMOV_STAGE_A_PREVIEW"

reload_nginx() {
  if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx; then
    systemctl reload nginx
  else
    local master_pid
    master_pid="$(pgrep -xo nginx)"
    kill -HUP "$master_pid"
  fi
}

select_active_config() {
  local nginx_dump
  nginx_dump="$(mktemp)"
  if ! nginx -T >"$nginx_dump" 2>&1; then
    cat "$nginx_dump" >&2
    rm -f "$nginx_dump"
    return 1
  fi

  python3 - "$nginx_dump" <<'PYCONFIG'
from pathlib import Path
import re
import sys

text = Path(sys.argv[1]).read_text(errors='replace')
parts = re.split(r'^# configuration file (.+?):\n', text, flags=re.MULTILINE)

for index in range(1, len(parts), 2):
    config_path = parts[index]
    body = parts[index + 1]
    if not re.search(r'listen\s+[^;\n]*443[^;\n]*ssl\s*;', body):
        continue
    if not re.search(r'server_name\s+[^;]*\braimovdental\.com\b[^;]*;', body):
        continue
    if not re.search(r'^\s*root\s+/var/www/raimovdental\.com;\s*$', body, re.MULTILINE):
        continue
    print(config_path)
    raise SystemExit(0)

raise SystemExit(1)
PYCONFIG
  local status=$?
  rm -f "$nginx_dump"
  return "$status"
}

ACTIVE_CONFIG="$(select_active_config)" || {
  echo "BLOCKER: active HTTPS vhost for $DOMAIN was not found in nginx -T" >&2
  exit 31
}
echo "active_config=$ACTIVE_CONFIG"

mkdir -p "$BACKUP_DIR" "$(dirname "$SNIPPET")"
cp -a "$ACTIVE_CONFIG" "$BACKUP_DIR/vhost.conf"
[[ -f "$SNIPPET" ]] && cp -a "$SNIPPET" "$BACKUP_DIR/snippet.conf" || true
[[ -f "$HTPASSWD" ]] && cp -a "$HTPASSWD" "$BACKUP_DIR/htpasswd" || true
[[ -f "$CREDENTIALS" ]] && cp -a "$CREDENTIALS" "$BACKUP_DIR/credentials" || true
PREVIOUS_TARGET="$(readlink -f "$CURRENT" 2>/dev/null || true)"
printf '%s' "$PREVIOUS_TARGET" > "$BACKUP_DIR/previous-target"

rollback() {
  trap - EXIT
  echo "RAIMOV_STAGE_A_PREVIEW_ROLLBACK backup=$BACKUP_DIR" >&2
  cp -a "$BACKUP_DIR/vhost.conf" "$ACTIVE_CONFIG"

  if [[ -f "$BACKUP_DIR/snippet.conf" ]]; then
    cp -a "$BACKUP_DIR/snippet.conf" "$SNIPPET"
  else
    rm -f "$SNIPPET"
  fi

  if [[ -f "$BACKUP_DIR/htpasswd" ]]; then
    cp -a "$BACKUP_DIR/htpasswd" "$HTPASSWD"
  else
    rm -f "$HTPASSWD"
  fi

  if [[ -f "$BACKUP_DIR/credentials" ]]; then
    cp -a "$BACKUP_DIR/credentials" "$CREDENTIALS"
  else
    rm -f "$CREDENTIALS"
  fi

  if [[ -n "$PREVIOUS_TARGET" && -d "$PREVIOUS_TARGET" ]]; then
    ln -sfn "$PREVIOUS_TARGET" "${CURRENT}.rollback"
    mv -Tf "${CURRENT}.rollback" "$CURRENT"
  else
    rm -f "$CURRENT"
  fi

  nginx -t
  reload_nginx
}

trap 'rc=$?; if [[ $rc -ne 0 ]]; then rollback || true; fi; exit $rc' EXIT

test -f "$RELEASE_DIR/stage-a/index.html"
test -f "$RELEASE_DIR/stage-a/stage-a.css"
test -f "$RELEASE_DIR/stage-a/assets/atabek-portrait.jpg"
test -f "$RELEASE_DIR/preview-manifest.json"
grep -q 'noindex,nofollow,noarchive,nosnippet' "$RELEASE_DIR/stage-a/index.html"
grep -q 'Стратегия Дмитрия' "$RELEASE_DIR/stage-a/index.html"

if [[ ! -s "$HTPASSWD" || ! -s "$CREDENTIALS" ]]; then
  PREVIEW_USER="raimov"
  PREVIEW_PASS="$(openssl rand -hex 12)"
  PREVIEW_HASH="$(openssl passwd -apr1 "$PREVIEW_PASS")"
  printf '%s:%s\n' "$PREVIEW_USER" "$PREVIEW_HASH" > "$HTPASSWD"
  printf 'url=https://%s/stage-a/\nusername=%s\npassword=%s\ngenerated_at_utc=%s\n' \
    "$DOMAIN" "$PREVIEW_USER" "$PREVIEW_PASS" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    > "$CREDENTIALS"
  chmod 600 "$CREDENTIALS"

  chown root:root "$HTPASSWD"
  chmod 644 "$HTPASSWD"
fi

PREVIEW_USER="$(awk -F= '$1=="username" {print substr($0, index($0, "=") + 1)}' "$CREDENTIALS")"
PREVIEW_PASS="$(awk -F= '$1=="password" {print substr($0, index($0, "=") + 1)}' "$CREDENTIALS")"
[[ -n "$PREVIEW_USER" && -n "$PREVIEW_PASS" ]]

cat > "$SNIPPET" <<'CONF'
location = /stage-a {
    add_header X-Robots-Tag "noindex, nofollow, noarchive, nosnippet" always;
    add_header Cache-Control "private, no-store, no-cache, must-revalidate, max-age=0" always;
    return 308 /stage-a/;
}

location ^~ /stage-a/ {
    auth_basic "RAIMOV DENTAL private strategy";
    auth_basic_user_file /etc/nginx/.htpasswd-raimov-stage-a;

    root __RAIMOV_STAGE_A_RELEASE__;
    index index.html;
    try_files $uri $uri/ =404;

    add_header X-Robots-Tag "noindex, nofollow, noarchive, nosnippet" always;
    add_header Cache-Control "private, no-store, no-cache, must-revalidate, max-age=0" always;
    add_header Pragma "no-cache" always;
    add_header X-Content-Type-Options "nosniff" always;
}
CONF
sed -i "s|__RAIMOV_STAGE_A_RELEASE__|$RELEASE_DIR|g" "$SNIPPET"
chmod 644 "$SNIPPET"

python3 - "$ACTIVE_CONFIG" <<'PY'
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
text = path.read_text()
begin = '# BEGIN RAIMOV_STAGE_A_PREVIEW'
end = '# END RAIMOV_STAGE_A_PREVIEW'
include = 'include /etc/nginx/snippets/raimov-stage-a-preview.conf;'

marker = re.compile(
    r'\n\s*# BEGIN RAIMOV_STAGE_A_PREVIEW\n\s*include /etc/nginx/snippets/raimov-stage-a-preview\.conf;\n\s*# END RAIMOV_STAGE_A_PREVIEW\n?',
    re.MULTILINE,
)
text = marker.sub('\n', text)

if include in text:
    raise SystemExit('preview include exists outside the managed marker block')

ssl = re.search(r'listen\s+[^;\n]*443[^;\n]*ssl\s*;', text)
if not ssl:
    raise SystemExit('HTTPS listen directive not found')

root = re.search(
    r'^\s*root\s+/var/www/raimovdental\.com;\s*$',
    text[ssl.end():],
    re.MULTILINE,
)
if not root:
    raise SystemExit('production root line not found inside HTTPS server')

root_start = ssl.end() + root.start()
line_end = text.find('\n', root_start)
if line_end == -1:
    raise SystemExit('could not locate root line ending')

block = (
    '\n\n    # BEGIN RAIMOV_STAGE_A_PREVIEW\n'
    '    include /etc/nginx/snippets/raimov-stage-a-preview.conf;\n'
    '    # END RAIMOV_STAGE_A_PREVIEW'
)
text = text[:line_end] + block + text[line_end:]
path.write_text(text)
PY

ln -sfn "$RELEASE_DIR" "${CURRENT}.next"
mv -Tf "${CURRENT}.next" "$CURRENT"

nginx -t
nginx_dump_after="$(mktemp)"
nginx -T >"$nginx_dump_after" 2>&1
grep -Fq "$SNIPPET" "$nginx_dump_after"
grep -Fq "$MARKER_BEGIN" "$ACTIVE_CONFIG"
rm -f "$nginx_dump_after"
reload_nginx

ORIGIN=(curl -ksS --resolve "$DOMAIN:443:$PROD_IP")
PREVIEW_URL="https://$DOMAIN/stage-a/"

UNAUTH_STATUS=""
for origin_attempt in $(seq 1 20); do
  UNAUTH_STATUS="$("${ORIGIN[@]}" -o /dev/null -w '%{http_code}' "$PREVIEW_URL" || true)"
  echo "origin_unauth_attempt=$origin_attempt status=$UNAUTH_STATUS"
  if [[ "$UNAUTH_STATUS" == "401" ]]; then
    break
  fi
  sleep 1
done
if [[ "$UNAUTH_STATUS" != "401" ]]; then
  echo "preview_release=$RELEASE_DIR"
  namei -l "$RELEASE_DIR/stage-a/index.html" || true
  ls -ld "$REMOTE_BASE" "$REMOTE_BASE/releases" "$RELEASE_DIR" "$RELEASE_DIR/stage-a" || true
  grep -nE 'stage-a|auth_basic|root ' "$SNIPPET" || true
  grep -Rni 'stage-a' /var/log/nginx 2>/dev/null | tail -20 || true
fi
[[ "$UNAUTH_STATUS" == "401" ]]

AUTH_STATUS=""
for origin_auth_attempt in $(seq 1 20); do
  AUTH_STATUS="$("${ORIGIN[@]}" -u "$PREVIEW_USER:$PREVIEW_PASS" -o /tmp/raimov-stage-a.html -w '%{http_code}' "$PREVIEW_URL" || true)"
  echo "origin_auth_attempt=$origin_auth_attempt status=$AUTH_STATUS"
  if [[ "$AUTH_STATUS" == "200" ]]; then
    break
  fi
  sleep 1
done
[[ "$AUTH_STATUS" == "200" ]]

grep -q 'От действующей практики' /tmp/raimov-stage-a.html
grep -q 'Raimov Academy' /tmp/raimov-stage-a.html

for asset in \
  stage-a.css \
  assets/fonts.css \
  assets/atabek-portrait.jpg; do
  ASSET_STATUS="$("${ORIGIN[@]}" -u "$PREVIEW_USER:$PREVIEW_PASS" -o /dev/null -w '%{http_code}' "${PREVIEW_URL}${asset}")"
  [[ "$ASSET_STATUS" == "200" ]]
done

ORIGIN_HEADERS="$("${ORIGIN[@]}" -I -u "$PREVIEW_USER:$PREVIEW_PASS" "$PREVIEW_URL")"
printf '%s\n' "$ORIGIN_HEADERS" | grep -qi '^x-robots-tag:.*noindex'
printf '%s\n' "$ORIGIN_HEADERS" | grep -qi '^cache-control:.*no-store'

PUBLIC_STATUS="$("${ORIGIN[@]}" -L -o /dev/null -w '%{http_code}' "https://$DOMAIN/ru/")"
echo "origin_public_ru_status=$PUBLIC_STATUS"
[[ "$PUBLIC_STATUS" == "200" ]]
PUBLIC_HEADERS="$("${ORIGIN[@]}" -I "https://$DOMAIN/ru/")"
if printf '%s\n' "$PUBLIC_HEADERS" | grep -qi '^www-authenticate:'; then
  echo 'Public /ru/ unexpectedly requires preview authentication' >&2
  exit 42
fi

EDGE_OK=0
for attempt in $(seq 1 12); do
  EDGE_UNAUTH="$(curl -sS -o /dev/null -w '%{http_code}' "$PREVIEW_URL" || true)"
  EDGE_AUTH="$(curl -sS -u "$PREVIEW_USER:$PREVIEW_PASS" -o /tmp/raimov-stage-a-edge.html -w '%{http_code}' "$PREVIEW_URL" || true)"
  EDGE_HEADERS="$(curl -sSI -u "$PREVIEW_USER:$PREVIEW_PASS" "$PREVIEW_URL" || true)"
  echo "edge_attempt=$attempt unauth_status=$EDGE_UNAUTH auth_status=$EDGE_AUTH"

  if [[ "$EDGE_UNAUTH" == "401" && "$EDGE_AUTH" == "200" ]] \
    && printf '%s\n' "$EDGE_HEADERS" | grep -qi '^x-robots-tag:.*noindex' \
    && grep -q 'Стратегия Дмитрия' /tmp/raimov-stage-a-edge.html; then
    EDGE_OK=1
    break
  fi
  sleep 5
done
[[ "$EDGE_OK" == "1" ]]

cat > "$DEPLOY_RECORD" <<JSON
{
  "surface": "raimov-stage-a-protected-preview",
  "url": "https://$DOMAIN/stage-a/",
  "sourceSha": "$SOURCE_SHA",
  "releaseId": "$RELEASE_ID",
  "deployedAtUtc": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "access": "nginx-basic-auth",
  "credentialsFile": "$CREDENTIALS",
  "robots": "noindex,nofollow,noarchive,nosnippet",
  "cache": "private,no-store",
  "originSmoke": "pass",
  "edgeSmoke": "pass",
  "publicRuUnaffected": true,
  "activeConfig": "$ACTIVE_CONFIG",
  "rollbackBackup": "$BACKUP_DIR"
}
JSON
chmod 644 "$DEPLOY_RECORD"

ls -1dt "$REMOTE_BASE"/releases/* 2>/dev/null \
  | tail -n +6 \
  | while IFS= read -r stale; do
      [[ "$stale" == "$RELEASE_DIR" ]] || rm -rf "$stale"
    done

rm -f /tmp/raimov-stage-a.html /tmp/raimov-stage-a-edge.html
trap - EXIT

echo "RAIMOV_STAGE_A_PREVIEW_DEPLOY_OK url=$PREVIEW_URL source_sha=$SOURCE_SHA credentials_file=$CREDENTIALS rollback=$BACKUP_DIR"
REMOTE

echo "RAIMOV_STAGE_A_PREVIEW_DEPLOY_COMPLETE url=https://$DOMAIN/stage-a/ source_sha=$SOURCE_SHA"

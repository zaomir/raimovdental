#!/usr/bin/env bash
# Deploys the Expert Dental Review Hub to the VPS2402 origin.
#
#   bash scripts/raimov/deploy-feedback-hub.sh
#
# Run from the canonical workdir on VPS2402. Installs the mini-app to /opt, provisions a
# dedicated system user and data directory, writes the env file on first run only, then
# enables the unit and smokes /feedback/health.
#
# Scope: this script never touches the patient site. The nginx location that fronts the hub
# lives in site-raimovdental/deploy/clinic.raimovdental.com.origin.conf and is installed by
# deploy-patient-site.sh, so the two contours stay independently deployable.
#
# Rollback: systemctl disable --now expert-feedback-hub && remove the /feedback/ location.
set -euo pipefail

ORIGIN_HOST="vps2402"
if [[ "$(hostname -s)" != "$ORIGIN_HOST" ]]; then
  cat >&2 <<EOF
Refusing to deploy: the hub runs on the ${ORIGIN_HOST} origin, but this box is $(hostname -s).
Run it on the origin:

  ssh ${ORIGIN_HOST}-root 'cd /var/www/grainee-v2 && git pull --ff-only origin main \\
    && bash scripts/raimov/deploy-feedback-hub.sh'
EOF
  exit 2
fi

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="${REPO}/site-raimovdental/feedback-hub"
APP=/opt/expert-feedback-hub
DATA=/var/lib/expert-feedback-hub
ENV_FILE=/etc/grainee/feedback-hub.env
UNIT=expert-feedback-hub.service
SVC_USER=expertfeedback

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

say "1/6 gates"
node "${REPO}/scripts/raimov/check-feedback-hub.mjs"

say "2/6 user, directories"
if ! id -u "$SVC_USER" >/dev/null 2>&1; then
  useradd --system --no-create-home --shell /usr/sbin/nologin "$SVC_USER"
  echo "  created system user ${SVC_USER}"
fi
install -d -o root -g root -m 0755 "$APP"
install -d -o "$SVC_USER" -g "$SVC_USER" -m 0750 "$DATA"
install -d -o root -g root -m 0755 /etc/grainee

say "3/6 env"
if [ ! -f "$ENV_FILE" ]; then
  # Generated once and never printed to a log or committed: rotating it is a matter of
  # deleting this file and re-running the script.
  ADMIN_TOKEN="$(head -c 24 /dev/urandom | base64 | tr -d '/+=' | head -c 32)"
  cat > "$ENV_FILE" <<EOF
# Expert Dental Review Hub. Managed by scripts/raimov/deploy-feedback-hub.sh.
FEEDBACK_PORT=8613
FEEDBACK_DATA_DIR=${DATA}
FEEDBACK_ORIGIN=https://clinic.raimovdental.com
FEEDBACK_ADMIN_TOKEN=${ADMIN_TOKEN}
# Atom A5 — manager alert channel. Chat id is already provisioned in edge.env; the bot
# token is supplied by the clinic. Until both are set a 1-3 submission is stored and shown
# in the admin journal but not pushed to Telegram.
TELEGRAM_BOT_TOKEN=
MANAGER_REPUTATION_TG_CHAT_ID=$(grep -h '^MANAGER_REPUTATION_TG_CHAT_ID=' /etc/grainee/edge.env 2>/dev/null | tail -1 | cut -d= -f2- || true)
EOF
  chmod 0640 "$ENV_FILE"
  chgrp "$SVC_USER" "$ENV_FILE"
  echo "  wrote ${ENV_FILE} (admin token generated, not printed)"
else
  echo "  ${ENV_FILE} exists — left untouched"
fi

say "4/6 install app"
# The tree under /opt mirrors site-raimovdental/ so the one shared import in render.mjs
# (../../patient-site/config/site.mjs — the map URLs) resolves without a build step.
rsync -a --delete --exclude '.git' "${SRC}/" "${APP}/feedback-hub/"
install -D -m 0644 "${REPO}/site-raimovdental/patient-site/config/site.mjs" \
  "${APP}/patient-site/config/site.mjs"
install -D -m 0644 "${REPO}/site-raimovdental/patient-site/assets/img/team/team-960.jpg" \
  "${APP}/patient-site/assets/img/team/team-960.jpg"
chown -R root:root "$APP"

say "5/6 unit"
install -m 0644 "${REPO}/site-raimovdental/deploy/${UNIT}" "/etc/systemd/system/${UNIT}"
systemctl daemon-reload
systemctl enable "$UNIT" >/dev/null
systemctl restart "$UNIT"
sleep 2

say "6/6 smoke"
fails=0
health="$(curl -sS --max-time 5 http://127.0.0.1:8613/feedback/health || echo FAIL)"
echo "  health: ${health}"
case "$health" in *'"ok":true'*) ;; *) fails=$((fails + 1)) ;; esac

for probe in /feedback/ /feedback/notarealtokenatall1234; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 "http://127.0.0.1:8613${probe}" || echo 000)"
  echo "  ${code} ${probe}"
done

if [ "$fails" -gt 0 ]; then
  echo "smoke failed — service left running for inspection: journalctl -u ${UNIT} -n 50" >&2
  exit 1
fi

echo
echo "hub deployed. Admin journal: https://clinic.raimovdental.com/feedback/admin?key=<FEEDBACK_ADMIN_TOKEN>"
echo "Token lives in ${ENV_FILE} — read it on the server, never paste it into chat."

---
owner: Дмитрий + Engineering + Release
status: deployed / protected preview PASS
project: raimovdental
surface: /stage-a/
updated: 2026-07-24
source_gate: Gate 4A PASS 94/100
preview_gate: PASS
---

# RAIMOV DENTAL Stage A — protected preview delivery

## Назначение

Дмитрию передана стабильная закрытая поверхность для презентации Атабеку уже прошедшей source-level Gate 4A стратегии экосистемы.

Preview не является публичным запуском, investor offer, пациентским сайтом или заменой действующего публичного контента `raimovdental.com`.

## Результат

- URL: `https://raimovdental.com/stage-a/`;
- unauthenticated edge: `401`;
- authenticated page and assets: `200`;
- origin and Cloudflare edge smoke: PASS;
- `X-Robots-Tag`: `noindex, nofollow, noarchive, nosnippet`;
- caching: private/no-store;
- публичный `/ru/`: `200`, без preview-auth;
- публичный webroot, sitemap, navigation и forms не синхронизировались и не заменялись.

Durable evidence: `docs/audits/raimov/releases/stage-a/PREVIEW_DEPLOY_2026-07-24.md`.

## Архитектура

- отдельный webroot: `/var/www/raimovdental-stage-a`;
- immutable versioned releases;
- Nginx обслуживает активную immutable release directory напрямую;
- symlink `current` сохраняется как release metadata/rollback pointer, но не является serving dependency;
- HTTP Basic Auth на уровне Nginx;
- credentials создаются на VDS и не хранятся в Git;
- plaintext credentials: `/root/raimov-stage-a-preview.credentials`, mode `0600`;
- htpasswd: `/etc/nginx/.htpasswd-raimov-stage-a`;
- managed Nginx snippet: `/etc/nginx/snippets/raimov-stage-a-preview.conf`;
- active HTTPS vhost: `/etc/nginx/fastpanel2-sites/grainee_infra/raimovdental.com.conf`;
- source packager: `scripts/raimov/package-stage-a-preview.mjs`;
- deploy/rollback: `scripts/raimov/deploy-stage-a-preview.sh`.

## Security and indexation

Authenticated HTML and every asset under `/stage-a/` return:

- `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`;
- `Cache-Control: private, no-store, no-cache, must-revalidate, max-age=0`;
- no analytics, external scripts or third-party requests.

Unauthenticated `/stage-a/` returns `401` with `WWW-Authenticate`. The route remains absent from sitemap and public navigation.

## Verified smoke

| Check | Result |
|---|---|
| Edge `/stage-a/` without credentials | PASS — `401` |
| Origin `/stage-a/` without credentials | PASS — `401` |
| Authenticated page | PASS — `200` + strategic content |
| CSS, font CSS and portrait with auth | PASS — `200` |
| `X-Robots-Tag` | PASS — contains `noindex` |
| `Cache-Control` | PASS — contains `private` and `no-store` |
| Public `/ru/` | PASS — `200`, no `WWW-Authenticate` |
| Nginx config | PASS — `nginx -t` |
| Loaded vhost/include | PASS — verified through `nginx -T` |

## Credential handling

The deployment never prints the password to workflow logs, Git or chat. Дмитрий retrieves it directly from the VDS through an authenticated administrative channel:

```bash
sudo cat /root/raimov-stage-a-preview.credentials
```

Password rotation is performed by deleting the credential and htpasswd files on the VDS and re-running the deploy script. No credential value is recorded in this document.

## Rollback

The successful release has rollback evidence at:

`/var/www/raimovdental-stage-a/backups/20260724T164512Z-574e35c5408c`

Every deploy stores the active vhost, preview snippet, auth files and previous release target. Any failed Nginx, origin or Cloudflare smoke restores:

1. the previous active vhost;
2. the previous Nginx snippet;
3. the previous authentication files;
4. the previous release pointer;
5. Nginx via `nginx -t` and reload/HUP.

All pre-success failed attempts rolled back. The public webroot `/var/www/raimovdental.com` was never synced or deleted by this preview deploy.

## Release boundary

This implementation does not authorise:

- public navigation or sitemap inclusion;
- removal of authentication;
- replacement of `/ru/` or legacy routes;
- Stage B investor forms;
- Stage C patient/service/case pages;
- disclosure of credentials in repository files or messages.

## Next milestone

1. Дмитрий retrieves the credentials from the VDS.
2. Дмитрий presents Stage A to Атабеку.
3. The conversation is recorded as `accept / change / defer` decisions.
4. Only after that is a separate Stage B decision made.

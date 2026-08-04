---
owner: Dmitry + Engineering + Release
status: pass
project: raimovdental
surface: /stage-a/
deployed_at_utc: 2026-07-24T16:45:12Z
source_sha: 574e35c5408c3b5286f255b83ad382dc73145b08
workflow_run: 30110215745
---

# RAIMOV DENTAL Stage A — protected preview deploy evidence

## Result

The protected Stage A strategic presentation is available at:

`https://raimovdental.com/stage-a/`

It is a private presentation surface for Dmitry and Atabek. It is not a public investor website, patient funnel, Academy launch or replacement of the existing public site.

## Deployment identity

| Field | Value |
|---|---|
| Source SHA | `574e35c5408c3b5286f255b83ad382dc73145b08` |
| Release ID | `574e35c5408c` |
| Deployment UTC | `2026-07-24T16:45:12Z` |
| GitHub Actions run | `30110215745` |
| Job | `89537593188` |
| Active HTTPS vhost | `/etc/nginx/fastpanel2-sites/grainee_infra/raimovdental.com.conf` |
| Managed snippet | `/etc/nginx/snippets/raimov-stage-a-preview.conf` |
| Release webroot | `/var/www/raimovdental-stage-a/releases/574e35c5408c` |
| Credential file | `/root/raimov-stage-a-preview.credentials` |
| Rollback backup | `/var/www/raimovdental-stage-a/backups/20260724T164512Z-574e35c5408c` |

Credential values are intentionally absent from Git, Actions logs and this evidence file.

## Smoke evidence

| Check | Result |
|---|---|
| Nginx configuration | PASS — `nginx -t` |
| Effective vhost selection | PASS — loaded config verified through `nginx -T` |
| Origin without credentials | PASS — `401` after bounded worker-reload retry |
| Origin with credentials | PASS — `200` |
| Authenticated CSS, font CSS and portrait | PASS — `200` |
| `X-Robots-Tag` | PASS — `noindex, nofollow, noarchive, nosnippet` |
| `Cache-Control` | PASS — private/no-store policy |
| Cloudflare edge without credentials | PASS — `401` |
| Cloudflare edge with credentials | PASS — `200` |
| Public `/ru/` | PASS — `200`, no preview authentication |
| Public webroot sync/delete | Not performed |
| Sitemap/public navigation inclusion | Not performed |

The first origin request after Nginx reload returned the previous worker state; the bounded retry observed `401` on the second attempt. Authenticated origin and edge checks then passed on their first accepted attempts.

## Security properties

- HTTP Basic Auth is enforced by Nginx before the strategic HTML or assets are served.
- The plaintext password is stored only on the VDS in a root-only file.
- The htpasswd hash is stored separately for Nginx.
- The page and assets return noindex/noarchive/nosnippet headers.
- Responses use private/no-store caching.
- The page loads no analytics, client JavaScript or third-party resources.
- The route is absent from the public sitemap and navigation.

Dmitry retrieves the credentials through the authenticated VDS administration channel:

```bash
sudo cat /root/raimov-stage-a-preview.credentials
```

## Rollback

The deploy stores the previous vhost, snippet, auth files and release target in the rollback directory listed above. Every failed pre-release attempt restored the previous configuration successfully. The successful deployment retained the new protected location only after origin, edge and public-route smoke passed.

## Release boundary

This deploy authorises only the private Stage A presentation route. It does not authorise:

- an indexable public launch;
- Stage B investor forms or financial claims;
- Stage C patient/service/case pages;
- removal of Basic Auth;
- inclusion in sitemap or public navigation;
- replacement or migration of current RU/EN routes.

The next business step is the strategic presentation to Atabek and an `accept / change / defer` decision protocol.

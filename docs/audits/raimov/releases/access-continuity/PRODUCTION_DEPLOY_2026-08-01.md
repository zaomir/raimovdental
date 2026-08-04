---
project: raimovdental
surface: /ru/ + /ru/access-continuity/ + /stage-a/
status: PASS
completed_at_utc: 2026-08-01T00:05:53Z
owner: Engineering + Release
---

# RAIMOV DENTAL Access & Continuity — production deploy

## Result

The first applied Raimov System module is live as a strategic, status-labelled public surface.

Public URLs:

- `https://raimovdental.com/ru/`
- `https://raimovdental.com/ru/access-continuity/`

Protected strategy:

- `https://raimovdental.com/stage-a/`

Publishing this strategy does **not** launch the clinical operational pilot. The pilot still requires Atabek/clinic approval of triage, free/paid composition, capacity, data/medical consents and cohort economics.

## Source and decisions

- feature PR: `#578`
- feature merge: `ef1b9b49f03ca9b471a79f5b9f25d952c90375fb`
- cutover smoke fix PR: `#588`
- production source SHA: `cb65d499ca886efe14329ef33855302dbebb153d`
- decision: `docs/founder-notes/DEC-774_raimov-access-continuity-system.md`
- strategy SSOT: `docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md`

## QA before merge

Workflow run: `30673827439`

PASS:

- `npm run build:raimovdental`;
- `npm run test:raimovdental`;
- `node tests/raimov/access-continuity-public.mjs`;
- `node tests/raimov/stage-a-representative.mjs`;
- `pnpm website:studio:guard -- --range origin/main...HEAD`;
- `pnpm check:project raimovdental -- --range origin/main...HEAD`;
- `pnpm repo:check -- --range origin/main...HEAD`;
- `pnpm docs:guards`.

Browser gate included:

- Axe WCAG 2.2 AA serious/critical = 0;
- 390 px and 320 px reflow PASS;
- keyboard and skip-link PASS;
- no reachable horizontal overflow;
- reduced motion PASS;
- third-party requests = 0;
- client scripts on dedicated route = 0.

## Production cutover

Temporary non-merge deployment PR: `#587`

Successful workflow run: `30674593146`

Canonical pipeline:

`build → project tests → timestamped backup → public webroot sync → Nginx config test/reload → origin smoke → Cloudflare edge smoke → Stage A regression`

Backup:

`/root/raimovdental-cutover-backups/20260801T000521Z`

Nginx backup is additionally created by the canonical cutover under:

`/root/nginx-backups/raimovdental.com-<UTC timestamp>`

## Live acceptance

| Check | Result |
|---|---|
| `/ru/` | `200` |
| Public home contains `Система доступа и непрерывности лечения` | PASS |
| `/ru/access-continuity/` | `200` |
| Access page contains `Паспорт здоровья зубов V0` | PASS |
| Access page contains `Чек-ап записан до ухода` | PASS |
| Access page rejects free-treatment claim | PASS |
| `sitemap.xml` | `200` and contains `/ru/access-continuity/` |
| Public Access route indexable | PASS; no `X-Robots-Tag: noindex` |
| Public `/ru/` has no `WWW-Authenticate` | PASS |
| `/stage-a/` without auth | `401` |
| `/stage-a/` with wrong password | `401` |
| `/stage-a/` with current valid credentials | `200` |
| Stage A `X-Robots-Tag` | contains `noindex` |
| Stage A cache policy | contains `no-store` |

Final live marker:

`RAIMOV_ACCESS_CONTINUITY_PROD_PASS home=200 access=200 sitemap=200 stage=401/200`

## Truth boundary

The live site states that:

- the module is forming inside Expert Dental Studio;
- it is not a separate clinic;
- it is not a promise of free treatment;
- it is not 24/7 in-person care;
- free triage/routing and paid diagnostics/treatment are separated;
- Expert Care 12 and separate capacity require later gates;
- operational pilot is not yet launched.

## Rollback

Use the timestamped backup above to restore the public webroot and the Nginx backup created by the cutover. Stage A remains in a separate webroot and was not included in public `rsync --delete`.

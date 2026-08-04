---
owner: QA + Product + Medical reviewer
status: release candidate
project: raimovdental
route: /ru/access-continuity/
updated: 2026-08-01
decision: docs/founder-notes/DEC-774_raimov-access-continuity-system.md
automated_gate: tests/raimov/access-continuity-public.mjs
---

# QA — RAIMOV DENTAL Access & Continuity System

## Truth gate

- [x] The route presents a forming module, not an operating separate clinic.
- [x] Free triage/check-up and paid diagnostics/treatment are explicitly separated.
- [x] The route does not promise free treatment.
- [x] The route does not promise 24/7 in-person care.
- [x] Online information is not described as a diagnosis.
- [x] Expert Care 12 is a future gated programme, not a live subscription.
- [x] One hundred urgent cases are operational proof, not automatic authority for a new location.
- [x] No price, certificate duration, social quota or clinical protocol is invented.

## Product gate

- [x] Public home contains a concise teaser and link.
- [x] Dedicated indexable route has one clear intent.
- [x] Patient journey includes Passport V0, pre-booked check-up, Passport V1 and complex plan.
- [x] Strategic CTAs return to the existing investor and Academy forms.
- [x] No urgent patient booking form is exposed before operational gates.

## SEO and connectivity

- [x] Unique title, description, H1 and canonical.
- [x] Route appears in sitemap and robots allows it.
- [x] Route is linked from public `/ru/`.
- [x] Stage A remains absent from sitemap and protected by server-side auth.

## Accessibility and responsive

Required before merge:

- desktop visual review;
- 390 px and 320 px reflow;
- 200%-equivalent viewport;
- keyboard focus and skip link;
- reduced motion;
- Axe WCAG 2.2 AA with zero serious/critical violations;
- no reachable horizontal overflow.

Automated gate: `node tests/raimov/access-continuity-public.mjs` after `npm run build:raimovdental`.

## Performance

- no new third-party scripts;
- no new client JavaScript on the dedicated route;
- existing self-hosted fonts and Stage B CSS only;
- LCP/CLS remain within project budgets.

## Release smoke

After deploy:

- `/ru/` → `200` and contains `Система доступа и непрерывности лечения`;
- `/ru/access-continuity/` → `200` and contains `Паспорт здоровья зубов V0`;
- route canonical and indexable meta are present;
- sitemap contains `/ru/access-continuity/`;
- `/stage-a/` without auth → `401`;
- `/stage-a/` with existing credentials → `200`;
- public `/ru/` does not receive `WWW-Authenticate`.

## Operational boundary

Publishing the strategy page does not launch the clinical pilot. Pilot launch requires Atabek/clinic approval of triage, capacity, free-check-up composition, medical/data consents, responsible staff and cohort-economics measurement.

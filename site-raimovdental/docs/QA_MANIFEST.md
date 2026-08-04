---
owner: QA + Design + Engineering
status: PASS — one-reader strategy atlas
project: RAIMOVDENTAL
route: /ru/ + 10 detail routes
updated: 2026-08-01
standards:
  - docs/ssot/WEBSITE_STUDIO_STANDARD.md
  - docs/ssot/IMPECCABLE_WEBSITE_AGENT_STANDARD.md
decisions:
  - docs/founder-notes/DEC-737_website-studio-standard.md
  - docs/founder-notes/DEC-775_raimov-one-reader-strategy-atlas.md
release_mode: private strategy replacement; Stage A archive and render prototype preserved
---

# WEBSITE STUDIO + IMPECCABLE QA MANIFEST — RAIMOV strategy atlas

## Gate result

**PASS** on GitHub Actions run `30704640763`, source head `00acdf8289e870f01c6459f1843a9260c07a73bd`.

Visual evidence artifact:

- artifact ID: `8819939310`;
- name: `raimov-strategy-atlas-2603c0c96dac852493838d17c688a18943a4b394`;
- SHA-256: `deb51559d9676d8660f6c9eb95778b5318a903c240af6bc558a503c40471f79d`.

## Canon read

- [x] `docs/ssot/WEBSITE_STUDIO_STANDARD.md`
- [x] `docs/ssot/IMPECCABLE_WEBSITE_AGENT_STANDARD.md` (IMPECCABLE)
- [x] DEC-737 / DEC-775
- [x] `docs/ssot/RAIMOV_ONE_READER_STRATEGY_ATLAS.md`
- [x] project `DESIGN.md` / `SITE_MAP.md`

## Design discovery

**DESIGN DISCOVERY:** the founder supplied the reader, behaviour and preferred communication format directly.

- Reader: only Atabek Raimov.
- Reading behaviour: dislikes long text; understands arrows, logic and visual sequences.
- Surface goal: understand the whole proposal in 30 seconds, then open one element at a time.
- Required pattern: every page starts with a summary, then details.
- Navigation language: «Вернуться к карте стратегии».
- Anti-attributes: public corporate website, long report, investor lead funnel, patient landing, decorative diagrams without logic.
- Assets: rights-cleared Atabek portrait only; no AI imagery or stock smiles.

## Impeccable execution

**SURFACE MODE:** read + decide

**REPRESENTATIVE SURFACE:** `/ru/` is the representative strategy map; `/ru/raimov-system/` is the representative detail page.

**IMPECCABLE PASS:** `/impeccable polish` applied through the atlas design grammar: one dominant thesis, explicit direction, controlled card variety, editorial typography, strong whitespace, visible gates, restrained palette and mobile reflow.

**DETECT TARGET:** automated browser detector. Playwright checks all 11 routes, one H1, zero client scripts, zero console errors, 1440/390/320 reflow, ten cards, summary-before-details, keyboard skip link and screenshots. Axe checks WCAG 2.2 AA.

## Truth and privacy contract

- [x] site speaks directly from Dmitry to Atabek;
- [x] no public investor, Academy or patient lead forms;
- [x] no public analytics events or trackers;
- [x] all routes contain noindex/noarchive meta;
- [x] Nginx protects all `/ru/` routes with the existing server-side credentials;
- [x] CSS and portrait are below the protected `/ru/` prefix;
- [x] robots disallows all;
- [x] sitemap is absent;
- [x] `/stage-a/` remains separate and protected;
- [x] `/render/` remains separate and noindex;
- [x] operational pilot is not presented as launched.

## Visual and content checks

- [x] exactly ten strategy modules on the map;
- [x] each detail page starts with «Суть за 15 секунд»;
- [x] each detail page has at least three diagonal-reading subheads;
- [x] each detail page contains a visual flow with at least four nodes;
- [x] home copy: 368 words;
- [x] detail pages: 151–187 words;
- [x] previous / map / next navigation is present;
- [x] reduced motion and print modes exist;
- [x] zero client JavaScript on strategy routes;
- [x] module numbers use an accessible high-contrast token after the first Axe pass identified the pale decorative value.

## Browser and accessibility result

- [x] all 11 routes return valid HTML in the static gate;
- [x] desktop 1440 px reflow;
- [x] mobile 390 px reflow;
- [x] mobile 320 px reflow;
- [x] no reachable horizontal overflow;
- [x] summary panel precedes detail sections;
- [x] keyboard skip link works;
- [x] console errors = 0;
- [x] client scripts = 0;
- [x] Axe serious/critical violations = 0.

## Required automated gate

All passed:

```bash
npm run build:raimovdental
npm run test:raimovdental
pnpm website:studio:guard -- --range origin/main...HEAD
pnpm check:project raimovdental -- --range origin/main...HEAD
pnpm repo:check -- --range origin/main...HEAD
pnpm docs:guards
```

Evidence screenshots:

- `desktop.png`;
- `mobile-390.png`;
- `mobile-320.png`;
- `raimov-system-mobile.png`.

## Production acceptance

Still required after merge:

- `/ru/` without credentials → 401;
- `/ru/` with wrong credentials → 401;
- `/ru/` with current valid credentials → 200;
- representative detail route → 200 with valid credentials;
- `/ru/` response headers contain noindex and private/no-store;
- `/stage-a/` remains 401/200;
- `/render/` remains reachable and noindex;
- backup and deploy SHA recorded.

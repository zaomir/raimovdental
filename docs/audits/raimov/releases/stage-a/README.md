# RAIMOV DENTAL Stage A — Gate 4A evidence

**Route source:** `site-raimovdental/stage-a/`  
**Mode:** source-only, protected/noindex representative preview  
**Checked:** 2026-07-24  
**Workflow:** temporary GitHub Actions browser gate; no production deploy

## Evidence

- `stage-a-desktop.png` — full-page 1440 px baseline.
- `stage-a-mobile.png` — full-page 390 px baseline.
- `stage-a-qa-report.json` — assertions and measured budgets.

## Passed

- HTTP 200 static smoke.
- One H1 / one main / no public form.
- `noindex,nofollow,noarchive,nosnippet`.
- All truth-status labels present.
- Portrait decoded and visible.
- Keyboard skip link visible.
- Axe WCAG 2.2 AA: 0 violations.
- 390 px, 320 px and 200%-equivalent reflow.
- Reduced-motion rendering.
- Zero client JavaScript and zero third-party requests.
- CSS and initial source-transfer budgets.

## Release boundary

This evidence closes **source-level Gate 4A only**. It does not authorise production deployment or public indexing. A shareable preview still requires server-side access control and `X-Robots-Tag` verification.

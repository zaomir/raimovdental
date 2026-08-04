# RAIMOV DENTAL — Lane C tests (TASK-756)

Static checks for lead form JS, analytics PII guard, Telegram config, and (when `site-raimovdental/dist/` exists) dist QA.

## Quick start

From repo root:

```bash
# Unit / source guards (no build required)
node tests/raimovdental/form-validation.test.mjs
node tests/raimovdental/analytics-pii-guard.test.mjs
node tests/raimovdental/telegram-config-guard.test.mjs

# Full Lane C suite (dist steps SKIP with exit 2 until Lane A build exists)
node tests/raimovdental/run-all.mjs
```

## Individual dist checks (after build)

```bash
node scripts/build-raimovdental.mjs   # Lane A — when available
node tests/raimovdental/build-smoke.mjs
node tests/raimovdental/route-matrix.mjs
node tests/raimovdental/link-checker.mjs
node tests/raimovdental/language-purity.mjs
node tests/raimovdental/placeholder-guard.mjs
node tests/raimovdental/seo-structured-data.mjs
```

## Browser / a11y (optional)

Requires `playwright` and `@axe-core/playwright` + `npx playwright install chromium`.

```bash
node tests/raimovdental/run-playwright.mjs   # exit 2 = SKIP
node tests/raimovdental/run-axe.mjs          # exit 2 = SKIP
```

## Edge Function smoke (manual, post-deploy)

```bash
curl -sS -X POST "https://lwyumrgygbuowndwcsvc.supabase.co/functions/v1/submit-raimovdental-lead" \
  -H "Content-Type: application/json" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "name":"Test",
    "phone":"+998901234567",
    "contactChannel":"phone",
    "country":"Uzbekistan",
    "city":"Tashkent",
    "interest":"comprehensive_plan",
    "language":"en",
    "consentVersion":"2026-07-20"
  }'
```

## Brand guard

Tests fail on **Saidov** strings; expect **RAIMOV DENTAL / Raimov System / Atabek Raimov**.

## Lane ownership

| Path | Owner |
|------|-------|
| `site-raimovdental/src/assets/js/lead-form.js` | Lane C |
| `site-raimovdental/src/assets/js/analytics.js` | Lane C |
| `site-raimovdental/src/assets/js/telegram.js` | Lane C |
| `site-raimovdental/src/assets/js/site-config.stub.js` | Lane C (stub → final `site.ts`) |
| `supabase/functions/submit-raimovdental-lead/` | Lane C |
| `supabase/migrations/*raimovdental*` | Lane C |

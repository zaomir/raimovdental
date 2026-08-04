#!/usr/bin/env node
/** RAIMOV DENTAL test runner — unit and rendered ecosystem checks. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const STEPS = [
  { name: 'form-validation', file: 'form-validation.test.mjs', required: true },
  { name: 'lead-form-ef-chain', file: 'lead-form-ef-chain.test.mjs', required: true },
  { name: 'ef-failure-recovery', file: 'ef-failure-recovery.test.mjs', required: true },
  { name: 'analytics-pii', file: 'analytics-pii-guard.test.mjs', required: true },
  { name: 'telegram-config', file: 'telegram-config-guard.test.mjs', required: true },
  { name: 'admin-render', file: 'admin-render.test.mjs', required: true },
  { name: 'restore-demo-assets', file: 'restore-demo-assets.mjs', required: true },
  { name: 'restore-work-reports', file: 'restore-work-reports.mjs', required: true },
  { name: 'workspace-mvp', file: 'workspace-mvp.test.mjs', required: true },
  { name: 'commercial-home-v2', file: 'commercial-home-v2.test.mjs', required: false },
  { name: 'ecosystem-content-depth', file: 'ecosystem-content-depth.test.mjs', required: true },
  { name: 'valeria-work-reports', file: 'valeria-work-reports.test.mjs', required: true },
  { name: 'expert-dental-web-report', file: 'expert-dental-web-report.test.mjs', required: true },
  { name: 'expert-dental-operating-architecture', file: 'expert-dental-operating-architecture.test.mjs', required: true },
  { name: 'build-smoke', file: 'build-smoke.mjs', required: false },
  { name: 'route-matrix', file: 'route-matrix.mjs', required: false },
  { name: 'link-checker', file: 'link-checker.mjs', required: false },
  { name: 'language-purity', file: 'language-purity.mjs', required: false },
  { name: 'placeholder-guard', file: 'placeholder-guard.mjs', required: false },
  { name: 'seo-structured-data', file: 'seo-structured-data.mjs', required: false },
  { name: 'playwright', file: 'run-playwright.mjs', required: false },
  { name: 'axe', file: 'run-axe.mjs', required: false },
];

let failed = 0;
let skipped = 0;

for (const step of STEPS) {
  console.log(`\n== ${step.name} ==`);
  const result = spawnSync(process.execPath, [join(here, step.file)], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status === 0) continue;
  if (result.status === 2 && !step.required) {
    skipped += 1;
    continue;
  }
  failed += 1;
}

console.log(`\nSummary: failed=${failed} skipped=${skipped}`);
process.exit(failed ? 1 : 0);

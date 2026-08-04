#!/usr/bin/env node
/**
 * Some legacy RAIMOV tests rebuild the strategy dist directly.
 * Restore the Valeria work journal and current plan statuses before rendered-route checks and deployment.
 */
await import('../../scripts/build-raimov-work-reports.mjs');
await import('../../scripts/raimov/apply-month1-plan-progress.mjs');

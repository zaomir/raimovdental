#!/usr/bin/env node
/**
 * admin-render is a legacy test that can rebuild/replace dist.
 * Restore the canonical passwordless demo workspace before dist assertions.
 */
await import('../../scripts/raimov/preserve-demo-assets.mjs');

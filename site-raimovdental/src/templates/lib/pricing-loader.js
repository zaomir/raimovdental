import { readFileSync, existsSync } from 'node:fs';

/**
 * Parse pricing bands from pricing.ts SSOT (no duplicated amounts in JSON/HTML).
 * @param {string} pricingTsPath
 */
export function loadPricingBands(pricingTsPath) {
  if (!existsSync(pricingTsPath)) return [];
  const src = readFileSync(pricingTsPath, 'utf8');
  const bands = [];
  const blockRe = /\{([^{}]*id:\s*'([^']+)'[^{}]*)\}/gs;
  let m;
  while ((m = blockRe.exec(src))) {
    const block = m[1];
    const id = m[2];
    const status = (block.match(/status:\s*'(tbd|published)'/) || [])[1] || 'tbd';
    const fromRaw = (block.match(/fromAmount:\s*(null|\d+(?:\.\d+)?)/) || [])[1];
    const fromAmount = fromRaw === 'null' || fromRaw == null ? null : Number(fromRaw);
    const currency = (block.match(/currency:\s*'(KGS|USD|EUR)'|currency:\s*null/) || [])[1] || null;
    const labelRu = (block.match(/labelRu:\s*'((?:\\'|[^'])*)'/) || [])[1] || id;
    const labelEn = (block.match(/labelEn:\s*'((?:\\'|[^'])*)'/) || [])[1] || id;
    bands.push({
      id,
      status,
      fromAmount,
      currency: currency === undefined ? null : currency,
      labelRu: labelRu.replace(/\\'/g, "'"),
      labelEn: labelEn.replace(/\\'/g, "'"),
    });
  }
  return bands;
}

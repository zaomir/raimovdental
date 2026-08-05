/**
 * Build showcase + stock quantities from HOME_CARE_MATRIX.json care baskets.
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const matrixPath = join(root, 'docs/raimov/operations/expert-dental/home-care/HOME_CARE_MATRIX.json');
const m = JSON.parse(readFileSync(matrixPath, 'utf8'));

const byCode = new Map();
for (const sku of m.sku_catalog) {
  byCode.set(sku.code, {
    code: sku.code,
    label: sku.label,
    procedures: [],
    default_checked_count: 0,
    optional_count: 0,
    where: new Set(),
  });
}

for (const procedure of m.procedures) {
  for (const item of procedure.care_basket || []) {
    if (!byCode.has(item.code)) {
      byCode.set(item.code, {
        code: item.code,
        label: item.label || item.code,
        procedures: [],
        default_checked_count: 0,
        optional_count: 0,
        where: new Set(),
      });
    }
    const row = byCode.get(item.code);
    row.procedures.push(procedure.procedure);
    if (item.default_checked) row.default_checked_count += 1;
    else row.optional_count += 1;
    row.where.add(item.where || 'clinic_or_store');
  }
}

const presets = {
  soft_brush: { display: 12, stock: 60, pack_note: 'adult soft; 2–3 SKU colors/sizes ok' },
  low_abrasive_paste: { display: 8, stock: 36, pack_note: 'sensitive / low-RDA; 1–2 SKU' },
  irrigator: { display: 2, stock: 6, pack_note: '1 demo on shelf + boxed units' },
  interdental_brushes: { display: 10, stock: 40, pack_note: 'assorted sizes ISO 0–3; multipacks' },
  ortho_brushes: { display: 6, stock: 24, pack_note: 'V-brush + interdental ortho set' },
  ortho_wax: { display: 8, stock: 30, pack_note: 'small packs; high turnover after bonding' },
  kids_brush: { display: 6, stock: 24, pack_note: 'by age 2–5 / 6+' },
  kids_paste: { display: 4, stock: 18, pack_note: 'age-appropriate fluoride per doctor' },
  denture_brush: { display: 3, stock: 12, pack_note: 'with full/partial denture cases' },
  denture_tabs: { display: 4, stock: 16, pack_note: 'boxes, not loose tablets' },
  aligner_brush: { display: 3, stock: 12, pack_note: 'for aligner patients' },
  aligner_tabs: { display: 4, stock: 16, pack_note: 'cleaning tablets' },
};

function stockPlan(row) {
  const demand = row.default_checked_count * 2 + row.optional_count;
  const priority = row.default_checked_count >= 8 ? 'A' : row.default_checked_count >= 3 ? 'B' : 'C';
  const preset = presets[row.code];
  if (preset) return { priority, ...preset, demand_score: demand };
  const display = Math.max(2, Math.min(8, Math.ceil(demand / 4)));
  return { priority, display, stock: display * 4, pack_note: 'clinic-approved SKU', demand_score: demand };
}

const rows = [...byCode.values()]
  .map((row) => {
    const plan = stockPlan(row);
    return {
      code: row.code,
      label: row.label,
      where: [...row.where].join(', '),
      linked_procedures: row.procedures.length,
      default_on_checkout: row.default_checked_count,
      optional_on_checkout: row.optional_count,
      ...plan,
      example_procedures: row.procedures.slice(0, 5),
    };
  })
  .sort(
    (a, b) =>
      a.priority.localeCompare(b.priority) ||
      b.default_on_checkout - a.default_on_checkout ||
      a.label.localeCompare(b.label, 'ru'),
  );

const payload = {
  status: 'DRAFT — clinic SKU brands + exact pack sizes pending',
  version: '0.1',
  generated: new Date().toISOString().slice(0, 10),
  source: 'HOME_CARE_MATRIX.json',
  material: 'ED-MAT-060',
  rule: 'display = visible waiting-room / reception units; stock = display + backroom target for ~2–4 weeks pilot',
  priorities: {
    A: 'High: default-checked on many procedures — always on showcase',
    B: 'Medium: regular offer — showcase + stock',
    C: 'Low/niche: small showcase face, reorder from stock',
  },
  items: rows,
  totals: {
    sku_count: rows.length,
    display_units: rows.reduce((sum, row) => sum + row.display, 0),
    stock_units: rows.reduce((sum, row) => sum + row.stock, 0),
  },
};

const outDir = join(root, 'docs/raimov/operations/expert-dental/home-care');
writeFileSync(join(outDir, 'SHOWCASE_STOCK_LIST.json'), `${JSON.stringify(payload, null, 2)}\n`);

const soft = rows.find((row) => row.code === 'soft_brush');
const paste = rows.find((row) => row.code === 'low_abrasive_paste');
const inter = rows.find((row) => row.code === 'interdental_brushes');
const irr = rows.find((row) => row.code === 'irrigator');

let md = `---
title: Витрина и склад — перечень из матрицы ухода
status: DRAFT — clinic brand/SKU approval required
version: 0.1
created: 2026-08-05
last_updated: 2026-08-05
id: ED-MAT-060
source: HOME_CARE_MATRIX.json
---

# Витрина и склад (из матрицы)

Классы средств из \`HOME_CARE_MATRIX.json\` / корзин процедур. **Бренды не зафиксированы** — клиника выбирает 1–2 артикула на класс.

## Правило количества

| Зона | Смысл |
|---|---|
| **Витрина (display)** | Сколько единиц видно пациенту в ожидании / у ресепшена |
| **Склад (stock)** | Витрина + подсобка; ориентир на пилот **2–4 недели** |
| **Приоритет A/B/C** | Как часто позиция в \`default_checked\` у процедур |

Пересчёт:

\`\`\`bash
node scripts/raimov/generate-showcase-stock.mjs
\`\`\`

## Сводная таблица

| Приоритет | Код | Товар (класс) | Витрина, шт | Склад, шт | В матрице (default / optional) | Где продаём | Комментарий |
|---|---|---|---:|---:|---|---|---|
`;

for (const row of rows) {
  md += `| ${row.priority} | \`${row.code}\` | ${row.label} | ${row.display} | ${row.stock} | ${row.default_on_checkout} / ${row.optional_on_checkout} | ${row.where} | ${row.pack_note} |\n`;
}

md += `
## Итого по пилоту

- SKU-классов: **${payload.totals.sku_count}**
- Единиц на витрине (сумма лиц): **${payload.totals.display_units}**
- Единиц на складе (цель): **${payload.totals.stock_units}**

## Минимальный стартовый набор на витрину (ожидание)

1. Мягкие щётки взрослые — ${soft?.display ?? '—'} шт  
2. Низкоабразивная / для чувствительных паста — ${paste?.display ?? '—'} шт  
3. Ёршики / суперфлосс (набор размеров) — ${inter?.display ?? '—'} уп.  
4. Орто-набор (ёршики + воск) — рядом с орто-потоком  
5. 1 демо-ирригатор + ${(irr?.display ?? 1) - 1} в коробке  
6. Детский блок (щётка + паста) — отдельная полка  
7. Протезы / элайнеры — малый блок у ресепшена (не обязательно в зоне ожидания)

## Что не класть на витрину «лицом»

- Аптечные лекарства по схемам врача (только по назначению, не retail-полка).  
- Рекламные «хиты» и скидочные плакаты (позиция Атабека: без рекламного давления).

## Машиночитаемо

\`SHOWCASE_STOCK_LIST.json\`
`;

writeFileSync(join(outDir, 'SHOWCASE_STOCK_LIST.md'), md);
console.log(`showcase/stock: ${payload.totals.sku_count} SKU, display ${payload.totals.display_units}, stock ${payload.totals.stock_units}`);

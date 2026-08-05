---
title: Витрина и склад — перечень из матрицы ухода
status: DRAFT — clinic brand/SKU approval required
version: 0.1
created: 2026-08-05
last_updated: 2026-08-05
id: ED-MAT-060
source: HOME_CARE_MATRIX.json
---

# Витрина и склад (из матрицы)

Классы средств из `HOME_CARE_MATRIX.json` / корзин процедур. **Бренды не зафиксированы** — клиника выбирает 1–2 артикула на класс.

## Правило количества

| Зона | Смысл |
|---|---|
| **Витрина (display)** | Сколько единиц видно пациенту в ожидании / у ресепшена |
| **Склад (stock)** | Витрина + подсобка; ориентир на пилот **2–4 недели** |
| **Приоритет A/B/C** | Как часто позиция в `default_checked` у процедур |

Пересчёт:

```bash
node scripts/raimov/generate-showcase-stock.mjs
```

## Сводная таблица

| Приоритет | Код | Товар (класс) | Витрина, шт | Склад, шт | В матрице (default / optional) | Где продаём | Комментарий |
|---|---|---|---:|---:|---|---|---|
| A | `soft_brush` | Мягкая зубная щётка | 12 | 60 | 44 / 1 | clinic, clinic_or_store | adult soft; 2–3 SKU colors/sizes ok |
| A | `interdental_brushes` | Ёршики / суперфлосс | 10 | 40 | 14 / 12 | clinic_or_store | assorted sizes ISO 0–3; multipacks |
| B | `denture_brush` | Щётка для протеза | 3 | 12 | 6 / 0 | clinic_or_store | with full/partial denture cases |
| C | `kids_brush` | Детская щётка | 6 | 24 | 1 / 8 | clinic_or_store | by age 2–5 / 6+ |
| C | `ortho_brushes` | Орто-ёршики / V-щётка | 6 | 24 | 1 / 0 | clinic | V-brush + interdental ortho set |
| C | `ortho_wax` | Ортодонтический воск | 8 | 30 | 1 / 0 | clinic | small packs; high turnover after bonding |
| C | `aligner_brush` | Щётка для капп | 3 | 12 | 1 / 0 | clinic_or_store | for aligner patients |
| C | `kids_paste` | Детская паста | 4 | 18 | 0 / 1 | clinic_or_store | age-appropriate fluoride per doctor |
| C | `irrigator` | Ирригатор | 2 | 6 | 0 / 15 | clinic_or_store | 1 demo on shelf + boxed units |
| C | `low_abrasive_paste` | Низкоабразивная паста | 8 | 36 | 0 / 3 | clinic_or_store | sensitive / low-RDA; 1–2 SKU |
| C | `aligner_tabs` | Таблетки для капп | 4 | 16 | 0 / 1 | clinic_or_store | cleaning tablets |
| C | `denture_tabs` | Таблетки для очистки протеза | 4 | 16 | 0 / 6 | clinic_or_store | boxes, not loose tablets |

## Итого по пилоту

- SKU-классов: **12**
- Единиц на витрине (сумма лиц): **70**
- Единиц на складе (цель): **294**

## Минимальный стартовый набор на витрину (ожидание)

1. Мягкие щётки взрослые — 12 шт  
2. Низкоабразивная / для чувствительных паста — 8 шт  
3. Ёршики / суперфлосс (набор размеров) — 10 уп.  
4. Орто-набор (ёршики + воск) — рядом с орто-потоком  
5. 1 демо-ирригатор + 1 в коробке  
6. Детский блок (щётка + паста) — отдельная полка  
7. Протезы / элайнеры — малый блок у ресепшена (не обязательно в зоне ожидания)

## Что не класть на витрину «лицом»

- Аптечные лекарства по схемам врача (только по назначению, не retail-полка).  
- Рекламные «хиты» и скидочные плакаты (позиция Атабека: без рекламного давления).

## Машиночитаемо

`SHOWCASE_STOCK_LIST.json`

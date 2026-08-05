---
title: Памятки пациента — по каждой процедуре прайса
status: DRAFT — medical review required before mass print
version: 0.2
created: 2026-08-05
last_updated: 2026-08-05
id: ED-MAT-058
format: A5 portrait
owner_print: administrator
---

# Памятки пациента

## Правило выдачи

Администратор **печатает и выдаёт** памятку, соответствующую **конкретной процедуре** из прайса (не общую «на отделение»). Врач не печатает.

Источник соответствия процедура → файл: [`by-procedure/INDEX.json`](by-procedure/INDEX.json) (**77** позиций = весь `PRICE_CATALOG.json`).

## Каталоги

| Путь | Назначение |
|---|---|
| [`by-procedure/`](by-procedure/) | **Канон для печати:** одна памятка на каждую позицию прайса |
| [`by-procedure/INDEX.json`](by-procedure/INDEX.json) | Машиначитаемый индекс для UI админа |
| `memo-*.md` в этой папке (7 файлов) | Устаревшие **групповые** черновики; оставляем для пилота, приоритет — `by-procedure/` |

## Групповые шаблоны (legacy / пилот)

| ID | Файл |
|---|---|
| `memo-hygiene` | [`memo-hygiene.md`](memo-hygiene.md) |
| `memo-therapy` | [`memo-therapy.md`](memo-therapy.md) |
| `memo-extraction` | [`memo-extraction.md`](memo-extraction.md) |
| `memo-endo` | [`memo-endo.md`](memo-endo.md) |
| `memo-veneers-ortho` | [`memo-veneers-ortho.md`](memo-veneers-ortho.md) |
| `memo-pediatric` | [`memo-pediatric.md`](memo-pediatric.md) |
| `memo-diagnostics` | [`memo-diagnostics.md`](memo-diagnostics.md) |

## Регенерация

При изменении прайса:

```bash
node scripts/raimov/generate-procedure-memos.mjs
```

## Скрипт выдачи

См. `../HOME_CARE_HANDOFF_SOP.md`.

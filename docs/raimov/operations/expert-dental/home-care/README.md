---
title: Expert Dental — домашний уход, витрина и памятки пациента
status: DRAFT — medical review required · strategy SSOT live (DEC-787)
version: 0.2
created: 2026-08-05
last_updated: 2026-08-05
materials: ED-MAT-054 … ED-MAT-062
related_plan_items: 10, 11
strategy_ssot: docs/ssot/EXPERT_DENTAL_HOME_CARE_HANDOFF_SYSTEM.md
decision: docs/founder-notes/DEC-787_expert-dental-home-care-handoff-system.md
contract_questions_ssot: docs/ssot/EXPERT_DENTAL_CONTRACT_CONTINUATION_QUESTIONS.md
---

# Home care & patient memos

**Канон стратегии:** [`docs/ssot/EXPERT_DENTAL_HOME_CARE_HANDOFF_SYSTEM.md`](../../../ssot/EXPERT_DENTAL_HOME_CARE_HANDOFF_SYSTEM.md) (DEC-787).

Операционный контур **тихой** выдачи средств ухода и памяток пациента после процедуры.

| Документ | Назначение |
|---|---|
| [`HOME_CARE_HANDOFF_SOP.md`](HOME_CARE_HANDOFF_SOP.md) | Три канала (витрина / врач / администратор), памятка, мотивация, запреты |
| [`PROCEDURE_MATRIX.md`](PROCEDURE_MATRIX.md) | Процедура → скрипт админа → корзина → ID памятки |
| [`PROCEDURE_ADDON_MATRIX.md`](PROCEDURE_ADDON_MATRIX.md) | Процедура → доп. процедура / следующий визит → продажа (клиника / магазин) |
| [`HOME_CARE_MATRIX.json`](HOME_CARE_MATRIX.json) | Машиночитаемая матрица для UI (генератор → admin/doctor JS) |
| [`SHOWCASE_STOCK_LIST.md`](SHOWCASE_STOCK_LIST.md) | Витрина + склад: классы товаров и количества |
| [`memos/`](memos/) | Печатные памятки A5: **77 шт.** по каждой процедуре прайса (`memos/by-procedure/`) |

## Статус

- **Черновик агентства.** Медицинские формулировки памяток и SKU-список утверждает Атабек Саидович или назначенный клинический ревьюер до массовой печати.
- Не расширяет locked-состав 16 пунктов месяца 1; поддерживает пункты **10** и **11** (внутренний маркетинг / речевые маркеры).
- Не хранит ПДн пациентов.

## Правило владельца

Согласовано с позицией Атабека: витрина есть, **без рекламного давления**; врач рекомендует пользу, не «продаёт бренды»; админ закрывает handoff и выдаёт памятку.

---
id: DEC-787
title: Post-Visit Feedback Loop — схема сбора отзывов в системе мотивации
date: 2026-08-05
status: accepted — strategy; operational pilot gated
owner: Дмитрий + управляющий Expert Dental + Атабек (клинический негатив)
applies_to: expert-dental, raimovdental
supersedes_partial:
  - docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md §8 (Reputation Loop detail)
links_to:
  - docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md
  - docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md
  - docs/raimov/operations/expert-dental/reputation/POST_VISIT_FEEDBACK_LOOP.md
  - docs/founder-notes/DEC-786_expert-dental-patient-motivation-system.md
  - docs/founder-notes/DEC-774 (Access & Continuity)
---

# DEC-787 — Post-Visit Feedback Loop

## Решение

В систему мотивации пациентов Expert Dental (DEC-786, Layer A Continuity) входит **Post-Visit Feedback Loop**: автоматический / полуавтоматический сбор CSAT после успешного визита через WhatsApp с маршрутизацией follow-up по оценке.

Схема **не** входит в Expert Points earn/redeem. Баллы, скидки, сертификат и Care 12 **нельзя** связывать с оценкой или публикацией отзыва.

## Поток (канон)

1. Триггер: визит завершён (`VISITED`), услуга в eligible-матрице, нет exclusion.
2. Через **60–120 минут** — WhatsApp с **трекаемой ссылкой** на Review Hub (`/feedback/<token>`).
3. На Hub пациент выбирает **1–5★** (событие трекается).
4. **4–5:** на той же странице три кнопки — Яндекс · 2ГИС · Google; клик уводит на площадку; кнопка становится «серой».
5. Пациент часто не возвращается → WhatsApp-дожимы на 2-ю и 3-ю площадку с той же ссылкой Hub (яркие = оставшиеся).
6. Long-tail: не чаще weekly ×1 + monthly ×1, затем STOP (anti-spam лестница N0–N4).
7. **1–3:** закрытая форма на Hub + алерт управляющему (клиника → главврач). Кнопки карт не показывать.

## Уточнение запрета «review gating» (DEC-774)

Сохраняется hard-ban на:

- отбор «только довольных» **до** отправки запроса (просить должны все сопоставимые eligible);
- вознаграждение за отзыв / оценку / UGC;
- диктовку текста и копипаст одного отзыва на площадки;
- требование скриншота 5★;
- удаление законной публичной критики.

Разрешается **операционная маршрутизация follow-up после универсального CSAT**: удобные публичные ссылки при высокой оценке и приоритет service recovery при низкой. Это не замена запрета на предварительный отбор и reward-for-review.

## Дополнения к схеме (обязательные к пилоту)

- Review Hub с token-state (серые/яркие кнопки);
- трекинг `hub_opened` / `csat_scored` / `platform_clicked` (клик ≠ публикация);
- матрица eligible-услуг; quiet hours; лестница N0–N4;
- SLA разбора негатива;
- отделение от referral и Points;
- еженедельный контроль тем и ответов на картах.

## Статус

Стратегия принята. Операционный запуск — после утверждения текстов, ссылок площадок, канала алертов и владельца recovery клиники.

Полный канон: `docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` §4.1.  
Операционный SOP: `docs/raimov/operations/expert-dental/reputation/POST_VISIT_FEEDBACK_LOOP.md`.

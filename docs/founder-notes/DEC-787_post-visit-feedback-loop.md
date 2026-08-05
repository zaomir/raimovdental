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
2. Через **60–120 минут** после приёма — WhatsApp: оценить работу клиники от 1 до 5.
3. **4–5:** благодарность + готовые ссылки на Google Maps / Яндекс.Карты / 2ГИС / ПроДокторов (ротация или предпочтение пациента).
4. **1–3:** закрытая форма / диалог обратной связи + алерт управляющему (клинический негатив — главному врачу). Негатив отрабатывается внутри контура; публичные ссылки в этом шаге **не** пушатся.

## Уточнение запрета «review gating» (DEC-774)

Сохраняется hard-ban на:

- отбор «только довольных» **до** отправки запроса (просить должны все сопоставимые eligible);
- вознаграждение за отзыв / оценку / UGC;
- диктовку текста и копипаст одного отзыва на площадки;
- требование скриншота 5★;
- удаление законной публичной критики.

Разрешается **операционная маршрутизация follow-up после универсального CSAT**: удобные публичные ссылки при высокой оценке и приоритет service recovery при низкой. Это не замена запрета на предварительный отбор и reward-for-review.

## Дополнения к схеме (обязательные к пилоту)

- матрица eligible-услуг (приоритет: гигиена, эстетика, завершённый понятный этап);
- quiet hours и frequency cap;
- SLA разбора негатива;
- CRM-события и журнал без диагнозов;
- отделение от referral и Points;
- еженедельный контроль тем и ответов на картах.

## Статус

Стратегия принята. Операционный запуск — после утверждения текстов, ссылок площадок, канала алертов и владельца recovery клиники.

Полный канон: `docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` §4.1.  
Операционный SOP: `docs/raimov/operations/expert-dental/reputation/POST_VISIT_FEEDBACK_LOOP.md`.

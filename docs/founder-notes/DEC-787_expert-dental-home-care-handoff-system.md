---
id: DEC-787
title: Expert Dental Home Care Handoff System
status: accepted — strategy; operational gates open
date: 2026-08-05
owner: Дмитрий
applies_to: expert-dental, raimovdental
ssot: docs/ssot/EXPERT_DENTAL_HOME_CARE_HANDOFF_SYSTEM.md
related:
  - docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md
  - docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md
  - docs/ssot/EXPERT_DENTAL_CONTRACT_CONTINUATION_QUESTIONS.md
  - docs/raimov/operations/expert-dental/home-care/README.md
---

# DEC-787 — система домашнего ухода и handoff (Expert Dental)

## Решение

Принять канон **Home Care Handoff System** для Expert Dental Studio:

1. Три канала: **витрина** (тихо, по показаниям) → **врач** (класс ухода, без брендов) → **администратор** (скрипт, корзина, памятка, следующий визит).  
2. Памятку пациента **печатает и выдаёт администратор** после процедуры; шаблон **1:1** с позицией прайса.  
3. Матрица **процедура → доп. процедура → продажа** обязательна для скриптов и UI врача/админа.  
4. Врач: **0% с SKU**. Мотивация администратора — после пилота.  
5. Розница ухода **не входит** в success fee, пока не согласовано отдельно.  
6. Операционный пакет: ED-MAT-054…061; SSOT: `EXPERT_DENTAL_HOME_CARE_HANDOFF_SYSTEM.md`.

## Контекст

Переписка с Атабеком Саидовичем: витрина есть; не хочет агрессивных продаж; готов внедрить мягкую рекомендацию. Кейс потери продажи (ирригатор куплен в Vegas при наличии средств в клинике) подтверждает разрыв handoff, не отсутствие товара.

## Не решает

- Юридические gates retainer/SF (`RAIMOV_LEGAL_GATES.md`).  
- Точную формулу success fee после baseline.  
- Конкретные бренды закупки.  
- Запуск Expert Care 12 / Points (DEC-786) — смежный контур.

## Следующие gates

1. Medical review памяток пилота.  
2. Approved SKU-list + витрина в ожидании.  
3. Пилот 2 недели (гигиена → терапия → эндо).  
4. Решение по % администратора.

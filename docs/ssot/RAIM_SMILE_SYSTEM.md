---
owner: Дмитрий + Атабек
status: active
type: ssot
version: 1.0
created: 2026-08-07
last_updated: 2026-08-07
decision: docs/founder-notes/DEC-801_raim-smile-system.md
applies_to: expert-dental, raimov, raimovdental, raimsmile
supersedes:
  - brand token "Raimov System" in public copy and brand lock
links_to:
  - docs/ssot/RAIMOV_PUBLIC_PROFILE.md
  - docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md
  - docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md
  - docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md
  - docs/expert-clinic-reference.md
domain: https://raimsmile.com
---

# RAIM SMILE SYSTEM

## 0. Главный вывод

**RAIM SMILE SYSTEM** — каноническое имя клинической и пациентской системы RAIMOV DENTAL / Expert Dental Studio.

Она упаковывает уже существующую практику (диагностика → проектирование → консилиум → поэтапный план → наблюдение) в узнаваемый бренд, построенный вокруг дифференциатора: ведущий врач — **ортодонт-гнатолог**, а эстетика следует за функцией прикуса, а не наоборот.

Система **не создаёт новых клинических обещаний**. Публичные формулировки описывают маршрут и протокол; исход лечения не гарантируется до осмотра.

## 1. Brand architecture

| Слой | Имя | Роль |
|---|---|---|
| Master brand экосистемы | **RAIMOV DENTAL** | `raimovdental.com` — стратегия, экосистема, Access & Continuity |
| Клиническая система | **RAIM SMILE SYSTEM** | Канон метода; patient product на `raimsmile.com` |
| Операционная клиника | **Expert Dental Studio** | `expertdental.kg` / staging `clinic.raimovdental.com` — работает **по** RAIM SMILE SYSTEM |
| Образование (token) | **Raimov Academy** | Будущая фаза после документированной системы |
| Прикладной модуль | Access & Continuity | Первый модуль системы (DEC-774) |

Историческое имя `Raimov System` = прежний brand token; в новых материалах не использовать.

## 2. Позиционирование

> Здоровый прикус — фундамент, эстетика — следствие.

Рабочая формулировка:

> Большинство проблем с винирами начинаются с того, что дизайн улыбки делали без анализа прикуса. В RAIM SMILE SYSTEM окклюзия — обязательный первый шаг перед эстетическим решением.

## 3. Архитектура: 5 этапов (patient-facing)

| # | Этап | Суть |
|---|---|---|
| 1 | Диагностика | Прикус, окклюзия, зубы и дёсны — до разговора об эстетике |
| 2 | Проектирование | Фотопротокол, сканирование, wax-up, мокап — до необратимого шага |
| 3 | Консилиум | Сложные случаи — команда |
| 4 | Поэтапный план | Письменный план с ценами и последовательностью до лечения |
| 5 | Наблюдение | Контроль тем же врачом / командой |

Операционная детализация эстетического маршрута: `EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` §4.2 (`aesthetic-diagnostics`, `screening-smile-preview`).

## 4. Где публикуется

| Поверхность | Что показывать |
|---|---|
| `raimsmile.com` | Product landing системы (пациентский язык) |
| `raimovdental.com` Stage B | Система в траектории Атабека: практика → **RAIM SMILE SYSTEM** → Academy → клиники |
| Expert Dental patient-site | Несколько явных упоминаний: клиника работает по системе |
| Страница Раимова | Разработчик системы + польза для пациента |
| `/ru/raimov-system/` (legacy path) | Редирект / алиас контента на бренд RAIM SMILE SYSTEM до отдельного URL-решения |

## 5. Ограничители

- Не обещать результат до осмотра.
- Не использовать «гарантия» в юридическом смысле, пока условия не формализованы клиникой.
- Case count / сертификаты / ВНЧС-outcome — только после evidence gates (`RAIMOV_PUBLIC_PROFILE.md`).
- Не называть систему сертифицированной или готовой к франшизе.
- Медицинская реклама KG — legal gate до production cutover на новых hosts.

## 6. Связанные файлы

| Файл | Роль |
|---|---|
| `DEC-801_raim-smile-system.md` | Решение о переименовании |
| `RAIMOV_PUBLIC_PROFILE.md` §2 | Brand lock |
| `site-raimovdental/src/config/site.ts` | Runtime brand constants |
| `site-raimovdental/stage-b/` | Стратегия на raimovdental.com |
| `site-raimovdental/patient-site/` | Expert Dental |
| `site-raimovdental/raim-smile/` | Лендинг raimsmile.com |

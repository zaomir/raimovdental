---
id: DEC-788
title: Ответ фаундера на разбор консультанта (patient-site + research pack)
date: 2026-08-07
status: accepted
owner: Атабек Раимов (фаундер / главврач Expert Dental) · канал фиксации — Agents satellite
applies_to: expert-dental, raimovdental, patient-site
links_to:
  - research/raimov-profile/briefs/RESEARCH_BRIEF_ATABEK_BIO_GROWTH_2026-08.md
  - research/raimov-profile/briefs/atabek-bio-growth-2026-08/
  - docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md §33
  - site-raimovdental/patient-site/content/chief.mjs
  - site-raimovdental/patient-site/content/homepage.mjs
---

# DEC-788 — Ответ фаундера консультанту

Контекст: консультант пересобрал рекомендации под реальный patient-site (`expertdental.kg` / превью `clinic.raimovdental.com`), отделив его от драфта `commercial-home-v2` / `raimovdental.com`. Ниже — решения клиники, не копирайт и не новая стратегия.

## 1. Архитектуру принимаем

Согласен с уточнением:

- **Пациентский контур, который едет в прод** — `site-raimovdental/patient-site/`.
- **Personal-brand / growth draft** (`src/*`, `commercial-home-v2`) — сценарий стратегии, не то, что видит пациент на Expert Dental.
- Личный бренд на patient-site **не клеим на все дорогие продукты**: территория Атабека = прикус / ВНЧС / орто + гнато + второе мнение; виниры/импланты/дети — через клинику и профильных врачей. Так и оставляем.

Дифференцированные `consultationTier`, JTBD-роутер, `chiefDoctor`, гейт `practice[].verified` — это уже рабочая система. Менять архитектуру не нужно.

## 2. Приоритет (что важнее первым)

**Сначала A — блокер запуска**, параллельно чек-лист B/C на ответы по фактам.  
**Сразу после / вместе** — дешёвые контентные патчи, которые не требуют новых документов.

Порядок:

1. Закрыть §33.1: лицензия + `reviewEvidence` статей + канон должности в публичных заголовках — без этого на `expertdental.kg` не переключаемся, какой бы сильный `chief.mjs` ни был.
2. Применить атрибуцию блока «прикус до эстетики» (патч консультанта п.1) — **делаем сейчас**.
3. Заложить OrthoDay в `practice[]` с `verified: false` (патч п.2) — **делаем сейчас**; на сайт не выйдет, пока не отвечу по роли/теме.
4. Research-pack (MEAW / PMA / ОртоКомьюнити / Academy) — только через существующие `practice[]` / `talks[]` / `credentials.mjs` и flip `verified` после документов. Никаких `verified: true` «по Instagram».

## 3. Решения по трём предложениям консультанта

| # | Предложение | Решение |
|---|---|---|
| 1 | `authorNote` в `homepage.approach` + рендер в `pages.mjs` | **Принято.** Внедряем. Ссылку на `/services/gnathology/` не трогаем. |
| 2 | OrthoDay в `practice[]`, `verified: false` | **Принято.** В `talks[]` не кладём, пока нет роли/темы и пока `talks` рендерится без verified-гейта. |
| 3 | Единый чек-лист A/B/C для фаундера | **Принято.** Канон: `research/raimov-profile/briefs/atabek-bio-growth-2026-08/FOUNDER_LAUNCH_CHECKLIST.md` |

## 4. Жёсткие запреты (повтор для команды)

- Не публиковать «400+», рейтинги карт, ВНЧС-outcome claims, Academy-как-программу, MEAW/Корею, OrthoDay как спикерство — без clinic OK + нужного medical/rights gate.
- Дагестанский постер Nazrullaev **не** трактовать как моё участие/спикерство.
- `commercial-home-v2` не подменять patient-site в деплое Expert Dental.

## 5. Что отвечу по фактам отдельно (не в этом DEC)

Чек-лист B/C — рабочий список вопросов ко мне. Ответы дам письменно / пакетом сканов; до ответа строки остаются `verified: false` / pending. Не считаю Instagram self-bio достаточным для patient-site образования (C-07), даже если КРСУ уже звучит в старом посте.

## 6. Следующий шаг команде

1. Закоммитить патчи 1–2 + этот DEC + чек-лист на `main` `zaomir/raimovdental`.
2. Прислать мне чек-лист A+B одним сообщением (без воды).
3. После моих ответов — flip `verified` и при необходимости строки в `talks[]` / `credentials.mjs` отдельным коммитом с ссылкой на attestation.

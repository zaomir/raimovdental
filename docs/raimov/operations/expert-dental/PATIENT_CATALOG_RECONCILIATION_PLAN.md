---
title: Expert Dental — reconciliation прайса, $0-продуктов, CTA и Review Hub
status: COMPLETED
date: 2026-08-06
owner: Cursor
scope: clinic.raimovdental.com patient site and feedback hub
---

# План реализации

## Решение по источникам истины

1. `origin/main` репозитория `zaomir/grainee-v2` — единственный SSOT кода.
2. Цены и статусы продуктов читаются только из
   `docs/raimov/operations/expert-dental/pricing/PRICE_CATALOG.json`.
3. Live `clinic.raimovdental.com` используется как проверка результата, а не как источник нового факта.
4. Satellite `zaomir/raimovdental` — транспорт для агентских материалов. Полезные формулировки из PR #4
   переносятся после сверки с SSOT; противоречащий `proposed`-дубль эстетики не переносится.
5. Expert Care 12 остаётся `proposed / DEFERRED`: `RAIMOV.md`, `PROJECT_STATUS.md` и
   `EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` запрещают публично показывать его как работающий продукт.
   Страница, статья, цена и CTA Care 12 не публикуются до evidence-backed `clinic_confirmed`.

## Объём

1. Уточнить в каталоге границу трёх продуктов за 0 сом: только скрининг и маршрут, без диагноза,
   снимков и плана с ценами. Не использовать «бесплатная консультация».
2. Создать две подтверждённые service pages:
   `/services/smile-preview/` и `/services/named-checkup/`.
   Третий URL `/services/care-12/` не создаётся, пока Care 12 закрыт фазовым gate.
3. Сделать CTA контекстными: label, `data-cta-context` и WhatsApp prefill описывают один продукт,
   услугу, статью или врача. Generic prefill остаётся только в точках выбора.
4. Развести консультации 550 / 1 500 / 3 000 / 5 000 сом по объёму приёма без оценочных сравнений.
5. Уточнить эстетику: клиническая сложность E-max, ориентиры 6/8/10 без подготовки,
   границы композитной реставрации, отдельная ночная каппа, отбеливание до виниров,
   wax-up внутри диагностики. Не выдумывать, является ли 15 000 сом за временные виниры ценой
   за зуб или комплект: до подтверждения показывать исходную строку с явным уточнением у администратора.
6. Добавить две статьи по действующему article contract: цифровая примерка и именной чек-ап.
   Care 12 article не создаётся до запуска продукта. Reviewer указывается как editorial assignment;
   публичная medical-review attestation появляется только после `reviewedAt + reviewEvidence`.
7. Реализовать Review Hub fallback из satellite PR #6:
   `/feedback/` и unknown/malformed token возвращают 200 с благодарностью, фото команды и тремя картами;
   valid token сохраняет CSAT; «уже оставил» фиксируется отдельно от click-out.
8. Исключить `/null`, `proposed`, DEC и approval-маркеры из публичного HTML. Отдельно проверить
   legacy Tilda `/price`; менять его только через доступный управляемый канал, не через patient-site build.
9. Синхронизировать канон обратно в satellite после ship, чтобы не осталось параллельных цифр.

## WEBSITE / VISUAL QUALITY CANON READ

✓ `START.md` / `AGENTS.md` / `docs/ROUTER.md`  
✓ `docs/ssot/WEBSITE_STUDIO_STANDARD.md`  
✓ `docs/ssot/IMPECCABLE_WEBSITE_AGENT_STANDARD.md`  
✓ project SSOT: `RAIMOV.md`, `RAIMOV_DENTAL_WEBSITE_STRATEGY.md`,
  `EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md`, `RAIMOV_LEGAL_GATES.md`  
✓ project brief/router: `docs/projects/raimovdental/AGENTS.md`,
  `docs/projects/raimovdental/ROUTER.md`  
✓ design canon: `site-raimovdental/DESIGN.md`; patient pages preserve their existing production system  
✓ production templates: `patient-site/templates/*.mjs`, `patient-site/assets/css/site.css`,
  `feedback-hub/*`  
✓ testing/deploy: `scripts/raimov/check-patient-site.mjs`,
  `scripts/raimov/check-feedback-hub.mjs`, `tests/raimovdental/`,
  `scripts/raimov/deploy-*.sh`

SURFACE MODE: `persuade` for service/article pages; `operate` for Review Hub.  
DESIGN DISCOVERY: complete; preserve the current visual system and rights-cleared assets.  
IMPECCABLE PASSES: clarify → adapt → audit.  
REPRESENTATIVE SURFACE: `/services/smile-preview/` and anonymous `/feedback/`.  
DETECT TARGET: patient-site templates/assets and feedback-hub.

## Acceptance

- Build uses one publishable catalog; Care 12 cannot leak while `proposed`.
- Two confirmed $0 service pages return 200, appear in sitemap and interlink with doctors/services/articles.
- Every scoped CTA has matching visible intent, context marker and decoded WhatsApp message.
- New articles pass author/reviewer/reference/FAQ/related-link gates without fabricated review evidence.
- `/feedback/` and invalid token return useful 200 fallback; valid CSAT/recovery remains functional.
- No public `/null`, internal status marker, reward-for-review or 5-star pressure.
- Static checks, accessibility, browser/mobile, dead-link, schema, sitemap and Impeccable detector pass.
- Changes are pushed to `origin/main`, staging is deployed, and public smoke verifies routes, CTA and Hub.

## Реализовано 2026-08-06

- `PRICE_CATALOG.json` принят как единственный ручной источник цен; `PRICE_TABLE.md` теперь
  генерируется из него через `scripts/raimov/sync-price-table.mjs`, а deploy проверяет отсутствие drift.
- Care 12 не подтверждён клиникой: выбран обязательный безопасный вариант — продукт снят из
  публичного прайса; `/services/care-12/`, CTA и статья не публикуются.
- Созданы страницы `/services/smile-preview/` и `/services/named-checkup/`, две статьи,
  двусторонние связи с врачами и смежными услугами, FAQ и Schema.org.
- CTA услуг, статей и врачей получили контекстные labels, `data-cta-context` и WhatsApp drafts.
- `/services/price` перенаправляется на канонический `/services/`; `/null` и внутренние статусы
  блокируются quality gate.
- Review Hub реализует marketing fallback 200 без токена, анонимные click-out события и отдельное
  состояние `platform_already_reviewed`.
- `$0`-карточки показывают длительность, ограничения и ручную проверку именного права администратором.
- Карточки врачей показывают все применимые консультационные тарифы; формы записи требуют явного
  согласия на обработку данных.
- Review Hub ограничивает создание ссылок одним циклом за 90 дней по псевдонимному patient HMAC.
  Recovery хранит только allowlisted темы: свободный текст удалён из формы и отбрасывается сервером.
- Google Maps честно обозначен как переход в карточку до получения Place ID/direct review URL от клиники.


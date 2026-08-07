---
owner: Product + Engineering
status: active — private strategy atlas + CAESTHETIC reporting workspace
project: RAIMOVDENTAL
updated: 2026-08-03
standard: docs/ssot/WEBSITE_STUDIO_STANDARD.md
decisions:
  - docs/founder-notes/DEC-743_raimovdental-stage-a-strategic-presentation.md
  - docs/founder-notes/DEC-774_raimov-access-continuity-system.md
  - docs/founder-notes/DEC-775_raimov-one-reader-strategy-atlas.md
---

# SITE_MAP — RAIMOV DENTAL

## Surface model

| Surface | Access | Reader | Role |
|---|---|---|---|
| `/ru/` + strategy detail routes | password-only gate `0726`, no username; noindex, noarchive | Атабек Раимов | актуальная персональная стратегия Дмитрия |
| `/ru/valeria/` + period routes | тот же password-only gate; noindex, noarchive | Атабек Саидович и внутренняя команда | планы и отчёты CAESTHETIC по периодам; руководитель проекта — Валерия Петрова |
| `/stage-a/` | Basic Auth, noindex | внутренний архив | предыдущая презентационная версия |
| `/render/` | noindex, separate operational surface | команда клиники | операционный прототип |
| future patient site | deferred | пациенты | отдельный контур после решения владельца |

## Strategy atlas routes

| URL | Смысл | Ведущая схема |
|---|---|---|
| `/ru/` | вся стратегия на одной карте | общая ось + 10 модулей |
| `/ru/current-state/` | где находится Expert Dental сейчас | есть → ограничивает → создаём |
| `/ru/revenue-engine/` | рост выручки по всей воронке | внимание → рекомендация |
| `/ru/access-continuity/` | срочное обращение как начало лечения | триаж → Паспорт → план |
| `/ru/raimov-system/` | превращение мышления Атабека в систему | знание → правила → команда → контроль |
| `/ru/personal-brand/` | доверие к сложному лечению и системе | экспертиза → доверие → Academy |
| `/ru/academy/` | передача метода и кадровый резерв | методика → внутреннее обучение → внешние группы |
| `/ru/clinics/` | собственные клиники после доказательства | практика → система → масштаб |
| `/ru/atabek-role/` | роль Атабека через пять лет | врач → архитектор → владелец группы |
| `/ru/implementation/` | последовательность внедрения | основа → модуль → обучение → мощность → масштаб |
| `/ru/decisions/` | шесть решений Атабека | принять / изменить / отложить |

## CAESTHETIC reporting routes

```text
/ru/valeria/
  └── month-1/
      ├── plan/
      └── reports/
          └── first-two-weeks/
```

| URL | Назначение |
|---|---|
| `/ru/valeria/` | перечень периодов работы CAESTHETIC |
| `/ru/valeria/month-1/` | сводная страница первого месяца: отдельно план и отчёты |
| `/ru/valeria/month-1/plan/` | строго утверждённые 16 пунктов первого месяца |
| `/ru/valeria/month-1/reports/` | временная лента промежуточных и итогового отчётов |
| `/ru/valeria/month-1/reports/first-two-weeks/` | промежуточный отчёт CAESTHETIC за первые две недели |

Новые периоды добавляются одной записью в `site-raimovdental/work-reports/content.mjs`. В каждом периоде план и фактические отчёты хранятся раздельно.

## Strategy page template

Every strategy detail route follows the same order:

1. direct personal headline;
2. **«Суть за 15 секунд»**;
3. visual flow with arrows;
4. one-line outcome for Atabek;
5. three short detail sections with self-explanatory subheads;
6. previous step / strategy map / next step;
7. persistent **«Вернуться к карте стратегии»**.

## Reporting workspace page template

1. бренд CAESTHETIC и персональная строка **«Руководитель проекта — Валерия Петрова»** только на главной странице пространства;
2. перечень периодов;
3. внутри периода — две крупные зоны: **План** и **Отчёты**;
4. план показывается неизменным нумерованным списком;
5. отчёты показываются временной лентой;
6. каждый промежуточный отчёт содержит ключевые цифры, выполненные работы и приоритеты оставшейся части периода;
7. итоговый отчёт добавляется после завершения периода;
8. тон — уважительный, спокойный, доброжелательный и премиальный, без фамильярности и самовосхваления исполнителя.

## Privacy and indexing

- all `/ru/` routes use the existing server-side password-only gate;
- login form contains only the password field; password is not stored in Git;
- successful login creates an HttpOnly session;
- HTML and HTTP headers carry `noindex, nofollow, noarchive, nosnippet`;
- Cache-Control is private/no-store;
- `robots.txt` disallows `/`;
- sitemap is absent and `/sitemap.xml` returns 404;
- CSS assets are placed under `/ru/assets/` and protected by the same gate;
- public lead forms and analytics are absent.

## Truth boundary

The atlas explains what Dmitry proposes to build. It does not claim that RAIM SMILE SYSTEM, Academy, a clinic network, Expert Care 12 or the Access & Continuity operational pilot are already launched.

The CAESTHETIC reporting workspace separates planned work from completed work. Activity is not presented as a business result unless a measured result is available.

## Deferred

Patient services, appointment funnel, cases, before/after, doctors catalogue, Academy programmes/pricing, investment terms, EN site and public SEO pages.

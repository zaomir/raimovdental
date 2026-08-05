# 🦷 Expert Clinic — SSOT Routing Hub

> **Single Source of Truth** для всей информации об Expert Dental Studio / RAIMOV DENTAL.
> Репозиторий: `zaomir/grainee-v2`, ветка `main`

---

## 🧭 Как пользоваться этим файлом

Этот файл — **единственная точка входа**. Все ссылки ниже ведут к каноническим файлам в репозитории.
Начинайте с нужной секции → переходите по ссылке → работайте с конкретным файлом.

```
expert-clinic-reference.md (ЭТОТ ФАЙЛ)
  ├── 1. Стратегия и архитектура → docs/ssot/
  ├── 2. Операции → docs/raimov/operations/expert-dental/
  ├── 3. Сайт и контент → site-raimovdental/, site-caesthetic/
  ├── 4. Research и Evidence → research/raimov-profile/
  ├── 5. Growth & Clinic → docs/raimov/clinic-growth/
  ├── 6. Legal → docs/ssot/RAIMOV_LEGAL_GATES.md, docs/legal/
  ├── 7. Runtime & CI → docs/runtime/, scripts/, tests/
  └── 8. Данные и конфиги → data/, site-*/config/
```

---

## 1️⃣ Стратегия и Архитектура

> **Начинать отсюда**, если вопрос про общую стратегию, диагноз, KPI, риски, экосистему.

| Что | Файл | Зачем |
|-----|------|-------|
| 🏆 **Master SSOT-индекс всего проекта** | [`docs/ssot/RAIMOV.md`](docs/ssot/RAIMOV.md) | Карта всех файлов, статусы, пробелы. Главная точка входа |
| 📐 **Архитектура экосистемы** | [`docs/ssot/RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE.md`](docs/ssot/RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE.md) | Топология, владение, фазовые ворота |
| 🎯 **Стратегия роста (полная)** | [`docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md`](docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md) | Диагноз, воронка, KPI, риски. Канон для разговоров с Атабеком |
| 🌐 **Стратегия сайта RAIMOV DENTAL** | [`docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md`](docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md) | Аудитория, глубина, CTA, IA, copy |
| 🦷 **Стратегия сайта Expert Dental** | [`docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md`](docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md) | SSOT для сайта Expert Dental |
| 💼 **Предложение роста** | [`docs/ssot/EXPERT_DENTAL_GROWTH_OFFER.md`](docs/ssot/EXPERT_DENTAL_GROWTH_OFFER.md) | Коммерческое предложение, Instagram, финансовая модель |
| 📊 **Practice Growth Blueprint** | [`docs/ssot/PRACTICE_GROWTH_BLUEPRINT.md`](docs/ssot/PRACTICE_GROWTH_BLUEPRINT.md) | Blueprint роста практики |
| 🏥 **Workspace MVP** | [`docs/ssot/EXPERT_DENTAL_WORKSPACE_MVP.md`](docs/ssot/EXPERT_DENTAL_WORKSPACE_MVP.md) | MVP приватного workspace для персонала |
| 📋 **SSOT Index** | [`docs/ssot/INDEX.md`](docs/ssot/INDEX.md) | Индекс всех SSOT-файлов |
| 🚀 **Мастер-план $10M** | [`docs/ssot/RAIMOV_10M_MASTERPLAN.md`](docs/ssot/RAIMOV_10M_MASTERPLAN.md) | Фазы, вознаграждение Дмитрия |
| 🏛️ **ELITE DENTAL Strategy** | [`docs/ssot/ELITE_DENTAL_STRATEGY.md`](docs/ssot/ELITE_DENTAL_STRATEGY.md) | Pointer → EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md |
| 📝 **Проектный статус** | [`docs/raimov/PROJECT_STATUS.md`](docs/raimov/PROJECT_STATUS.md) | STAGE_B_PUBLIC_LIVE, что live, что не запущено |

---

## 2️⃣ Операции Expert Dental Studio

> **Начинать отсюда**, если вопрос про текущую операционную работу, отчёты, материалы, планирование.

| Что | Файл | Зачем |
|-----|------|-------|
| 📂 **Операционный индекс** | [`docs/raimov/operations/expert-dental/README.md`](docs/raimov/operations/expert-dental/README.md) | Главная точка входа в операционную документацию |
| 🗂️ **Архитектура файлов** | [`docs/raimov/operations/expert-dental/FILE_ARCHITECTURE.md`](docs/raimov/operations/expert-dental/FILE_ARCHITECTURE.md) | Структура папок, правила изменений |
| 🔗 **Реестр ссылок** | [`docs/raimov/operations/expert-dental/LINKS_REGISTER.md`](docs/raimov/operations/expert-dental/LINKS_REGISTER.md) | Все URL: сайт, Instagram, WhatsApp, карты, офферы |
| 🪥 **Home care / памятки** | [`docs/raimov/operations/expert-dental/home-care/README.md`](docs/raimov/operations/expert-dental/home-care/README.md) | Витрина, врач, админ; памятки; процедура→доп.→продажа |
| 📦 **Реестр материалов** | [`docs/raimov/operations/expert-dental/MATERIALS_REGISTER.md`](docs/raimov/operations/expert-dental/MATERIALS_REGISTER.md) | ED-MAT-001..060 — все материалы проекта |
| 📅 **Планирование и отчётность** | [`docs/raimov/operations/expert-dental/PLANNING_AND_REPORTING.md`](docs/raimov/operations/expert-dental/PLANNING_AND_REPORTING.md) | Система планирования и отчётности |
| 📋 **План первого месяца** | [`docs/ssot/EXPERT_DENTAL_MONTH_1_PLAN_AND_REPORTS.md`](docs/ssot/EXPERT_DENTAL_MONTH_1_PLAN_AND_REPORTS.md) | Канон: 16 пунктов, нельзя расширять без команды |
| 📊 **Статус первого месяца** | [`docs/raimov/operations/expert-dental/periods/month-01/STATUS.md`](docs/raimov/operations/expert-dental/periods/month-01/STATUS.md) | Что в работе, выполнено, не начато |
| 📝 **Детальный план месяца** | [`docs/raimov/operations/expert-dental/periods/month-01/PLAN.md`](docs/raimov/operations/expert-dental/periods/month-01/PLAN.md) | План на месяц 01, locked |
| 📊 **Промежуточный отчёт** | [`docs/raimov/operations/expert-dental/periods/month-01/reports/2026-08-02-first-two-weeks.md`](docs/raimov/operations/expert-dental/periods/month-01/reports/2026-08-02-first-two-weeks.md) | Отчёт за первые две недели |
| 📑 **Индекс отчётов** | [`docs/raimov/operations/expert-dental/periods/month-01/reports/README.md`](docs/raimov/operations/expert-dental/periods/month-01/reports/README.md) | Индекс всех отчётов первого месяца |
| 📈 **Первая половина месяца** | [`docs/raimov/operations/expert-dental/reports/2026-08-first-half/README.md`](docs/raimov/operations/expert-dental/reports/2026-08-first-half/README.md) | Публичный срез 03.08.2026 |
| 🤖 **Agent Handoff v1.1** | [`docs/raimov/operations/expert-dental/reports/2026-08-first-half/AGENT_HANDOFF_V1_1.md`](docs/raimov/operations/expert-dental/reports/2026-08-first-half/AGENT_HANDOFF_V1_1.md) | Передача аналитико-управленческого пакета |
| 🌐 **Web Report Content** | [`docs/raimov/operations/expert-dental/reports/2026-08-first-half/WEB_REPORT_CONTENT.md`](docs/raimov/operations/expert-dental/reports/2026-08-first-half/WEB_REPORT_CONTENT.md) | Канонический контент веб-отчёта |
| 📐 **Report Pages Blueprint** | [`docs/raimov/operations/expert-dental/reports/2026-08-first-half/REPORT_PAGES_BLUEPRINT.md`](docs/raimov/operations/expert-dental/reports/2026-08-first-half/REPORT_PAGES_BLUEPRINT.md) | Архитектура 8 страниц отчёта |
| 💬 **Agent Web Prompt** | [`docs/raimov/operations/expert-dental/reports/2026-08-first-half/AGENT_WEB_PROMPT.md`](docs/raimov/operations/expert-dental/reports/2026-08-first-half/AGENT_WEB_PROMPT.md) | Исторический handoff (Cursor не использовался) |
| 📦 **Manifest** | [`docs/raimov/operations/expert-dental/reports/2026-08-first-half/manifest.json`](docs/raimov/operations/expert-dental/reports/2026-08-first-half/manifest.json) | Чексуммы файлов, routes |
| 📋 **Шаблоны** | [`docs/raimov/operations/expert-dental/templates/`](docs/raimov/operations/expert-dental/templates/) | REPORT_TEMPLATE.md, MATERIAL_ENTRY_TEMPLATE.md |
| 📝 **Changelog** | [`docs/raimov/operations/expert-dental/CHANGELOG.md`](docs/raimov/operations/expert-dental/CHANGELOG.md) | Журнал изменений операционного контура |

---

## 3️⃣ Сайт и Контент

> **Начинать отсюда**, если вопрос про сайт, страницы, контент, deployment.

| Что | Файл | Зачем |
|-----|------|-------|
| 📝 **Content Contract** | [`site-raimovdental/CONTENT_CONTRACT.md`](site-raimovdental/CONTENT_CONTRACT.md) | doctorEn, clinic, system, keys для контента |
| ⏳ **Content Required from Clinic** | [`site-raimovdental/CONTENT_REQUIRED_FROM_CLINIC.md`](site-raimovdental/CONTENT_REQUIRED_FROM_CLINIC.md) | Что нужно от клиники перед публикацией |
| 📊 **Expert Dental Report data** | [`site-raimovdental/expert-dental-report/data.mjs`](site-raimovdental/expert-dental-report/data.mjs) | Типизированный источник контента веб-отчёта |
| 🔐 **Private Expert Dental** | [`site-caesthetic/private/expert-dental/`](site-caesthetic/private/expert-dental/) | Закрытый раздел на caesthetic.com |
| 💰 **Growth Offer page** | [`site-caesthetic/private/expert-dental/offer/index.html`](site-caesthetic/private/expert-dental/offer/index.html) | Страница оффера с password gate |
| 📸 **Atabek portrait** | [`site-caesthetic/private/expert-dental/atabek-portrait.jpg`](site-caesthetic/private/expert-dental/atabek-portrait.jpg) | Исторический файл портрета |
| 🔗 **Router проекта** | [`docs/projects/raimovdental/ROUTER.md`](docs/projects/raimovdental/ROUTER.md) | Маршрутизация всех документов проекта |
| 🤖 **Agents проекта** | [`docs/projects/raimovdental/AGENTS.md`](docs/projects/raimovdental/AGENTS.md) | Назначение, контекст, ссылки |
| 📋 **Elite Dental README** | [`docs/raimov/elite-dental/README.md`](docs/raimov/elite-dental/README.md) | Партнёрская/франшизная модель (concept only) |

---

## 4️⃣ Research & Evidence

> **Начинать отсюда**, если вопрос про факты, источники, подтверждения, профиль Раимова.

| Что | Файл | Зачем |
|-----|------|-------|
| 📂 **Research README** | [`research/raimov-profile/README.md`](research/raimov-profile/README.md) | 6 правил исследования, не выдумывать факты |
| 📋 **Source Register** | [`research/raimov-profile/SOURCE_REGISTER.md`](research/raimov-profile/SOURCE_REGISTER.md) | SRC-LOCAL-001..006 — все источники |
| ✅ **Fact Register** | [`research/raimov-profile/FACT_REGISTER.csv`](research/raimov-profile/FACT_REGISTER.csv) | F-001..F-008 — факты и их статусы |
| 📸 **Media Manifest** | [`research/raimov-profile/MEDIA_MANIFEST.json`](research/raimov-profile/MEDIA_MANIFEST.json) | Хэши, права, источники медиа |
| 📄 **Founder Attestation** | [`research/raimov-profile/evidence/clinic-packet/FOUNDER_ATTESTATION.md`](research/raimov-profile/evidence/clinic-packet/FOUNDER_ATTESTATION.md) | Аттестация основателя 2026-07-21 |
| 📋 **Clinic Pending Packet** | [`research/raimov-profile/CLINIC_PENDING_PACKET.md`](research/raimov-profile/CLINIC_PENDING_PACKET.md) | Чеклист для подтверждения от клиники |
| ⏳ **Pending Confirmation** | [`research/raimov-profile/pending-clinic-confirmation.md`](research/raimov-profile/pending-clinic-confirmation.md) | Что подтверждено, что ещё нет |
| 📡 **Public Channels** | [`research/raimov-profile/PUBLIC_CHANNELS.md`](research/raimov-profile/PUBLIC_CHANNELS.md) | Каналы коммуникации |
| 🗣️ **Speaking Register** | [`research/raimov-profile/SPEAKING_REGISTER.md`](research/raimov-profile/SPEAKING_REGISTER.md) | Выступления, события |
| 🌐 **Public Profile SSOT** | [`docs/ssot/RAIMOV_PUBLIC_PROFILE.md`](docs/ssot/RAIMOV_PUBLIC_PROFILE.md) | Living SSOT публичной информации: каналы, соцсети, упоминания |

---

## 5️⃣ Growth & Clinic Growth

> **Начинать отсюда**, если вопрос про рост клиники, воронку, baseline, capacity, offers.

| Что | Файл | Зачем |
|-----|------|-------|
| 📈 **Clinic Growth README** | [`docs/raimov/clinic-growth/README.md`](docs/raimov/clinic-growth/README.md) | Система измеримого роста: baseline, priority services, capacity, offers |
| 💼 **Growth Offer** | [`docs/ssot/EXPERT_DENTAL_GROWTH_OFFER.md`](docs/ssot/EXPERT_DENTAL_GROWTH_OFFER.md) | Предложение роста, Instagram, финансовая модель |

---

## 6️⃣ Legal

> **Начинать отсюда**, если вопрос про юридические ворота, лицензии, согласия, франшизу.

| Что | Файл | Зачем |
|-----|------|-------|
| ⚖️ **Legal Gates** | [`docs/ssot/RAIMOV_LEGAL_GATES.md`](docs/ssot/RAIMOV_LEGAL_GATES.md) | Юридические ворота для всех проектов |
| 📂 **Legal README** | [`docs/legal/raimov/README.md`](docs/legal/raimov/README.md) | Индекс юридической документации |
| 📋 **Legal Templates** | [`docs/legal-templates/raimov/README.md`](docs/legal-templates/raimov/README.md) | Шаблоны документов (не утверждены) |
| 🏢 **Corporate README** | [`docs/raimov/corporate/README.md`](docs/raimov/corporate/README.md) | Entities, домены, лицензии, trademarks |
| ⚖️ **Governance README** | [`docs/raimov/governance/README.md`](docs/raimov/governance/README.md) | Decision records, ownership, approval paths |

---

## 7️⃣ Runtime, CI/CD, Тесты

> **Начинать отсюда**, если вопрос про deployment, тесты, build scripts, CI.

| Что | Файл | Зачем |
|-----|------|-------|
| 📂 **Raimov Runtime** | [`docs/runtime/projects/raimov/`](docs/runtime/projects/raimov/) | BACKLOG, TASKS, CURRENT_STATE, NEXT_ACTIONS, METRICS |
| 📋 **Tasks** | [`docs/runtime/projects/raimov/TASKS.md`](docs/runtime/projects/raimov/TASKS.md) | Canonical=yes row → продолжать отсюда |
| 🔄 **Continue From** | [`docs/runtime/projects/raimov/CONTINUE_FROM.md`](docs/runtime/projects/raimov/CONTINUE_FROM.md) | Точка продолжения работы |
| 📊 **Current State** | [`docs/runtime/projects/raimov/CURRENT_STATE.md`](docs/runtime/projects/raimov/CURRENT_STATE.md) | Текущее состояние проекта |
| 📈 **Metrics** | [`docs/runtime/projects/raimov/METRICS.md`](docs/runtime/projects/raimov/METRICS.md) | Метрики проекта |
| 📋 **Decisions** | [`docs/runtime/projects/raimov/DECISIONS.md`](docs/runtime/projects/raimov/DECISIONS.md) | Принятые решения |
| ⏳ **Open Decisions** | [`docs/runtime/projects/raimov/OPEN_DECISIONS.md`](docs/runtime/projects/raimov/OPEN_DECISIONS.md) | Открытые решения |
| 🔜 **Next Actions** | [`docs/runtime/projects/raimov/NEXT_ACTIONS.md`](docs/runtime/projects/raimov/NEXT_ACTIONS.md) | Следующие действия |
| 🏥 **Project Health** | [`docs/runtime/projects/raimov/PROJECT_HEALTH.md`](docs/runtime/projects/raimov/PROJECT_HEALTH.md) | Здоровье проекта |
| 📝 **Backlog** | [`docs/runtime/projects/raimov/BACKLOG.md`](docs/runtime/projects/raimov/BACKLOG.md) | Бэклог задач |
| 📦 **Projects Registry** | [`docs/runtime/projects.json`](docs/runtime/projects.json) | Реестр всех проектов, aliases: expert-dental-studio, raimovdental |
| 🧭 **Router** | [`docs/ROUTER.md`](docs/ROUTER.md) | Главный роутер всех проектов |
| 🧪 **Build Expert Dental Report** | [`scripts/build-expert-dental-report.mjs`](scripts/build-expert-dental-report.mjs) | Сборка 8-страничного отчёта |
| ✅ **Verify Report** | [`scripts/ci/verify-expert-dental-report-continuation.sh`](scripts/ci/verify-expert-dental-report-continuation.sh) | CI проверка отчёта |
| 🧪 **Web Report Test** | [`tests/raimovdental/expert-dental-web-report.test.mjs`](tests/raimovdental/expert-dental-web-report.test.mjs) | Тест readable materials |
| 🏗️ **Architecture Test** | [`tests/raimovdental/expert-dental-operating-architecture.test.mjs`](tests/raimovdental/expert-dental-operating-architecture.test.mjs) | Тест операционной архитектуры |
| 📊 **Valeria Reports Test** | [`tests/raimovdental/valeria-work-reports.test.mjs`](tests/raimovdental/valeria-work-reports.test.mjs) | Тест отчётов Valeria |

---

## 8️⃣ Данные и Конфигурации

> **Начинать отсюда**, если вопрос про данные клиники, конфиги аудитов, pricing.

| Что | Файл | Зачем |
|-----|------|-------|
| 🏥 **Audit config** | [`site-rovlex/config/audits/expert-dental-bishkek.json`](site-rovlex/config/audits/expert-dental-bishkek.json) | Конфиг аудита: URL, Instagram, телефон, WhatsApp |
| 💰 **Pricing** | [`site-raimovdental/src/config/pricing.ts`](site-raimovdental/src/config/pricing.ts) | ⚠️ PROTECTED — не трогать без clinic confirmation |
| 🌐 **Site config** | [`site-raimovdental/src/config/site.ts`](site-raimovdental/src/config/site.ts) | Конфиг сайта RAIMOV DENTAL |
| 👨‍⚕️ **Doctor data** | [`site-raimovdental/src/data/doctor.ru.json`](site-raimovdental/src/data/doctor.ru.json) | Черновик профиля доктора (Raimov System описание) |
| 👥 **Team data** | [`site-raimovdental/src/data/team.ru.json`](site-raimovdental/src/data/team.ru.json) | Черновик команды (members: [] — пусто!) |
| 📄 **Context Handoff** | [`docs/CONTEXT_HANDOFF.md`](docs/CONTEXT_HANDOFF.md) | Deploy evidence, password gate info |
| 📊 **Audit estimate** | [`docs/audits/caesthetic/EXPERT_DENTAL_ESTIMATE_V2_LIVE.md`](docs/audits/caesthetic/EXPERT_DENTAL_ESTIMATE_V2_LIVE.md) | Live evidence estimate v2 |
| 📊 **Report Last Run** | [`docs/audits/raimovdental-expert-dental-report/LAST_RUN.md`](docs/audits/raimovdental-expert-dental-report/LAST_RUN.md) | Production evidence, конкурентная матрица, путь пациента |
| 📊 **Rovlex audit** | [`site-rovlex/config/audits/expert-dental-bishkek.json`](site-rovlex/config/audits/expert-dental-bishkek.json) | Website, Instagram, phone, clinic_param |
| 📋 **Task scaffold** | [`docs/tasks/TASK-758_raimov-profile-research-scaffold.md`](docs/tasks/TASK-758_raimov-profile-research-scaffold.md) | Scaffold для research задачи |

---

## 🔗 Связанные проекты (не Expert Dental, но связаны)

| Проект | Путь | Связь |
|--------|------|-------|
| **CAESTHETIC** | `docs/ssot/CAESTHETIC.md` | Платформа, на которой размещён private/expert-dental |
| **ROVLEX** | `docs/ssot/GETSALES_USA.md` | Review growth partner, аудит для Expert Dental |
| **Toxifillers** | `docs/projects/toxifillers/DESIGN.md` | Clinical Procurement Desk |
| **EVO** | `site-evo/` | Блог, включает clinic-maps-reputation |

---

## ⚡ Quick Start — с чего начать

| Если вам нужно... | Идите сюда |
|-------------------|------------|
| Понять общую картину | [`docs/ssot/RAIMOV.md`](docs/ssot/RAIMOV.md) |
| Узнать стратегию | [`docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md`](docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md) |
| Проверить статус проекта | [`docs/raimov/PROJECT_STATUS.md`](docs/raimov/PROJECT_STATUS.md) |
| Узнать что делать дальше | [`docs/runtime/projects/raimov/NEXT_ACTIONS.md`](docs/runtime/projects/raimov/NEXT_ACTIONS.md) |
| Проверить факты о клинике | [`research/raimov-profile/README.md`](research/raimov-profile/README.md) → [`research/raimov-profile/FACT_REGISTER.csv`](research/raimov-profile/FACT_REGISTER.csv) |
| Узнать что нужно от клиники | [`site-raimovdental/CONTENT_REQUIRED_FROM_CLINIC.md`](site-raimovdental/CONTENT_REQUIRED_FROM_CLINIC.md) |
| Посмотреть отчёты | [`docs/raimov/operations/expert-dental/periods/month-01/reports/README.md`](docs/raimov/operations/expert-dental/periods/month-01/reports/README.md) |
| Проверить ссылки/URL | [`docs/raimov/operations/expert-dental/LINKS_REGISTER.md`](docs/raimov/operations/expert-dental/LINKS_REGISTER.md) |
| Понять операционную структуру | [`docs/raimov/operations/expert-dental/README.md`](docs/raimov/operations/expert-dental/README.md) |
| Проверить юридические ворота | [`docs/ssot/RAIMOV_LEGAL_GATES.md`](docs/ssot/RAIMOV_LEGAL_GATES.md) |

---

## ⚠️ Ключевые правила

1. **clinic written confirmation** — каноническое подтверждение для gate-целей (DEC-727 Commit-3)
2. Публикуются только факты с **concrete public/source wording**
3. `src/config/pricing.ts` — **PROTECTED**, не трогать без clinic confirmation
4. Expert Dental Studio и RAIMOV DENTAL — **separate brand labels** до подтверждения клиники
5. Empty team arrays, null titles, `pending_clinic_confirmation` = **unknown** (не выдумывать)
6. Нет автоматической публикации в `site-raimovdental/` из research pack
7. Франшиза (ELITE DENTAL) — только после доказанной модели
8. Сайт live, но клинический операционный пилот **не запущен**

---

*Последнее обновление: 2026-08-04*
*Файл: `docs/expert-clinic-reference.md` — SSOT Routing Hub для Expert Clinic*


## Cursor Agents satellite (DEC-783)

- **Agents project (Mobile/Cloud):** [`zaomir/raimovdental`](https://github.com/zaomir/raimovdental) — open this repo in Cursor Agents for clinic-only chats.
- **Production SSOT / deploy:** this monorepo (`zaomir/grainee-v2`).
- **Bidirectional sync (DEC-784):** `bash scripts/raimov/sync-agents-bidirectional.sh --apply --commit --push` (also auto every 10 min on VDS)
- Desktop IDE isolation: `raimovdental.code-workspace`
- **Setup guide:** [`docs/raimov/CURSOR_AGENTS_SETUP.md`](docs/raimov/CURSOR_AGENTS_SETUP.md) — Cloud Environment + Mobile picker + smoke
- Ops note: [`docs/raimov/AGENTS_SATELLITE.md`](docs/raimov/AGENTS_SATELLITE.md)


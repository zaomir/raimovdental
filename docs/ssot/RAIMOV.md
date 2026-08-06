---
owner: Дмитрий (стратегический наставник) + Total
status: active
type: ssot-master
created: 2026-07-21
last_updated: 2026-08-05
version: 1.10
review_cycle: после каждой стратегической сессии по проекту
applies_to: raimov, expert-dental, raimovdental, elite-dental, caesthetic
links_to:
  - docs/ssot/RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE.md
  - docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md
  - docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md
  - docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md
  - docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md
  - docs/ssot/RAIMOV_10M_MASTERPLAN.md
  - docs/ssot/RAIMOV_PUBLIC_PROFILE.md
  - docs/ssot/RAIMOV_LEGAL_GATES.md
  - docs/founder-notes/DEC-742_raimovdental-investor-first-website-strategy.md
  - docs/founder-notes/DEC-743_raimovdental-stage-a-strategic-presentation.md
  - docs/founder-notes/DEC-772_raimovdental-public-stage-b-cutover.md
  - docs/founder-notes/DEC-774_raimov-access-continuity-system.md
  - docs/founder-notes/DEC-786_expert-dental-patient-motivation-system.md
  - docs/founder-notes/DEC-787_post-visit-feedback-loop.md
  - docs/raimov/
  - research/raimov-profile/
  - site-raimovdental/
---

# RAIMOV.md — Master SSOT

## Runtime website

Public `raimovdental.com` is **Stage B** (DEC-772): RU-only strategic brand platform at `/ru/`. Patient-first catalog is replaced. Protected Stage A remains at `/stage-a/`.

DEC-774 adds the first applied Raimov System module to strategy and public Stage B: **RAIMOV DENTAL Access & Continuity System**. The website explains the model and its gates; it does not claim that the operational pilot, separate emergency clinic, 24/7 in-person care or Expert Care 12 are already running.

Evidence for the public cutover: `docs/audits/raimov/releases/public-v1/PRODUCTION_CUTOVER.md`.

## Как пользоваться этим файлом

Это единая точка входа по проекту Раимова. Она определяет:

- где хранится каждый тип информации;
- какой файл является источником истины;
- какие решения действуют по фазам;
- какие gates обязательны до private preview, public release, operational pilot и patient release.

Перед работой:

1. определить класс информации;
2. открыть файл-источник из раздела 3;
3. проверить фазу и применимые gates;
4. не повышать гипотезу до факта через сайт или copy;
5. новое решение записать в соответствующий SSOT/DEC и затем обновить этот индекс.

---

# 1. Слои истины

```text
Layer 0 · ФАКТЫ / EVIDENCE
  research/raimov-profile/

Layer 1 · ПУБЛИЧНО ДОПУСТИМЫЕ ФАКТЫ
  docs/ssot/RAIMOV_PUBLIC_PROFILE.md

Layer 2 · СТРАТЕГИЯ
  docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md
  docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md
  docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md
  docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md
  docs/ssot/RAIMOV_10M_MASTERPLAN.md
  docs/founder-notes/DEC-742_*.md
  docs/founder-notes/DEC-743_*.md
  docs/founder-notes/DEC-772_*.md
  docs/founder-notes/DEC-774_*.md
  docs/founder-notes/DEC-786_*.md

Layer 3 · ПРОДУКТ / COPY / RUNTIME
  docs/copy/raimov/
  site-raimovdental/

Layer 4 · LEGAL / OPERATIONS / RELEASE
  docs/ssot/RAIMOV_LEGAL_GATES.md
  docs/raimov/
  docs/legal/raimov/
  docs/audits/raimov/
```

Сайт не является источником факта. Стратегическая перспектива не является сообщением о действующем продукте.

## 1.1. Быстрый указатель

| Тип информации | Источник |
|---|---|
| Новый факт, снимок, публичное наблюдение | `research/raimov-profile/` |
| Публичный статус факта | `RAIMOV_PUBLIC_PROFILE.md` |
| Клиника, воронка, первый месяц, экономика роста | `EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md` |
| Фазы, аудитория, глубина и CTA сайта | `RAIMOV_DENTAL_WEBSITE_STRATEGY.md` |
| Срочный вход, бесплатный триаж, Паспорт V0/V1, чек-ап и непрерывность лечения | `RAIMOV_ACCESS_CONTINUITY_SYSTEM.md` |
| Мотивация пациентов: Continuity + Expert Care 12 + Expert Points + Feedback Loop | `EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` |
| Пятилетние внутренние ориентиры | `RAIMOV_10M_MASTERPLAN.md` |
| Stage A без approval/case gate | `DEC-743_raimovdental-stage-a-strategic-presentation.md` |
| Public Stage B cutover | `DEC-772_raimovdental-public-stage-b-cutover.md` |
| Первый applied module Raimov System | `DEC-774_raimov-access-continuity-system.md` |
| Единая система мотивации пациентов Expert | `DEC-786_expert-dental-patient-motivation-system.md` |
| Post-Visit Feedback Loop (CSAT → отзывы / recovery) | `DEC-787_post-visit-feedback-loop.md` |
| Юридический вопрос | `RAIMOV_LEGAL_GATES.md` |
| Текущая фаза и блокеры | `docs/raimov/PROJECT_STATUS.md` |
| Публичный текст | `docs/copy/raimov/` после применимых gates |
| Runtime | `site-raimovdental/` |

---

# 2. Кто есть кто

- **Атабек Раимов** — владелец и клинический лидер действующей практики.
- **Expert Dental Studio** — действующий операционный бизнес в Бишкеке и клиническая база первого пилота.
- **RAIMOV DENTAL** — мастер-бренд и перспектива группы собственных клиник.
- **Raimov System** — формируемая клиническая и операционная система.
- **RAIMOV DENTAL Access & Continuity System** — первый прикладной модуль Raimov System; стратегия принята, operational pilot ещё не запущен.
- **Raimov Academy** — будущее образовательное направление.
- **Собственные клиники RAIMOV DENTAL** — перспектива Бишкек → Кыргызстан → Центральная Азия.
- **Международный экспертный контур** — поздняя личная практика Атабека в дорогой юрисдикции; Дубай только условный кандидат.
- **ELITE DENTAL** — будущая отдельная партнёрская/франчайзинговая модель; не публичное предложение текущего сайта.
- **Дмитрий** — автор стратегии Stage A, держатель последовательности и proof/truth owner. В публичной версии остаётся за кадром.

Факты о человеке и текущей практике проверять только по Layer 0/1.

---

# 3. Карта файлов и приоритет

## 3.1. Главные источники

| Файл | Роль | Статус |
|---|---|---|
| `RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE.md` | топология, ownership, phases и gates | ACTIVE v1.3 |
| `EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md` | общая стратегия клиники и роста | ACTIVE |
| `RAIMOV_DENTAL_WEBSITE_STRATEGY.md` | стратегия сайта по фазам | ACTIVE v1.5 |
| `RAIMOV_ACCESS_CONTINUITY_SYSTEM.md` | первый applied module: access, triage, continuity, economics | ACTIVE v1.0 / PILOT NOT STARTED |
| `EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` | мотивация пациентов: Continuity + Care 12 + Points + Feedback Loop, фазы 0–3 | ACTIVE v1.2 / OPS GATED |
| `RAIMOV_10M_MASTERPLAN.md` | внутренний пятилетний/финансовый masterplan | ACTIVE INTERNAL |
| `RAIMOV_PUBLIC_PROFILE.md` | публично допустимые факты | ACTIVE LIVING |
| `RAIMOV_LEGAL_GATES.md` | medical, investor, international и network gates | ACTIVE OPEN |
| `docs/raimov/PROJECT_STATUS.md` | текущий milestone | ACTIVE |

## 3.2. Founder decisions

| Decision | Что фиксирует |
|---|---|
| `DEC-742` | будущая investor-first публичная архитектура, RU-only и full replacement |
| `DEC-743` | Stage A — стратегическая презентация Дмитрия; approval и cases не являются входным gate |
| `DEC-772` | публичный Stage B и полный cutover старого patient-first сайта |
| `DEC-774` | Access & Continuity System — первый прикладной модуль Raimov System |
| `DEC-786` | Expert Dental Patient Motivation System — Continuity + Care 12 + Points |

## 3.3. Текущий runtime

| Зона | Статус | Правило |
|---|---|---|
| `site-raimovdental/` | CURRENT PRODUCTION SOURCE | менять только через Website Studio, tests, merge, deploy и live smoke |
| `/ru/` | PUBLIC STAGE B | indexable strategic brand platform |
| `/ru/access-continuity/` | PUBLIC STRATEGY MODULE | объясняет модель и gates; не принимает срочные patient bookings |
| `/stage-a/` | PROTECTED STAGE A | Basic Auth, noindex, separate webroot |
| current Academy/System drafts | RESEARCHABLE ONLY | не являются доказательством работающих продуктов |
| `src/config/pricing.ts` | PROTECTED | не трогать без clinic confirmation |

---

# 4. Зафиксированные решения

## 4.1. Общий коммерческий и операционный канон

- Первый месяц остаётся `$1,900`; аванс `$1,000` получен.
- Первый месяц — setup и baseline, а не обещание мгновенного масштабирования.
- Paid traffic масштабируется только после funnel/CRM/SLA/capacity gates.
- ELITE DENTAL не продаётся публично до доказанной модели.

## 4.2. Website Stage A

- Stage A адресован Атабеку.
- Стратегию создаёт и преподносит Дмитрий.
- Траектория: `практика → система → образование → масштаб`.
- Предварительное одобрение Атабека не требуется.
- Реакция Атабека — результат презентации.
- Stage A показывает экосистему обобщённо.
- Кейсы, before/after и детальные patient/service pages не требуются.
- Stage A — protected/noindex preview.
- Gates 0A–4A source закрыты; protected preview live.

## 4.3. Публичный Stage B

- Мастер-бренд — RAIMOV DENTAL.
- Аудитория №1 — инвестор в развитие собственных клиник.
- Аудитория №2 — врачи и будущая Academy.
- Пациентский контур — позже.
- Investor CTA — стратегический разговор, не финансовое предложение.
- Stage B — RU-only.
- Medical tourism to Bishkek исключён.
- Public cutover выполнен по DEC-772.

## 4.4. Access & Continuity System

- «Срочная стоматологическая помощь» — сервисная линия внутри действующей клинической базы, а не отдельная дешёвая клиника.
- Бесплатная часть ограничена первичным триажем, маршрутом, Паспортом V0 и базовым чек-апом по именном сертификату.
- Срочная диагностика, снимки, обезболивание, лечение и расширенная диагностика оплачиваются отдельно.
- Главный conversion KPI — следующий чек-ап, записанный до ухода пациента, а не число выданных сертификатов.
- Первый пилот проводится внутри Expert Dental Studio с выделенными срочными окнами, дежурным врачом и отдельной CRM-когортой.
- Сто завершённых обращений подтверждают процесс, но не автоматически отдельное помещение.
- Expert Care 12 запускается только после проверки мощности и unit economics.
- Review gating в смысле предварительного отбора «только довольных», reward-for-review и связь сертификата с отзывом запрещены.
- DEC-787 уточняет Reputation Loop: универсальный CSAT после визита → public invite (4–5) / private recovery (1–3).
- Полный канон: `docs/ssot/RAIMOV_ACCESS_CONTINUITY_SYSTEM.md`; решения: `DEC-774`, `DEC-787`.

## 4.5. Patient Motivation System (Expert Dental)

- Единая система мотивации пациентов — три слоя: Continuity (A) → Expert Care 12 (B) → Expert Points (C).
- Layer A = фундамент DEC-774; Layers B/C не запускаются раньше Phase gates.
- Баллы начисляются за оплату, on-time recare, paid referral и семью; **не** за отзывы/UGC.
- Post-Visit Feedback Loop (DEC-787) входит в Layer A: CSAT WhatsApp → карты при 4–5 / закрытая recovery при 1–3.
- Redeem — гигиена, сервис, приоритет слота; не high-ticket % до диагностики и не кешбек.
- Expert Care 12 — профилактический абонемент, не страховка.
- Публичные claims о работающих Points/Care запрещены до operational launch.
- Полный канон: `docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md`; решения: `DEC-786`, `DEC-787`.

---

# 5. Proof policy по фазам

| Фаза | Необходимый уровень proof |
|---|---|
| Stage A | минимальные факты о текущей практике + честные статусы future-state |
| Stage B investor/doctor public | proof для каждой конкретной публичной business/biography claim + investor legal gate |
| Access & Continuity strategy page | честная модель + явный статус `формируется`; без operational claims |
| Access & Continuity operational pilot | утверждённые triage, capacity, free/paid composition, CRM, medical/data consents and cohort economics |
| Stage C patient/clinical | cases, consent, medical review, licences, reviews, clinical media |
| Closed investment materials | private baseline, unit economics, governance, legal process |

Отсутствие клинических кейсов не блокирует стратегическое описание модуля, но operational и patient claims требуют доказательств.

---

# 6. Текущая фаза

`STAGE_B_PUBLIC_LIVE / ACCESS_CONTINUITY_STRATEGY_LIVE / OPERATIONAL_PILOT_NOT_STARTED`

Completed:

1. Stage A protected strategy and Stage B public platform;
2. DEC-774 and `RAIMOV_ACCESS_CONTINUITY_SYSTEM.md`;
3. explicit free/paid boundary;
4. public Access & Continuity strategy route and home teaser;
5. deterministic build, sitemap and contract tests;
6. Website Studio/project/repository checks before release;
7. production deploy and live smoke required for the current change.

Current public surfaces:

- `https://raimovdental.com/ru/`;
- `https://raimovdental.com/ru/access-continuity/`;
- `https://raimovdental.com/stage-a/` — protected.

Next permitted operational outputs:

1. Atabek approves the exact triage and medical boundaries;
2. clinic defines free consultation/check-up composition and real price;
3. capacity and duty schedule are confirmed;
4. CRM fields, Passport V0/V1 and consent model are implemented;
5. pilot starts inside Expert Dental Studio;
6. cohorts are measured for 30/60/90 days;
7. separate capacity and Expert Care 12 are considered only after gates.

---

# 7. Открытые пробелы

| Пробел | Влияет на | Статус |
|---|---|---|
| Stage A and Stage B website gates | website | PASS |
| Access & Continuity strategy canon | Raimov System | PASS — DEC-774 / SSOT v1.0 |
| Public Access & Continuity route | Stage B | RELEASE IN CURRENT CHANGE |
| Clinical triage | operational pilot | REQUIRES ATABEK APPROVAL |
| Products 0 som composition | offer/economics | CONFIRMED — screening route only; TASK-785 |
| Real standard price and certificate term | offer/trust | OPEN |
| Capacity and urgent slots | visit SLA | OPEN |
| CRM/medical data split and consents | privacy/operations | OPEN |
| Passport V0/V1 templates | continuity | NOT STARTED |
| Cohort economics | scale gate | NOT STARTED |
| Expert Care 12 | retention (Motivation Layer B) | PATIENT-SITE INFORMATION / INQUIRY APPROVED — DEC-800; checkout and operational activation deferred |
| Expert Points ledger | loyalty (Motivation Layer C) | DEFERRED — DEC-786 |
| Motivation Phase 0 scripts (pre-book + smile preview + CSAT loop) | clinic ops | SPEC READY — admin training and live execution evidence pending |
| Separate urgent-care capacity | investment | DEFERRED |
| Case library | patient Stage C | DEFERRED |

---

# 8. Запреты текущей фазы

- не заявлять operational pilot как запущенный до подтверждения клиники;
- не обещать бесплатное лечение;
- не обещать 24/7 очный приём;
- не создавать отдельную карточку или клинику до доказанного самостоятельного подразделения;
- не публиковать неподтверждённые цены, квоты и сроки сертификата;
- не связывать сертификат, скидку или лечение с отзывом;
- не хранить медицинские данные в обычной маркетинговой CRM;
- не называть Expert Care 12 страховкой или действующим продуктом;
- не начислять баллы/скидки за отзыв, оценку, пост или сторис;
- не отбирать только «довольных» до отправки CSAT (DEC-787);
- не заявлять Expert Points или программу лояльности как уже работающие до Phase gates;
- не заявлять System, Academy, сеть или international practice как действующие;
- не придумывать cases, credentials, awards, metrics или financial proof;
- не публиковать доходность, долю, ROI или инвестиционные условия;
- не собирать KYC или инвестиционные суммы;
- не удалять legacy routes без migration map;
- не менять первый месяц и коммерческий канон.

---

# 9. Протокол обновления

1. Новое решение записывается в конкретный SSOT/DEC, затем отражается здесь.
2. Старое решение не удаляется без статуса `SUPERSEDED` или явного clarification.
3. Публичная copy не повышает статус будущего направления.
4. Изменение аудитории, глубины, языка, CTA или phase gate обновляет website strategy, project status и этот index.
5. Case requirements меняются только в применимой фазе, а не автоматически для всего сайта.
6. Operational claim появляется только после evidence, owner and verification method.

---

*RAIMOV.md v1.8 · 2026-08-01 · Stage B public; Access & Continuity strategy active; operational pilot not started.*

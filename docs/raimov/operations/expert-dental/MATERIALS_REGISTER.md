---
title: Expert Dental Studio — реестр материалов
status: ACTIVE REGISTER
version: 1.4
created: 2026-08-03
last_updated: 2026-08-05
id_prefix: ED-MAT
---

# Реестр материалов Expert Dental

## Правило

В реестр вносится каждый созданный или переданный артефакт проекта: документ, страница, статья, интерфейс, отчёт, таблица, QR-материал, скрипт, визуал, презентация или production evidence.

Новый материал получает следующий свободный ID `ED-MAT-###`. ID не переиспользуются.

## Поля записи

- постоянный ID;
- тип;
- название;
- связанный период и пункты плана;
- статус;
- владелец;
- источник или путь;
- внешняя ссылка, если существует;
- дата последнего обновления;
- примечание и ограничение.

## Канонические и операционные документы

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-001 | Strategy SSOT | Стратегия роста Expert Dental / RAIMOV / ELITE DENTAL | Общая стратегия | Active | `docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md` | — | Канон $1,900 за первый месяц и $1,000 аванса |
| ED-MAT-002 | Plan SSOT | План первого месяца и правила отчётности | Месяц 1 / 1–16 | Active / locked | `docs/ssot/EXPERT_DENTAL_MONTH_1_PLAN_AND_REPORTS.md` | — | Состав первого месяца нельзя расширять без прямой команды |
| ED-MAT-003 | Website SSOT | Канон сайта `expertdental.kg`, блога и будущей замены | 1, 4, 9 | Active | `docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md` | `https://expertdental.kg/` | Родительский документ для сайта клиники |
| ED-MAT-004 | Historical offer SSOT | История закрытого оффера Expert Dental | Исторический | Legacy/context | `docs/ssot/EXPERT_DENTAL_GROWTH_OFFER.md` | `https://caesthetic.com/private/expert-dental/offer/` | Не является текущим источником цены первого месяца |
| ED-MAT-005 | Project architecture | Общая архитектура RAIMOV Ecosystem | Общая архитектура | Active | `docs/ssot/RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE.md` | — | Родительская файловая архитектура |
| ED-MAT-006 | Operational index | Операционный индекс Expert Dental | Все периоды | Active | `docs/raimov/operations/expert-dental/README.md` | — | Точка входа в планы, отчёты и реестры |
| ED-MAT-007 | File architecture | Архитектура файлов Expert Dental | Все периоды | Active | `docs/raimov/operations/expert-dental/FILE_ARCHITECTURE.md` | — | Каноническое дерево и правила имён |
| ED-MAT-008 | Operating standard | Система планирования и отчётности | Все периоды | Active | `docs/raimov/operations/expert-dental/PLANNING_AND_REPORTING.md` | — | Процесс от плана до итогового отчёта |
| ED-MAT-009 | Register | Реестр материалов | Все периоды | Active | `docs/raimov/operations/expert-dental/MATERIALS_REGISTER.md` | — | Этот файл |
| ED-MAT-010 | Register | Реестр ссылок | Все периоды | Active | `docs/raimov/operations/expert-dental/LINKS_REGISTER.md` | — | Все известные URL проекта |

## Клиентская система планов и отчётов

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-011 | Data source | Данные клиентской витрины планов и отчётов | Месяц 1 / 1–16 | Active | `site-raimovdental/work-reports/content.mjs` | — | Производное представление из периодных документов |
| ED-MAT-012 | Build tool | Генератор страниц планов и отчётов | Месяц 1 | Active | `scripts/build-raimov-work-reports.mjs` | — | Генерирует закрытые страницы `/ru/valeria/` |
| ED-MAT-013 | Test | Контракт планов и отчётов CAESTHETIC | Месяц 1 | Active | `tests/raimovdental/valeria-work-reports.test.mjs` | — | Проверяет 5 блоков, 16 пунктов, цели и ссылки |
| ED-MAT-014 | Client hub | Перечень периодов работы CAESTHETIC | Все периоды | Live | `site-raimovdental/work-reports/` | `https://raimovdental.com/ru/valeria/` | Пароль 0726, без username |
| ED-MAT-015 | Client page | Сводная страница первого месяца | Месяц 1 | Live | `site-raimovdental/work-reports/content.mjs` | `https://raimovdental.com/ru/valeria/month-1/` | План и отчёты разделены |
| ED-MAT-016 | Client plan | Сгруппированный план первого месяца | Месяц 1 / 1–16 | Live | `site-raimovdental/work-reports/content.mjs` | `https://raimovdental.com/ru/valeria/month-1/plan/` | 5 блоков, исходная нумерация сохранена |
| ED-MAT-017 | Client reports index | Лента отчётов первого месяца | Месяц 1 | Live | `site-raimovdental/work-reports/content.mjs` | `https://raimovdental.com/ru/valeria/month-1/reports/` | Основной отчёт и подробное продолжение |
| ED-MAT-018 | Interim report | Промежуточный отчёт за первые две недели | Месяц 1 | Live / extended | `docs/raimov/operations/expert-dental/periods/month-01/reports/2026-08-02-first-two-weeks.md` | `https://raimovdental.com/ru/valeria/month-1/reports/first-two-weeks/` | Родительская страница подробного продолжения |
| ED-MAT-019 | Production evidence | Проверка группировки плана и ссылки на интерфейсы | Месяц 1 | Passed | `docs/audits/raimov/valeria-work-journal/GROUPED_PLAN_PRODUCTION.md` | — | Origin и edge pass |
| ED-MAT-020 | Production evidence | Проверка password-only доступа | Месяц 1 | Passed | `docs/audits/raimov/valeria-work-journal/FINAL_PASSWORD_CHECK.md` | — | Пароль 0726, username отсутствует |

## Сайт и контент Expert Dental

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-021 | Website page | Каталог услуг | Месяц 1 / 4, 9 | Published | Tilda / `expertdental.kg` | `http://expertdental.kg/services` | URL предоставлен пользователем |
| ED-MAT-022 | Website page | Контакты | Месяц 1 / 4 | Published | Tilda / `expertdental.kg` | `http://expertdental.kg/contacts` | URL предоставлен пользователем |
| ED-MAT-023 | Website page | Страница блога | Месяц 1 / 9 | Published | Tilda / `expertdental.kg` | `http://expertdental.kg/blog` | База для индексации |
| ED-MAT-024 | Content package | Девять статей блога | Месяц 1 / 9 | Published | Tilda / блог Expert Dental | URL-перечень не получен | Нужен отдельный список 9 точных URL |
| ED-MAT-025 | Website prototype | Тестовая новая главная | Месяц 1 / 4, 9 | Prototype / published | Tilda / `expertdental.kg` | `http://expertdental.kg/home-new` | Не заменяет необходимость полной будущей пересборки сайта |
| ED-MAT-053 | Price catalog SSOT | Прайс: направления · услуги · цены | Месяц 1 / 4 | Ready for Tilda publish | `docs/raimov/operations/expert-dental/pricing/` | ED-LINK-033 | Каталог JSON + MD + Zero Block `price-table-zero-block.html` |
| ED-MAT-054 | Care 12 pricing integration | Expert Care 12 SKU в прайсе (proposed) | Мотивация / DEC-786 | Proposed / awaiting clinic | `pricing/PRICE_CATALOG.json` membership+care12, `PRICE_TABLE.md`, Tilda prompt/Zero Block | ED-LINK-033 | Adult 9900 / Family 7900 / Kids 5500; не колонка −20% |
| ED-MAT-055 | Pricing questionnaire | Вопросы ассистенту Атабека по ценам | Прайс / Care / врачи | Sent / awaiting reply | `pricing/QUESTIONS_FOR_ATABEK_ASSISTANT_2026-08-05.md` | — | Dual-price врачей, Care, аксиография, публикация `/price` |
| ED-MAT-056 | Doctor card update | Мир-Али → гнатолог на сайте | Команда / Tilda | Ready for Tilda publish | `tilda/doctors/MIR_ALI_GNATHOLOGIST_TILDA.md`, `DOCTORS_REGISTER.md`, `media/team/talyshhanov-mir-ali.png` | expertdental.kg doctors block | Specialty string + WA CTA; live Tilda edit required |
| ED-MAT-057 | Reputation SOP | Post-Visit Feedback Loop (CSAT → карты / recovery) | Мотивация / DEC-787 | Strategy accepted / pilot gated | `reputation/POST_VISIT_FEEDBACK_LOOP.md`, `docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md` §4.1 | ED-LINK-008–010 | Без reward-for-review; Google URL всё ещё P0 |
| ED-MAT-058 | Implementation plan | Атомарный план Review Hub на clinic.raimovdental.com | Мотивация / DEC-787 | Draft / coordinating | `reputation/IMPLEMENTATION_PLAN_ATOMIC.md` | clinic.raimovdental.com | Namespace `/feedback/*`; не конфликтовать с patient-site агентом |

## Интерфейсы клиники

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-026 | Interface hub | Сводная страница интерфейсов клиники | Дополнительная работа / 7, 10, 11 | Live prototype | `site-raimovdental/public/assets/img/workspace/` | `https://raimovdental.com/assets/img/workspace/` | Владелец, управляющий, врач, администратор |
| ED-MAT-027 | Interface app | Общий рабочий интерфейс ролей | Дополнительная работа | Live prototype | `site-raimovdental/public/assets/img/workspace/app.html` | `https://raimovdental.com/assets/img/workspace/app.html` | Демо без CRM |
| ED-MAT-028 | Role interface | Интерфейс администратора | Дополнительная работа / 7 | Live prototype | `site-raimovdental/public/assets/img/workspace/admin/` | `https://raimovdental.com/assets/img/workspace/admin/` | Наиболее подробно проработанная роль |
| ED-MAT-029 | Role interface | Интерфейс врача | Дополнительная работа / 10, 11 | Preliminary | `site-raimovdental/public/assets/img/workspace/doctor/` | `https://raimovdental.com/assets/img/workspace/doctor/` | Предварительная версия |
| ED-MAT-030 | Role interface | Интерфейс управляющего | Дополнительная работа | Preliminary | `site-raimovdental/public/assets/img/workspace/manager/` | `https://raimovdental.com/assets/img/workspace/manager/` | Предварительная версия |
| ED-MAT-031 | Role interface | Интерфейс владельца | Дополнительная работа | Preliminary | `site-raimovdental/public/assets/img/workspace/owner/` | `https://raimovdental.com/assets/img/workspace/owner/` | Предварительная версия |
| ED-MAT-032 | Admin render | Детальный прототип администратора | Дополнительная работа / 7 | Live prototype | `site-raimovdental/public/assets/img/admin/` | `https://raimovdental.com/render/` | Инструкции, обучение, тестирование и скрипты |

## Результаты и материалы репутации

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-033 | Reputation result | 11 новых опубликованных отзывов Google Maps | Месяц 1 / 12–16 | Reported | Промежуточный отчёт | Точная карточка не внесена | Не гарантировать дальнейшую публикацию |
| ED-MAT-034 | Reputation result | 20 новых опубликованных отзывов 2ГИС | Месяц 1 / 12–16 | Reported | Промежуточный отчёт | ED-LINK-009 | Не гарантировать дальнейшую публикацию |
| ED-MAT-035 | QR material | QR-код на карточку Expert Dental в Яндекс Картах | Месяц 1 / 5, 13 | Target verified; source image pending | Документы v1.1 | ED-LINK-010 | Целевая ссылка подтверждена; отдельный PNG/A5-файл в репозитории не зарегистрирован |

## Файлы периода, шаблоны и контроль

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-036 | Period plan | Операционное представление плана первого месяца | Месяц 1 / 1–16 | Active / locked | `docs/raimov/operations/expert-dental/periods/month-01/PLAN.md` | ED-LINK-013 | 5 блоков, 16 исходных пунктов |
| ED-MAT-037 | Period status | Текущий статус исполнения первого месяца | Месяц 1 / 1–16 | Active | `docs/raimov/operations/expert-dental/periods/month-01/STATUS.md` | — | Последний подтверждённый срез 2026-08-02 |
| ED-MAT-038 | Reports index | Индекс отчётов первого месяца | Месяц 1 | Active | `docs/raimov/operations/expert-dental/periods/month-01/reports/README.md` | ED-LINK-014 | Маршрутизирует промежуточные и итоговый отчёты |
| ED-MAT-039 | Report template | Унифицированный шаблон отчёта | Все периоды | Active template | `docs/raimov/operations/expert-dental/templates/REPORT_TEMPLATE.md` | — | Маркетинг, запись, клиника, репутация |
| ED-MAT-040 | Register template | Шаблон регистрации материала и URL | Все периоды | Active template | `docs/raimov/operations/expert-dental/templates/MATERIAL_ENTRY_TEMPLATE.md` | — | Обязателен перед закрытием задачи |
| ED-MAT-041 | Changelog | Журнал изменений операционного контура | Все периоды | Active | `docs/raimov/operations/expert-dental/CHANGELOG.md` | — | Только архитектура и канонические изменения |
| ED-MAT-042 | Automated guard | Проверка архитектуры, 16 пунктов и реестров | Все периоды | Active | `tests/raimovdental/expert-dental-operating-architecture.test.mjs` | — | Включена в `tests/raimovdental/run-all.mjs` |

## Аналитико-управленческий пакет версии 1.1

| ID | Тип | Материал | Период / пункты | Статус | Источник | Внешняя ссылка | Примечание |
|---|---|---|---|---|---|---|---|
| ED-MAT-043 | Package handoff | Канонический статус аналитико-управленческого пакета v1.1 | Месяц 1 / 2, 4, 5, 7, 15 | Sources received / closed | `docs/raimov/operations/expert-dental/reports/2026-08-first-half/AGENT_HANDOFF_V1_1.md` | ED-LINK-025 | Подтверждает получение, публикацию и ограничения |
| ED-MAT-044 | Archive package | `EXPERT_DENTAL_REPORT_V1_1_REPO_READY.zip` | Месяц 1 | Reported / source not received | ED-MAT-043 | — | ZIP отдельно не передан; его отсутствие не блокирует полученные исходники и веб-отчёт |
| ED-MAT-045 | Management report | `EXPERT_DENTAL_MATERIALS_V1_1.docx` | Месяц 1 / 2, 4, 5, 7, 15 | Received / reviewed / used | Пользовательский файл; контрольная сумма в `manifest.json` | ED-LINK-025 | 28 страниц; источник управленческой логики и визуальных схем |
| ED-MAT-046 | Working base | `EXPERT_DENTAL_WORKING_BASE_V1_1.xlsx` | Месяц 1 / 2, 4, 5, 7, 15 | Received / reviewed / used | Пользовательский файл; контрольная сумма в `manifest.json` | ED-LINK-025 | Источник чисел, конкурентов, маршрутов, скриптов, KPI и URL |
| ED-MAT-047 | Web content | `EXPERT_DENTAL_WEB_REPORT_CONTENT.md` | Месяц 1 / 2, 4, 5, 7, 15 | Received / integrated | `docs/raimov/operations/expert-dental/reports/2026-08-first-half/WEB_REPORT_CONTENT.md` | ED-LINK-025 | Клиентская логика восьми страниц |
| ED-MAT-048 | Page blueprint | `EXPERT_DENTAL_REPORT_PAGES_BLUEPRINT.md` | Месяц 1 / 2, 4, 5, 7, 15 | Received / integrated | `docs/raimov/operations/expert-dental/reports/2026-08-first-half/REPORT_PAGES_BLUEPRINT.md` | ED-LINK-025–032 | Канон последовательности и графической структуры |
| ED-MAT-049 | Implementation prompt | `EXPERT_DENTAL_WEB_AGENT_PROMPT.md` | Месяц 1 | Received / historical only | `docs/raimov/operations/expert-dental/reports/2026-08-first-half/AGENT_WEB_PROMPT.md` | — | Cursor не запускался; файл не является разрешением на его использование |
| ED-MAT-050 | Package README | `EXPERT_DENTAL_REPO_PACKAGE_README.md` | Месяц 1 | Received / integrated | `docs/raimov/operations/expert-dental/reports/2026-08-first-half/README.md` | ED-LINK-025 | Определяет место пакета и версионирование живой системы |
| ED-MAT-051 | Detailed web report | Подробное продолжение отчёта за первые две недели, 8 страниц | Месяц 1 / 2, 4, 5, 7, 15 | Live / production verified | `site-raimovdental/expert-dental-report/`, `scripts/build-expert-dental-report.mjs` | ED-LINK-025–032 | Продолжение ED-MAT-018, не параллельный раздел |
| ED-MAT-052 | Production evidence | Origin и public-edge smoke восьми страниц и password-only доступа | Месяц 1 | Passed | `docs/audits/raimovdental-expert-dental-report/LAST_RUN.md` | ED-LINK-025–032 | Все страницы HTTP 200 после входа; 302 без сессии; пароль 0726; username отсутствует |

## Следующие свободные ID

- следующий материал: `ED-MAT-059`;
- следующая ссылка: `ED-LINK-034`;
- при добавлении материала одновременно проверить необходимость новой записи в `LINKS_REGISTER.md`;
- ZIP-пакет ED-MAT-044 остаётся неполученным и не должен выдаваться за переданный файл;
- индивидуальные URL девяти статей и точная ссылка Google Maps пока отсутствуют и должны быть добавлены после получения, без догадок.

---
title: Post-Visit Feedback Loop — атомарный план внедрения
status: DRAFT
version: 1.0
created: 2026-08-06
last_updated: 2026-08-06
pilot_host: https://clinic.raimovdental.com
canon:
  - docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md §4.1
  - docs/raimov/operations/expert-dental/reputation/POST_VISIT_FEEDBACK_LOOP.md
  - docs/founder-notes/DEC-787_post-visit-feedback-loop.md
---

# Атомарный план внедрения Review Hub

Пилот на **`https://clinic.raimovdental.com`** (staging patient-site, уже LIVE, `noindex`).  
Цель каждого атома: один результат, один владелец, один критерий done. Не начинать следующий атом без done предыдущего, если указана зависимость.

## 0. Параллельная работа — границы (обязательно прочитать)

| Контур | Владелец | Namespace / артефакты | Не трогать |
|---|---|---|---|
| Patient site staging | **параллельный агент** (homepage / content / clinic site) | `/`, `/services/`, `/doctors/`, `/blog/`, `/about/`, `/contacts/`, `assets/`, build/deploy patient-site | не переписывать главную, IA, CSS site-wide без согласования |
| Review Hub (этот план) | агент Feedback Loop / Дмитрий | **только** `/feedback/*`, `/api/feedback/*` (если появится), журнал, WA-лестница | не менять DNS/vhost целиком; только добавить location при необходимости |
| Production SSOT + deploy | grainee-v2 | `site-raimovdental/patient-site/`, `scripts/raimov/deploy-patient-site.sh staging` | **не деплоить из raimovdental satellite** |

**Сейчас на clinic:** сайт клиники отвечает `200`, `/feedback/` → `404`. Origin VPS2402, symlink releases.  
**Код сайта:** `zaomir/grainee-v2` → `site-raimovdental/patient-site/` (в этом satellite дерева может ещё не быть — синк/работа через grainee).

**Правило merge:** Review Hub PR не должен конфликтовать с правками шаблонов layout параллельного агента. Предпочтительно отдельный mini-app / отдельный template tree под `/feedback/`, общий только base CSS variables если нужно.

**DEC note:** в репо параллельно есть home-care с номером DEC-787. При merge канон Feedback Loop переименовать в **DEC-788**, если home-care оставляет 787.

---

## Фаза A — Готовность (без кода продукта)

### A1. Зафиксировать host пилота
- **Done:** в SSOT/SOP host = `https://clinic.raimovdental.com/feedback/<token>`
- **Владелец:** этот контур
- **Зависит от:** —

### A2. Согласовать namespace с параллельным агентом
- **Done:** письменное «ок»: routes `/feedback/*` + `noindex` reserved; layout clinic site не ломаем
- **Владелец:** Дмитрий / оба агента
- **Зависит от:** A1

### A3. Закрыть URL трёх карт
- **Done:** в `LINKS_REGISTER`: Яндекс (есть), 2ГИС (есть), **Google Maps точный URL (P0)**
- **Владелец:** клиника / маркетинг
- **Зависит от:** —

### A4. Утвердить тексты N0–N4 + recovery
- **Done:** clinic-approved тексты из SOP §7 (или правки)
- **Владелец:** управляющий + Дмитрий
- **Зависит от:** —

### A5. Канал алерта 1–3★
- **Done:** WhatsApp/Telegram-чат управляющего (+ главврач для клиники); тест «ping»
- **Владелец:** управляющий
- **Зависит от:** —

---

## Фаза B — Review Hub MVP на clinic (ручной цикл)

> Можно слать ссылку вручную; авто-WhatsApp ещё нет.

### B1. Skeleton route `/feedback/`
- **Done:** `https://clinic.raimovdental.com/feedback/` отдаёт `200`, `noindex`, не в main nav
- **Владелец:** feedback-агент (код в grainee patient-site)
- **Зависит от:** A2
- **Не делать:** правки homepage

### B2. Token page `/feedback/<token>`
- **Done:** валидный token → UI; невалидный → нейтральная 404/expired без PII
- **Владелец:** feedback-агент
- **Зависит от:** B1

### B3. Store состояния токена
- **Done:** persistence (SQLite/JSON/CRM table — выбрать одно) полей: score, platform clicks, timestamps, stopped
- **Данные:** без диагнозов; только token, visit meta (категория услуги, doctor_code опц.)
- **Владелец:** feedback-агент
- **Зависит от:** B2

### B4. CSAT UI 1–5★
- **Done:** выбор звёзд пишет `csat_scored`; нельзя выбрать дважды без reset admin
- **Владелец:** feedback-агент
- **Зависит от:** B3

### B5. Ветка 4–5: три кнопки карт
- **Done:** Яндекс · 2ГИС · Google; клик → redirect на площадку + `platform_clicked` + кнопка становится серой при возврате/повторном открытии
- **Владелец:** feedback-агент
- **Зависит от:** B4, A3

### B6. Ветка 1–3: форма + алерт
- **Done:** форма recovery; submit → статус + сообщение в канал A5; кнопки карт скрыты
- **Владелец:** feedback-агент
- **Зависит от:** B4, A5

### B7. Opt-out
- **Done:** «не напоминать» → `review_cycle_stopped`; Hub показывает спокойный экран
- **Владелец:** feedback-агент
- **Зависит от:** B3

### B8. Admin/journal минимальный
- **Done:** внутренняя страница или CSV/таблица: token, score, clicks, recovery (basic auth или staff-only на clinic)
- **Владелец:** feedback-агент
- **Зависит от:** B3–B6

### B9. Smoke на staging
- **Done:** чеклист: open → 5★ → click Google → reopen (Google grey) → 1★ path на другом token → alert received
- **Владелец:** Дмитрий
- **Зависит от:** B5, B6, B8

---

## Фаза C — WhatsApp вручную (пилотный персонал)

### C1. Генератор ссылки для админа
- **Done:** админ за 30 сек создаёт token после `VISITED` (форма: телефон hash/token, услуга category, doctor_code) → копирует URL
- **Владелец:** feedback-агент
- **Зависит от:** B9

### C2. Инструктаж админов (15 мин)
- **Done:** 2+ админа прошли; знают eligible/exclusions и запрет reward
- **Владелец:** управляющий
- **Зависит от:** A4, C1

### C3. Пилот N0 вручную — когорта 10
- **Done:** 10 eligible (гигиена/эстетика); отправка +60–120 мин; журнал заполнен
- **Владелец:** администратор
- **Зависит от:** C2

### C4. Разбор когорты 10
- **Done:** цифры open/score/click1; 1–3★ закрыты по SLA или эскалированы; решение go/no-go на автодожимы
- **Владелец:** управляющий + Дмитрий
- **Зависит от:** C3

---

## Фаза D — Лестница дожимов (полуавтомат)

### D1. Очередь nudges
- **Done:** по `platform_clicked` планируются N1/N2; quiet hours 09–20; STOP после 3 кликов / N4 / opt-out
- **Владелец:** feedback-агент
- **Зависит от:** C4 = go

### D2. Отправка N1–N4
- **Done v1:** админ видит «сегодня отправить» и копирует текст (полуавтомат)  
- **Done v2 (позже):** Green-API / Gupshup / иной WA API — отдельный атом D2b
- **Владелец:** feedback-агент + админ
- **Зависит от:** D1, A4

### D3. Пилот лестницы — когорта 20
- **Done:** ≥20 циклов с 4–5★; доля 2+ площадок измерена; жалоб на спам = 0 критичных
- **Владелец:** управляющий
- **Зависит от:** D2

---

## Фаза E — Операционная устойчивость

### E1. Еженедельный 30-мин разбор
- **Done:** слот в календаре + шаблон метрик (SOP §12)
- **Владелец:** управляющий
- **Зависит от:** C4

### E2. Сверка publish_detected
- **Done:** раз в неделю ручная сверка карт vs clicks; поле в журнале
- **Владелец:** маркетинг
- **Зависит от:** B8, A3

### E3. Решение о переносе на expertdental.kg
- **Done:** go/no-go после staging; тот же `/feedback/` path при cutover patient-site
- **Владелец:** Дмитрий + Атабек
- **Зависит от:** D3, E1

---

## Порядок атомов (критический путь)

```text
A1 → A2 → B1 → B2 → B3 → B4 ┬→ B5 → B9 → C1 → C2 → C3 → C4 → D1 → D2 → D3 → E3
A3 ─────────────────────────┘
A4 → C2
A5 → B6 ─┘
         B7, B8 параллельно после B3
E1/E2 после C4
```

## Явно вне пилота (не делать сейчас)

- баллы/скидки за отзыв;
- автопубликация/накрутка;
- ПроДокторов как 4-я кнопка (отдельный атом после тройки карт);
- CRM write в медкарту;
- бесконечные weekly напоминания;
- правки homepage/IA clinic site параллельного агента;
- деплой из satellite `zaomir/raimovdental`.

## Definition of pilot success (минимальный)

1. Hub на `clinic.raimovdental.com/feedback/<token>` работает end-to-end.
2. Негатив 1–3★ не уходит в карты из UI; алерт доходит.
3. Довольный пациент может пройти 1→2→3 площадки через серые кнопки + WA-дожимы.
4. Нет reward-for-review; нет pre-filter «только довольных».
5. Параллельный patient-site не сломан (главная и ключевые routes `200`).

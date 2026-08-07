# ТЗ рисерчеру: биография и профессиональный рост Атабека Раимова

**Дата:** 2026-08-07  
**Заказчик:** проект RAIMOV DENTAL / Expert Dental (Бишкек)  
**Субъект:** Раимов Атабек Саидович / Atabek Raimov  
**Этап:** **только сбор и структурирование информации** (без копирайта страницы, без публикации на patient-site)  
**Цель следующего этапа (вне scope):** страница профессиональной биографии / личного роста, которая усиливает клинику и будущую стратегию экосистемы RAIMOV  

---

## 1. Зачем это нужно (контекст стратегии)

Стратегия (`docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md`) фиксирует:

1. сильная клиника в Бишкеке (Expert Dental Studio);
2. воспроизводимая клиническая система (**Raimov System**);
3. **экспертный личный бренд Атабека Раимова**;
4. образовательный контур (**Raimov Academy**);
5. возможное масштабирование (**ELITE DENTAL** — нейтральный франчайзинговый бренд).

Диагноз: экспертность сильнее «внутри», чем снаружи; личный бренд слабо связан с воронкой. Биография нужна не как «красивое CV», а как **доказательная база доверия**:

| Аудитория | Что должна давать страница роста |
|---|---|
| Пациенты сложного лечения | почему доверять диагностике / орто-гнато / комплексным планам |
| Врачи / будущие сотрудники | почему учиться и работать рядом с ним |
| Партнёры / франшиза (позже) | авторство метода ≠ продажа фамилии франчайзи |
| Сам основатель / стратегия | карта компетенций, пробелов, сети, событий для Academy и System |

**Не цель этапа:** продающий текст, SEO-статья, автопубликация в `site-raimovdental/`.

---

## 2. Жёсткие правила (как в research pack)

1. Писать **наблюдение + источник + статус**. Домысел запрещён.
2. Статусы из DEC-727 / `research/raimov-profile/README.md`:
   - `discovered` — увидели в источнике;
   - `needs_manual_validation` — нужна ручная проверка;
   - `clinic_confirmation_required` — нужно письмо клиники;
   - `third_party_unverified` — агрегатор / чужой листинг;
   - `unverified` — упоминание без первоисточника;
   - `inferred_weak` / `inferred_strong` — **только** для фото-выводов (см. §5), никогда не путать с фактом;
   - `excluded` — PII, отзывы пациентов, DOB со справочников.
3. Запрещённые публичные бренды: Saidov Dental · Saidov System · Saidov Academy · Atabek Saidov. Фамилия канон: **Раимов / Raimov**; «Саидович» = отчество.
4. Не публиковать без gate: «400+ работ», рейтинги карт, ВНЧС-outcome claims, «автор протокола» шире черновика Raimov System, Academy-как-работающая-программа, пациентские кейсы без consent.
5. Не коммитить секреты / ПДн пациентов. Сканы дипломов — только в evidence с пометкой `rights_pending`, не в открытый patient copy.
6. Evidence binaries уже под защитой pack; новые HTML/скрины класть в согласованные пути (см. §8).

---

## 3. Что уже есть в SSOT (прочитать до поиска)

Обязательный входной пакет (не дублировать с нуля — **дополнять**):

| Документ | Роль |
|---|---|
| `research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md` | Codex: только clinic-gated public facts |
| `docs/ssot/RAIMOV_PUBLIC_PROFILE.md` | Living SSOT накопления (шире) |
| `research/raimov-profile/FACT_REGISTER.csv` | Таблица claims |
| `research/raimov-profile/SPEAKING_REGISTER.md` | Спикерство (сейчас SPK-001 DemMed) |
| `research/raimov-profile/MENTIONS_REGISTER.md` | Публичные упоминания |
| `research/raimov-profile/SOURCE_REGISTER.md` | Источники |
| `research/raimov-profile/TEAM_REGISTER.md` | Команда |
| `research/raimov-profile/CLINIC_PENDING_PACKET.md` | Что ещё ждём от клиники (C-04…C-11 критичны для био) |
| `research/raimov-profile/pending-clinic-confirmation.md` | Pending items |
| `docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md` §5, §14, §15 | Зачем личный бренд / Academy / System |
| `research/raimov-profile/queries/SEARCH_QUERIES.md` | Базовые запросы (расширить в отчёте) |
| Instagram meta: `media/instagram/doctor_raimov/{profile,posts,captions,media_manifest}.json` | 366 постов, 2019-02 → 2026-07; **бинарники фото в репо нет** |
| Instagram clinic: `media/instagram/expert_dental_studio/` | Контекст клиники / упоминания Атабека |

### Уже зафиксировано (не переизобретать)

- ФИО, роль (ортодонт-гнатолог / функциональный стоматолог), основатель брендов Expert Dental / RAIMOV DENTAL (gated wording в Codex profile).
- Клиника: Бишкек, Киевская 88, +996 555 255 455.
- **SPK-001:** спикер DemMed congress 2024 (Ош/Бишкек), тема «Микроимпланты в ортодонтии (минивинты)» — listing `bishkek.events`.
- Instagram: `@doctor_raimov` (~81k followers, verified на момент scrape 2026-08-06), `@expert_dental_studio`.
- Brand tokens: Raimov System, Raimov Academy (Academy = brand token, не доказанная программа).

### Известные дыры (приоритет поиска)

- Образование: вуз / годы / ординатура / специализация (clinic pending C-07).
- Инвентарь сертификатов и курсов (C-08).
- Полный speaking calendar сверх DemMed (C-09).
- Статус ОртоКомьюнити: основатель / участник / не упоминать (C-10).
- Raimov Academy: реальные форматы vs только CTA «записаться на обучение» в IG (C-11).
- Первичный PDF программы DemMed (SPK-002) — не retrieved.
- Международный трек (стратегия: страна не зафиксирована) — только discovery.
- Связь с именами/школами из IG (MEAW / Kim Jeong-Il, Nazrullaev, OrthoDay, Ташкент и др.) — нужна идентификация событий.

---

## 4. Источник №1 — Dropbox Instagram (обязательный visual pass)

**Ссылка:**  
https://www.dropbox.com/scl/fo/v2uvq07todc5dkkppi9q2/AH6SUJH0MwV8vkDMvx18HzM?rlkey=rviewikr4m9p73ucc5jlvjbo3&st=h8thl3xw&dl=0  

**Что это:** архив scrape `2026-08-06` (~3.1 GB zip `2026-08-06.zip`). Содержит медиа `@doctor_raimov` (и, по MENTIONS_REGISTER, связанный clinic archive). В Git уже лежат JSON (captions/posts/manifest); **фото/видео смотреть из Dropbox**.

### 4.1. Подготовка

1. Скачать zip локально (не коммитить бинарники в git без отдельного решения).
2. Сверить структуру с `media/instagram/doctor_raimov/media_manifest.json` + `posts.json` / `captions.json` (shortcode = ключ).
3. Вести таблицу **на каждый shortcode / каждый кадр sidecar**, не «на глаз по папке».

### 4.2. Протокол разбора фото/видео (на каждый ассет)

Заполнить строку в `EVENT_EVIDENCE_TABLE` (см. §8):

| Поле | Описание |
|---|---|
| `asset_id` | shortcode + индекс кадра (`DYfEeOEDeP-#0`) |
| `post_url` | `https://www.instagram.com/p/{shortcode}/` |
| `post_date` | из `timestamp` |
| `caption_excerpt` | 1–3 предложения / ключевые теги / @mentions |
| `visual_what` | Что на кадре: сцена, баннер, бейдж, сертификат, слайд, аудитория, логотипы, текст на плакате (OCR если нужно) |
| `is_atabek_visible` | yes / no / unclear |
| `role_hypothesis` | speaker / attendee / organizer / host_clinic / patient_case / lifestyle / unknown |
| `event_name_candidate` | Имя события с баннера / caption / OCR |
| `event_place_candidate` | Город / площадка |
| `event_date_candidate` | Дата с баннера или caption |
| `org_speakers_visible` | Имена/логотипы организаторов, спикеров, брендов на кадре |
| `web_match` | URL найденного мероприятия + дата проверки |
| `claim_level` | `explicit` (прямо сказано в caption/посте) · `visual_strong` (бейдж «speaker», имя на программе) · `visual_weak` (селфи в зале без роли) · `network_only` (пост про чужой курс без явного участия) · `not_event` |
| `strategic_tag` | orthodontics / gnathology / education_host / education_attendee / community / clinic_brand / international / method_MEAW / TAD_miniscrew / … |
| `publish_risk` | low / medium / high (PII пациента, чужие лица без consent, unverified credential) |
| `notes` | |

**Правило вывода:**  
- `explicit` + независимый web listing → кандидат в `SPEAKING_REGISTER` / FACT.  
- `visual_strong` без listing → `discovered` + `needs_manual_validation`.  
- `visual_weak` / `network_only` → только в research notes как **гипотеза сети**, не как «выступал».  
- Запрещено писать «участник X» если на фото только общий зал и нет имени/бейджа/caption.

### 4.3. Приоритетные кластеры (уже видны в captions — проверить визуально + найти событие)

Сид из `captions.json` (не факты участия, а **очереди на верификацию**):

| Сигнал | Примеры shortcode / тема | Что выяснить |
|---|---|---|
| DemMed / конгресс | captions с «конгресс» / DemMed | Подтвердить роль спикера vs репост; PDF программы SPK-002 |
| OrthoDay Бишкек | `DUrwwBhCCmZ` (анонс 29 марта), пост после `DWggvq0DUJ5` | Организатор / спикер / хост? Список спикеров из mentions |
| Курсы Nazrullaev / Yulduz Kasimova | `DYkP5a9jSHZ`, `DaA_LgmDBK6` (Дагестан) | Участник / спикер / промо чужого курса? |
| MEAW / Kim Jeong-Il | `DYfEeOEDeP-` | Встреча / курс / конференция / личная встреча? Где, когда |
| Ташкент / коллеги СНГ | `DYOflVvN0DS`, `DXI7ICajOl_` | Конкретное событие vs нетворкинг |
| «Обучение» CTA `0504 925 494` | ~49 постов | Это Raimov Academy / OrthoDay / внутренние курсы клиники? Собрать все форматы |
| ОртоКомьюнити | ~4 упоминания | Роль Атабека |
| Наставничество / подкаст | `DUXJqp9iKVb`, `DUmvv9oiMsj` | Название шоу, роли, URL выпуска |
| Клинические кейсы / TAD / aligners | много постов | Не био-credential; тегировать как proof-of-practice для стратегии контента |
| Короткие/пустые caption (~43) | — | **Особенно важны для visual pass** — события часто без текста |

### 4.4. Дополнительно по clinic IG

Пройти посты `@expert_dental_studio`, где Атабек назван основателем / ортодонтом / героем кейса — только для контекста роли в клинике, не дублировать всю ленту.

---

## 5. Источник №2 — открытый интернет

### 5.1. Обязательные направления поиска

**A. Идентичность и клиника**

- `Раимов Атабек Саидович`, `Атабек Раимов стоматолог`, `Atabek Raimov orthodontist Bishkek`
- site:`expertdental.kg`, site:`raimovdental.com`
- 2GIS / Google / Yandex: Expert Dental + Киевская 88 (карточки — без переноса рейтинга в факты)
- YDoc и подобные — **только discovery**, отзывы `excluded`

**B. Спикерство и образование**

- `Раимов` + `DemMed` / `конгресс` / `OrthoDay` / `ортодонтия` / `микроимпланты` / `минивинты`
- `Raimov Academy`, `обучение` + Expert Dental / Раимов
- ОртоКомьюнити + Раимов
- Программы курсов, где он в caption благодарит организаторов (Nazrullaev, Kasimova, OrthoLove, OrthoLight и т.д. — см. top mentions)

**C. Профессиональная сеть (для стратегии, не для хвастовства)**

По топ-mentions IG найти: кто это, какая школа/клиника, были ли совместные события:

`ortho.love`, `islomakramov`, `muradov_ortho`, `ortholight.ru`, `dr.ermakovaleksej`, `idris.dc`, `orthodont.kulataev`, `orthovision.kg`, `orthovision.kz`, `nazrullaevbakhrom`, `dr.yulduzkasimova`, …

**D. Медиа / YouTube / Telegram / подкасты**

- YouTube: `Атабек Раимов`, `Atabek Raimov`, Expert Dental Бишкек
- Telegram preview `@doctor_raimov` (без парсинга private)
- Подкасты/выпуски про наставничество (из caption)

**E. Запрещено поднимать в bio-draft без отдельного решения**

- who.ca-news.org и любые DOB/PII
- Зеркала отзывов (GorodWiki и аналоги)
- Пациентские истории с узнаваемыми лицами без consent ID

### 5.2. Для каждого найденного URL

В `SOURCE_CANDIDATES`:

- URL, дата доступа, title, язык  
- тип: primary_program / news / directory / social_repost / clinic_owned / video  
- что утверждает про Атабека (дословно цитата ≤280 знаков)  
- статус verification  
- нужен ли archive HTML/screenshot в `evidence/`

---

## 6. Карта «личный рост» — что собрать (рубрики)

Собрать материал по рубрикам. Пустые ячейки оставлять пустыми (`unknown`), не заполнять догадками.

### 6.1. Хронология (timeline)

Годы / этапы: образование → ранняя практика → основание клиники → специализация (орто / гнато) → публичное спикерство → образовательные форматы → личный бренд IG → связка с RAIMOV DENTAL / System / Academy.

### 6.2. Клинический профиль

Специализации (как **самоописывается** vs что можно публиковать пациентам), фокус (взрослая орто, ВНЧС/функция, междисциплинарные планы), отличия мышления (диагностика first — из стратегии и постов).

### 6.3. Предприниматель / основатель

Expert Dental Studio: основание, роль, команда (только публичные имена с источником). Связь с RAIMOV DENTAL (не смешивать юрлица без clinic OK).

### 6.4. Образователь / спикер

Курсы, конгрессы, OrthoDay, менторство, CTA обучения. Отдельно: **host** vs **guest speaker** vs **attendee**.

### 6.5. Метод / IP

Упоминания Raimov System / авторских протоколов / учебных продуктов — строго с цитатой и статусом (обычно `clinic_confirmation_required`).

### 6.6. География и сеть

Бишкек / КР, СНГ (Ташкент, Дагестан, …), международные касания (Корея/MEAW и др.) — с уровнем доказательности.

### 6.7. Пробелы для клиники (questions to founder)

Список вопросов, которые **нельзя** закрыть открытыми источниками (для `CLINIC_PENDING_PACKET` / встречи с Атабеком).

### 6.8. Стратегические выводы (осторожно)

Отдельный блок **«Implication notes»** (не факты):

- какие доказательства уже сильны для patient trust;
- какие темы усиливают Academy;
- где риск overclaim;
- какие события дают «региональный авторитет» vs «международный след».

Помечать `inference`, не смешивать с FACT_REGISTER.

---

## 7. Критерии качества результата

Готово, если:

1. Пройден visual pass по **всем** постам `@doctor_raimov` в Dropbox (366), sidecar — покадрово для event-like.
2. Для каждого `claim_level` ∈ {explicit, visual_strong} есть попытка web-match (найдено / not_found + запросы).
3. Обновлены или подготовлены патчи к регистрам: SPEAKING, MENTIONS, SOURCE, FACT (как draft diff, без автопубликации).
4. Есть timeline + gaps + questions to founder.
5. Нет выдуманных дипломов, дат и ролей.
6. Отдельно приложен список «не использовать в patient-site».

---

## 8. Deliverables (файлы)

Сложить в:

```text
research/raimov-profile/briefs/atabek-bio-growth-2026-08/
  00_README.md                 # статус прохода, % фото, блокеры
  EVENT_EVIDENCE_TABLE.csv     # §4.2 — главная таблица
  SOURCE_CANDIDATES.md         # интернет-находки
  TIMELINE.md                  # хронология с источниками
  NETWORK_MAP.md               # люди/школы/события из mentions
  GAPS_AND_QUESTIONS.md        # вопросы Атабеку / клинике
  IMPLICATION_NOTES.md         # стратегические выводы (inference)
  SEARCH_LOG.md                # какие запросы, когда, top hits
  patches/                     # предлагаемые строки в SPEAKING/FACT/MENTIONS (не мержить без ревью)
```

При необходимости: `evidence/excerpts/` + `evidence/pages/` для ключевых HTML (как уже сделано для DemMed).

**Формат CSV:** UTF-8, заголовки = поля §4.2.

---

## 9. Вне scope этого этапа

- Написание финального текста страницы «О докторе» / «Путь».
- Публикация в `site-raimovdental/` / деплой.
- Медицинский review формулировок ВНЧС.
- Сбор patient consent / model release (только пометить, где нужно).
- Финансовые метрики клиники, реклама, CRM.

---

## 10. Оценка трудозатрат (ориентир)

| Блок | Оценка |
|---|---|
| Чтение SSOT + стратегия | 1–2 ч |
| Visual pass 366 постов + sidecar event frames | 8–14 ч |
| Web verification event candidates | 4–8 ч |
| Сеть / mentions / YouTube / listings | 3–5 ч |
| Сборка timeline + gaps + implication notes | 2–3 ч |
| **Итого** | **~18–32 ч** |

Можно дробить: Pass A (только event-like по caption keywords + пустые caption) → Pass B (остальные кадры на баннеры/бейджи).

---

## 11. Definition of done для handoff копирайтеру/стратегу

Пакет из §8 + одностраничное резюме:

> «Что мы можем доказать / что только предполагаем / что спросить у Атабека / какие 5–7 опор биографии усиливают клинику и Academy».

После этого — отдельное ТЗ на текст страницы (не этот документ).

---

## 12. Контакты артефактов

| Артефакт | Путь / URL |
|---|---|
| Этот brief | `research/raimov-profile/briefs/RESEARCH_BRIEF_ATABEK_BIO_GROWTH_2026-08.md` |
| Dropbox IG | ссылка §4 |
| Local IG JSON | `research/raimov-profile/media/instagram/doctor_raimov/` |
| Strategy SSOT | `docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md` |
| Public profile living | `docs/ssot/RAIMOV_PUBLIC_PROFILE.md` |
| Codex gated subset | `research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md` |

---

*Brief v1 · 2026-08-07 · research-only · no patient-site publish*

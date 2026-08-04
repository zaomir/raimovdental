# CLINIC_PENDING_PACKET — compact checklist for RAIMOV DENTAL

**Purpose:** one page the clinic can tick / reply to in writing.  
**Language for clinic:** Russian questions below; answers may be RU or EN.  
**Do not** treat silence or Instagram bio as confirmation.

**Related:** `pending-clinic-confirmation.md`, `CONTENT_REQUIRED_FROM_CLINIC.md`, DEC-727 Commit-3 gate.  
**Research merge:** PR #471 → `eaa9e61a1` on `origin/main`.

---

## How to answer

For each item: **ДА / НЕТ / УТОЧНИТЬ** + short text or attachment (PDF/scan/URL).

---

## 1. Legal entity & brand

| # | Question |
|---|---|
| C-01 | Юридическое название клиники / клиник, которые можно указывать на raimovdental.com |
| C-02 | Как публично описывать связь **Expert Dental Studio / Expert dental clinic** и **RAIMOV DENTAL**? (одна организация / ребрендинг / разные юрлица / не связывать) |
| C-03 | Можно ли ставить ссылку на https://www.expertdental.kg с patient-site? |

## 2. Doctor — title & specializations

| # | Question |
|---|---|
| C-04 | Официальная **должность** для сайта (RU + EN) |
| C-05 | Утверждённый список **специализаций** (что можно писать пациентам) |
| C-06 | Можно ли публично упоминать работу с ВНЧС / гнатологией? Если да — точная формулировка |

## 3. Education & certificates

| # | Question |
|---|---|
| C-07 | Образование: вуз, степень, год (только то, что можно публиковать) |
| C-08 | Сертификаты / аккредитации: название, выдавший, год, срок (сканы + право показать на сайте) |

## 4. Speaking / community / Academy

| # | Question |
|---|---|
| C-09 | Подтверждаете выступление на Стоматологическом конгрессе DemMed (Ош 16.03.2024 / Бишкек 30.03.2024), тема «Микроимпланты в ортодонтии»? Какая формулировка для сайта? |
| C-10 | Статус **ОртоКомьюнити**: основатель / участник / не упоминать |
| C-11 | **Raimov Academy**: действующая программа или только бренд-имя? Если программа — список форматов, аудитория, как записаться |

## 5. Team

| # | Question |
|---|---|
| C-12 | Полный roster для `/ru/komanda/`: ФИО, роль, кто публикуется |
| C-13 | Письменное согласие каждого сотрудника на имя + фото + био на patient-site |
| C-14 | Имена с expertdental.kg (Талышханов Мир-Али, Грибанова М.Н., Халбаев И.Я., Дуйшеева А.Б., Керимкулова А.Т., Эргешова Б.Э., Таалайбекова Ч.Т.) — включать / исключить / править |

## 6. Media rights

| # | Question |
|---|---|
| C-15 | Профессиональное фото Атабека для сайта: файл + правообладатель + model release |
| C-16 | Можно ли переиспользовать фото с expertdental.kg / Tilda / Instagram на raimovdental.com? |
| C-17 | Интерьер / оборудование / «работы» — какие ассеты разрешены |

## 7. Cases & reviews

| # | Question |
|---|---|
| C-18 | Список кейсов с **patient consent ID** (без ПДн в открытом виде) |
| C-19 | Какие отзывы можно цитировать: текст + URL первоисточника + согласие |
| C-20 | Запрет: не публиковать «N завершённых работ» / рейтинг карт без вашего явного ОК |

## 8. Contacts & maps & social

| # | Question |
|---|---|
| C-21 | Канонический телефон и WhatsApp для RAIMOV DENTAL (подтвердить +996 555 255 455 или дать другой) |
| C-22 | Telegram / Instagram clinic / Instagram doctor — какие handles официальные для CTA |
| C-23 | Google Business / Place ID или share-ссылка |
| C-24 | Подтвердить 2ГИС: https://2gis.kg/bishkek/firm/70000001089655879 |
| C-25 | Каноническая карточка Яндекс.Карт (org), не только house pin |

## 9. Pricing & services copy

| # | Question |
|---|---|
| C-26 | Утверждённый прайс / диапазоны для patient-site (или «цены только после консультации») |
| C-27 | Медицинский ревьюер текстовстов услуг (имя + дата) |

---

## Reply format (clinic)

```text
C-01: ДА — …
C-02: …
…
Attachments: education.pdf, certificates.zip, photo-release.pdf, …
Signed: <name>, <role>, <date>
```

## Internal rule after reply

- Store clinic answer packet under `research/raimov-profile/evidence/clinic-packet/` (metadata + approved files only).
- Upgrade individual FACT rows only; **never** bulk-copy research archive into production JSON.
- Commit-3 (DEC-727) starts only when written answers cover the facts you intend to publish.

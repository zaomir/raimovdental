# CTA copy contract — RAIMOV DENTAL

**Status:** active · 2026-07-21  
**Rule:** one primary booking phrase across hero, header, sticky, first-visit, final CTA, diagnostics lead form.

## Primary (patient booking)

| Locale | Label | Default href |
|---|---|---|
| RU | Записаться на комплексную диагностику | `/ru/kompleksnaya-diagnostika/#lead-form` |
| EN | Book comprehensive diagnostics | `/en/comprehensive-diagnostics/#lead-form` |

Analytics: `diagnostic_cta_click` (header) · `hero_cta_click` (hero/sticky/first-visit).

## Secondary

| Locale | Label | Href |
|---|---|---|
| RU | Написать в WhatsApp | `siteConfig.contacts.whatsappHref` |
| EN | Message on WhatsApp | same |

Analytics: `whatsapp_click`.

## Tertiary (mobile sticky only)

| Locale | Label | Href |
|---|---|---|
| RU | Позвонить | `tel:+996555255455` |
| EN | Call | same |

Analytics: `phone_click`.

## Forbidden variants (do not mix on patient surfaces)

- «Обсудить случай» / «Discuss a case» as primary booking CTA  
- «Разобраться со своим случаем» as primary booking CTA  
- Generic «Записаться» / «Book» without diagnostics meaning (sticky exception: short label OK if `aria-label` / title clarifies)

## Lead form titles

| Surface | RU | EN |
|---|---|---|
| Home | Записаться на комплексную диагностику | Book comprehensive diagnostics |
| Diagnostics service | Записаться на комплексную диагностику | Book comprehensive diagnostics |
| Contact | Обращение пациента | Patient request |

## Second opinion (WhatsApp prefill — not primary)

RU: «Нужно второе мнение» · EN: «Second opinion» · analytics `second_opinion_click`.

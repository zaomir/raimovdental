# Первый визит — product SSOT (RAIMOV DENTAL)

**Status:** structural publish live (2026-07-21); numeric price/duration/credit still pending clinic confirmation  
**Pricing SSOT:** `src/config/pricing.ts` → band `first_visit` (must stay `status: "tbd"` until clinic confirms)  
**Branch:** `feat/raimovdental-commercial-home-v2`  
**Updated:** 2026-07-21

Fields below are the public product model for homepage section «Первый визит».  
Until the clinic confirms a field, set `status: "tbd"` and **do not render it as a fact** in UI.

| Field | RU draft (structure only) | EN draft (structure only) | status |
|---|---|---|---|
| `publicName` | Первый визит / комплексная диагностика | First visit / comprehensive diagnostics | tbd |
| `conductedBy` | Атабек Раимов и/или назначенный специалист по профилю задачи | Atabek Raimov and/or the specialist assigned to the case | tbd |
| `duration` | Диапазон длительности визита (мин) | Visit duration range (min) | tbd |
| `includes` | Что входит в визит (список шагов) | What the visit includes (step list) | tbd |
| `patientReceives` | Что пациент получает после визита: варианты, последовательность, сроки, этапный бюджет | What the patient receives: options, sequence, timeline, staged budget | tbd |
| `price` | Только через `pricing.ts` → `first_visit` | Same — `pricing.ts` only | tbd |
| `priceCreditedToTreatment` | Засчитывается ли стоимость визита в лечение | Whether visit fee is credited toward treatment | tbd |
| `stagedTreatmentAllowed` | Можно ли разбить лечение на этапы | Whether treatment can be staged | tbd |
| `nextStepAfterDiagnostics` | Следующий шаг после диагностики | Next step after diagnostics | tbd |

## Publish rules

- Homepage may show **structural** copy (what the visit is for) without inventing minutes, prices, or guarantees.
- Any numeric price, duration, credit-to-treatment claim, or named equipment requires clinic confirmation + `publishable: true`.
- No promises of «идеальная улыбка», «без боли», guaranteed outcome.

## Related content gate

See `CONTENT_REQUIRED_FROM_CLINIC.md` § First visit / release gate.

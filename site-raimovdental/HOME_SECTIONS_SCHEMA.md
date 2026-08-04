# Homepage data schemas (commercial home v2)

**Branch:** `feat/raimovdental-commercial-home-v2`  
**UI order (final integrator only):** 1 Hero → 2 JTBD → 3 Cases → 4 First visit → 5 Raimov System → 6 Doctor → 7 Flagship services → 8 Reviews → 9 Clinic gallery → 10 FAQ → 11 Final CTA → 12 Contacts/map  

Lane A fills JSON. Lane B does not touch these files. Blocks without `publishable: true` content must be omitted by the UI (no TBD stubs).

## 1. `hero`

```json
{
  "h1": "string",
  "subtitle": "string",
  "primaryCta": { "label": "string", "href": "string", "analytics": "string" },
  "secondaryCta": { "label": "string", "href": "string", "analytics": "string" },
  "media": {
    "type": "image|video|null",
    "src": "string|null",
    "alt": "string|null",
    "poster": "string|null",
    "publishable": false
  },
  "trustFacts": [
    { "id": "string", "label": "string", "value": "string", "publishable": false, "source": "string|null" }
  ]
}
```

## 2. `patientGoals` (JTBD)

```json
{
  "heading": "string",
  "items": [
    {
      "id": "aesthetics|missing_teeth|bite|full_rehab|second_opinion",
      "label": "string",
      "href": "string",
      "interest": "veneers|implants|orthodontics|full_rehabilitation|diagnostics|second_opinion|other"
    }
  ]
}
```

## 3. `cases` (home teaser; detail in `cases.{ru,en}.json`)

```json
{
  "heading": "string",
  "items": ["slug"],
  "emptyStateHidden": true
}
```

Case model (in `cases.*.json`):

```json
{
  "slug": "string",
  "title": "string",
  "problem": "string",
  "solution": "string",
  "stages": ["string"],
  "durationRange": "string|null",
  "result": "string",
  "beforeImages": [{ "src": "string", "alt": "string" }],
  "afterImages": [{ "src": "string", "alt": "string" }],
  "consentReference": "string|null",
  "medicalReviewer": "string|null",
  "reviewedAt": "YYYY-MM-DD|null",
  "relatedServices": ["string"],
  "status": "draft|verified",
  "publishable": false
}
```

## 4. `firstVisit`

Align with `FIRST_VISIT_PRODUCT.md`. Price only via pricing band `first_visit`.

```json
{
  "heading": "string",
  "publicName": "string",
  "conductedBy": { "text": "string", "status": "tbd|confirmed" },
  "duration": { "text": "string", "status": "tbd|confirmed" },
  "includes": [{ "text": "string", "status": "tbd|confirmed" }],
  "patientReceives": [{ "text": "string", "status": "tbd|confirmed" }],
  "priceBandId": "first_visit",
  "priceCreditedToTreatment": { "text": "string", "status": "tbd|confirmed" },
  "stagedTreatmentAllowed": { "text": "string", "status": "tbd|confirmed" },
  "nextStepAfterDiagnostics": { "text": "string", "status": "tbd|confirmed" },
  "publishable": false
}
```

## 5. `raimovSystem` (benefit-led)

```json
{
  "heading": "string",
  "steps": [
    { "id": "diagnostics|design|coordination|sequence|budget|control", "title": "string", "benefit": "string" }
  ],
  "cta": { "label": "string", "href": "string" }
}
```

## 6. `doctor`

```json
{
  "heading": "string",
  "name": "string",
  "role": { "text": "string", "publishable": false },
  "competencies": [{ "text": "string", "publishable": false }],
  "photo": { "src": "string|null", "alt": "string", "publishable": false },
  "profileHref": "string",
  "body": "string"
}
```

## 7. `flagshipServices`

Existing shape OK: heading + items `{ title, href, description }`.

## 8. `reviews`

```json
{
  "heading": "string",
  "items": [
    {
      "id": "string",
      "quote": "string",
      "authorDisplay": "string",
      "platform": "google|yandex|2gis|other",
      "sourceUrl": "string",
      "publishable": false
    }
  ]
}
```

## 9. `clinicGallery`

```json
{
  "heading": "string",
  "items": [
    { "src": "string", "alt": "string", "kind": "clinic|team|equipment", "publishable": false }
  ]
}
```

## 10. `faq`

```json
{
  "heading": "string",
  "items": [{ "q": "string", "a": "string", "publishable": true }]
}
```

## 11. `finalCta`

```json
{
  "heading": "string",
  "body": "string",
  "primaryCta": { "label": "string", "href": "string" },
  "secondaryCta": { "label": "string", "href": "string" },
  "secondOpinion": {
    "label": "string",
    "whatsappPrefillKey": "second_opinion",
    "note": "string"
  }
}
```

## 12. Contacts / map

From `contact.{ru,en}.json` + `siteConfig.contacts` (Lane B owns config values).

## Release gate (noindex → index)

Minimum before removing `noindex` (also in `CONTENT_REQUIRED_FROM_CLINIC.md`):

1. 1 professional hero photo of Atabek Raimov  
2. 1 horizontal doctor-in-clinic photo  
3. ≥4 fully confirmed cases  
4. ≥6 reviews with source URLs  
5. ≥8 clinic/team/equipment photos  
6. Confirmed title, specializations, education  
7. First-visit terms + price in `pricing.ts`  
8. Live contacts, Telegram deeplink, maps, hours  
9. CRM SLA + responsible admin  

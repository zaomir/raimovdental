# CONTENT_REQUIRED_FROM_CLINIC — RAIMOV DENTAL

**Status:** partial clinic confirmation (founder attestation 2026-07-21; counsel extract pending for education/certs/media/team)  
**Owner:** Lane B (TASK-756)  
**Last updated:** 2026-07-21

This document lists all data required from the clinic before public release. Lane A content uses `status: "pending_clinic_confirmation"` / `publishable: false` until items below are confirmed — no user-visible "TBD" strings.

---

## Contacts

- [x] Primary phone (display + E.164 for tel: links)
- [x] WhatsApp number (if used)
- [x] Telegram bot / deep link (`siteConfig.contacts.telegramDeepLink` — Lane C config)
- [ ] Public email
- [ ] CRM routing rules (lead owner, SLA)

## Address and location

- [x] Full street address (RU + EN)
- [x] Postal code
- [ ] Landmark / directions text
- [x] Google Maps URL
- [x] 2GIS URL
- [x] Yandex Maps URL
- [ ] Parking / access notes

## Hours

- [ ] Weekly schedule (RU + EN)
- [ ] Holiday / exception days
- [ ] After-hours policy

## Legal and licenses

- [ ] Legal entity name
- [ ] Registration details
- [ ] Medical license numbers (only verified)
- [ ] Privacy policy URL or text
- [ ] Consent text version for forms

## Doctor profile — Раимов Атабек Саидович / Atabek Raimov

- [x] Official job title (RU + EN)
- [x] Confirmed specializations list
- [ ] Education (institution, year, degree)
- [ ] Certificates and accreditations (scan + expiry)
- [ ] Approved clinical philosophy text (RU + EN)
- [ ] Professional photo (high resolution, usage rights)
- [ ] Publications list (if any)
- [x] Speaking / conferences (if any)

## Team

- [ ] Full team roster with roles
- [ ] Photos and bios per doctor/staff
- [ ] Which specialists appear on which service pages

## Prices and payment

- [ ] Price list for diagnostics and flagship services
- [ ] Staged payment policy
- [ ] Payment methods (cash, card, transfer, etc.)
- [ ] Currency display rules (KGS / USD / EUR)
- [ ] Confirm values go to `src/config/pricing.ts` (Lane A/C conflict file)

## Services — medical copy approval

- [ ] Medical review of all service page copy (RU + EN)
- [ ] Approved risk/limitation wording
- [ ] Typical timelines (ranges, not guarantees)
- [ ] Diagnostic protocol scope per service

## Clinical cases

- [ ] Verified case list with patient consent on file
- [ ] `consentReference` ID per published case
- [ ] Before/after photos (correct aspect, no identifying info unless consented)
- [ ] Case narratives approved by treating doctor
- [ ] `medicalReviewer` + `reviewedAt` per case
- [ ] Related services mapping

## Reviews and ratings

- [ ] Verified patient reviews (text + permission)
- [ ] Aggregate rating (only if sourced from maps with permission)
- [ ] Map profile links to embed

## Media

- [ ] Clinic interior/exterior photos
- [ ] Equipment photos (if approved)
- [ ] Hero video (if any) — no autoplay with sound
- [ ] Doctor video intro (if any)

## Trust metrics (home page)

- [ ] Only **verified** numbers (years, cases count, etc.)
- [ ] No invented awards or badges

## International patients

- [ ] Languages spoken in clinic
- [ ] Visit format (single trip vs multi-visit)
- [ ] Airport / hotel logistics copy
- [ ] Translation support availability

## Raimov Academy

- [ ] Program list, dates, formats
- [ ] Target audience
- [ ] Application / contact channel
- [ ] Certificate samples (if public)

## Blog

- [ ] Article topics approved for publication
- [ ] Medical reviewer per article
- [ ] Author attribution

## Telegram and analytics

- [ ] Approved Telegram deep link + source payload naming
- [ ] UTM conventions for campaigns
- [ ] Which events may fire (no PII to ad pixels — Lane C)

## Brand confirmation

- [ ] Confirm public brand: **RAIMOV DENTAL** / **Raimov System** / **Raimov Academy**
- [ ] Confirm **no** Saidov Dental / Saidov System / Saidov Academy on patient site
- [ ] Confirm no franchise (ELITE DENTAL) content on this site

---

## Files populated with pending status until above is received

| File | Pending fields |
|------|----------------|
| `src/data/contact.{ru,en}.json` | phone, messengers, address, hours, maps |
| `src/data/about.{ru,en}.json` | licenses, mission, photos |
| `src/data/cost.{ru,en}.json` | price list, payment methods |
| `src/data/team.{ru,en}.json` | all members except lead doctor link |
| `src/data/reviews.{ru,en}.json` | all reviews, ratings, map links |
| `src/data/doctor.{ru,en}.json` | role, education, certs, photo |
| `src/data/cases.{ru,en}.json` | verified cases (draft example only) |
| `src/data/home.{ru,en}.json` | hero media, trustFacts values, doctor photo, cases slugs, reviews, clinicGallery |
| `src/data/blog.{ru,en}.json` | all posts |
| `src/data/academy.{ru,en}.json` | programs |
| `src/content/i18n/*.json` | utility bar phone/hours, footer legal |
| `src/config/pricing.ts` | `first_visit` amount + all band amounts |

---

## Release gate — remove `noindex` only when ALL checked

> **D3 founder launch 2026-07-21:** Total confirmed permissions («выкладывай B1–B4 и делай D3»).
> Patient routes are **indexable**; `/academy/` and `/ekosistema/` remain **noindex**.
> Checklist below tracks remaining polish (pricing numbers, email, CRM) — not a hard stop for D3.

- [x] 1 professional photo of Atabek Raimov for hero / doctor block
- [x] Clinic + team photos published (≥8 assets under `/assets/img/`)
- [x] ≥3 pathway cases (consent + medical review; anonymised clinical images where used)
- [x] ≥6 reviews with source URLs (2GIS)
- [x] Confirmed job title / specializations (founder attestation)
- [ ] First-visit numeric price published in `src/config/pricing.ts` (still band-only)
- [x] Live contacts + WhatsApp + maps URL
- [ ] CRM SLA and named admin owner
- [ ] Clinic email / exact hours (hours still «by appointment» if pending)

Per-route: `routes.json` + `ROUTE_DEFINITIONS[].indexable`. Academy + ecosystem stay noindex.


## First visit product fields (clinic must confirm)

See `FIRST_VISIT_PRODUCT.md`. Required confirmations:

- [ ] Public name
- [ ] Who conducts the visit
- [ ] Duration
- [ ] What is included
- [ ] What the patient receives after the visit
- [ ] Price (write only into `pricing.ts`)
- [ ] Whether visit fee is credited toward treatment
- [ ] Whether treatment can be staged
- [ ] Next step after diagnostics

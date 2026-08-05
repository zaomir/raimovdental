# RAIMOV ECOSYSTEM PROJECT STATUS

**Date:** 2026-08-05  
**Status:** STAGE_B_PUBLIC_LIVE / ACCESS_CONTINUITY_STRATEGY_LIVE / PATIENT_MOTIVATION_SSOT_LIVE / HOME_CARE_HANDOFF_SSOT_LIVE / OPERATIONAL_PILOT_NOT_STARTED  
**Current operating business:** Expert Dental Studio, Bishkek  
**Master brand:** RAIMOV DENTAL  
**Public site:** Stage B at `/ru/`; Access & Continuity at `/ru/access-continuity/`; Stage A protected at `/stage-a/`

## Главный вывод

RAIMOV DENTAL now publicly explains its first applied system module: **Access & Continuity System**.

The module connects:

`обращение → триаж → срочная помощь → Паспорт V0 → записанный чек-ап → Паспорт V1 → диагностика → комплексный план → лечение → профилактика`

DEC-786 adds the clinic retention canon: **Expert Dental Patient Motivation System** (Continuity + Expert Care 12 + Expert Points). Strategy SSOT is live; Care 12 and Points remain operationally deferred.

DEC-787 adds **Home Care Handoff System** (showcase / doctor care class / admin memo+basket). Strategy SSOT is live; medical review of memos, approved SKU list and reception pilot remain gated. Contract-continuation question pack: `docs/ssot/EXPERT_DENTAL_CONTRACT_CONTINUATION_QUESTIONS.md`.

The website is live, but the clinical operational pilot is not launched by this release. It still requires Atabek/clinic approval of triage, the exact free-check-up composition, capacity, staff responsibilities, medical/data consents and cohort economics.

## Live surfaces

- `https://raimovdental.com/ru/`
- `https://raimovdental.com/ru/access-continuity/`
- `https://raimovdental.com/stage-a/` — Basic Auth, noindex/no-store

## Production evidence

- Feature PR: `#578`
- Feature merge: `ef1b9b49f03ca9b471a79f5b9f25d952c90375fb`
- Cutover smoke fix PR: `#588`
- Production source SHA: `cb65d499ca886efe14329ef33855302dbebb153d`
- Successful deployment run: `30674593146`
- Backup: `/root/raimovdental-cutover-backups/20260801T000521Z`
- Evidence: `docs/audits/raimov/releases/access-continuity/PRODUCTION_DEPLOY_2026-08-01.md`

## Live acceptance

- `/ru/` → `200` and contains the Access & Continuity teaser;
- `/ru/access-continuity/` → `200`;
- sitemap contains the new route;
- public pages remain indexable and do not require authentication;
- `/stage-a/` without auth → `401`;
- wrong Stage A password → `401`;
- current valid Stage A credentials → `200`;
- Stage A noindex/no-store preserved.

## Accepted strategy

- DEC-774 defines Access & Continuity as the first applied Raimov System module.
- It is a service line/pilot inside Expert Dental Studio, not a separate cheap clinic.
- Free triage/routing and paid diagnostics/treatment are explicitly separated.
- The main conversion KPI is a pre-booked next check-up, not certificate count.
- Passport V0/V1 and warm specialist handoff provide continuity.
- One hundred urgent cases prove the process, not a new-location investment case.
- Expert Care 12 and separate capacity require later gates.
- Review gating and incentives tied to review tone are prohibited.
- DEC-786 defines Patient Motivation System: Continuity foundation + gated Care 12 + Expert Points (no review rewards).
- DEC-787 defines Home Care Handoff System: showcase / doctor care class / admin memo+basket (medical+SKU gates open).

## Completed

- Public Stage B RU-only strategic platform.
- Protected Stage A presentation.
- DEC-774 and `RAIMOV_ACCESS_CONTINUITY_SYSTEM.md`.
- DEC-786 and `EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md`.
- DEC-787 and `EXPERT_DENTAL_HOME_CARE_HANDOFF_SYSTEM.md` + `EXPERT_DENTAL_CONTRACT_CONTINUATION_QUESTIONS.md`.
- Public home teaser and dedicated strategy route.
- Deterministic build, robots and sitemap integration.
- Contract tests plus Playwright/Axe responsive gate.
- Website Studio Guard, project check, repo check and docs guards PASS.
- Rollback-safe production deploy and Cloudflare smoke PASS.

## Next operational milestone

1. Atabek approves triage and clinical boundaries.
2. Clinic fixes the exact composition and real standard price of the free check-up.
3. Urgent slots, duty schedule and capacity are confirmed.
4. Marketing CRM and medical-system data boundaries are implemented.
5. Passport V0/V1, certificate and consent templates are approved.
6. Pilot starts inside Expert Dental Studio.
7. Cohorts are measured for 30/60/90 days.
8. Separate capacity and Expert Care 12 are considered only after positive gates.
9. Motivation Phase 0 (pre-book + simple referral) after Continuity pilot start; Points/Care per DEC-786 phases.
10. Home Care Phase 1–3: medical review memos → approved SKU → 2-week reception pilot (DEC-787).
11. Contract continuation answers: D-01…D-09 and M-07/M-15 via clinic assistant packet.

## Deferred

- Patient emergency-booking funnel before operational readiness.
- Separate urgent-care clinic/card/profile.
- 24/7 in-person claims.
- Approved public prices and social quotas.
- Expert Care 12 launch.
- Expert Points operational ledger.
- Stage C cases/service pages and EN site.
- Network counts, investment terms and financial promises.

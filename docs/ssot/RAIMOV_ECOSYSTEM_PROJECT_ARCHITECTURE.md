# RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE.md

> **Implementation profile** of `docs/ssot/PROJECT_ARCHITECTURE_STANDARD.md` (global canon). This file defines the domain-specific topology for the Healthcare Ecosystem. It is not an alternative global standard.

**Version:** 1.2  
**Date:** 2026-07-24  
**Status:** CANON / FILE-STRUCTURE LOCK / MIGRATION-SAFE  
**Repository:** `zaomir/grainee-v2`, `main`  
**Current operating business:** Expert Dental Studio, Bishkek  
**Master/public brand:** RAIMOV DENTAL  
**Future separate network brand:** ELITE DENTAL

## Purpose

This document defines repository topology, ownership boundaries and release gates for:

- Expert Dental Studio;
- RAIMOV DENTAL;
- Atabek Raimov;
- RAIM SMILE SYSTEM;
- Raimov Academy;
- directly controlled future clinics;
- the later international expert track;
- the future ELITE DENTAL contour.

Strategy authorities:

- clinic growth, funnel and long-term ecosystem — `docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md`;
- website phases, audiences, depth and replacement — `docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md`;
- founder clarification of Stage A — `docs/founder-notes/DEC-743_raimovdental-stage-a-strategic-presentation.md`.

This architecture organises implementation around those strategies; it does not replace them.

## Core principles

1. One authoritative source for each class of statement.
2. Evidence, public facts, strategy, copy, legal, operations, runtime and generated output remain separate.
3. Expert Dental Studio is the current operating clinic.
4. RAIMOV DENTAL is the master brand and perspective of a future group of directly controlled clinics.
5. RAIM SMILE SYSTEM, Academy, new clinics, international practice and ELITE DENTAL must be labelled by real status.
6. Stage A is a protected strategic presentation from Dmitry to Atabek; it is not a public launch.
7. Atabek approval is an outcome of Stage A, not a prerequisite for its Site Map, design or representative page.
8. Stage A requires a minimal truth register, not case-level clinical proof.
9. Cases, consent and detailed medical evidence become mandatory for the future clinical/patient contour.
10. No medical, financial, legal or investment statement is published without the gate applicable to that phase.
11. `site-raimovdental/` remains the current production root and future replacement root.
12. Documentation and Stage A work do not authorise production replacement, DNS change or public deploy.
13. Git never stores secrets, patient records, medical files, signed confidential contracts, KYC, unrestricted personal data or private investor documents.
14. The first-month commercial canon remains `$1,900`, with `$1,000` received.
15. Replacement v1 is RU-only. Existing EN routes remain legacy until migration mapping.

## Canonical namespaces

```text
docs/ssot/RAIMOV*.md
docs/ssot/EXPERT_DENTAL*.md
docs/ssot/ELITE_DENTAL*.md
docs/founder-notes/DEC-74x_*.md
docs/raimov/
docs/copy/raimov/{ru,en}/
docs/legal/raimov/
docs/legal-templates/raimov/
docs/audits/raimov/
docs/research/raimov/
research/raimov-profile/
site-raimovdental/
scripts/raimov/
tests/raimov/
```

`docs/copy/raimov/en/` and current EN runtime files remain valid legacy/future-localisation zones. Their existence does not create an EN parity requirement for replacement v1.

## Target tree

```text
docs/raimov/
├── README.md
├── PROJECT_STATUS.md
├── governance/          # decisions, ownership, dependencies, change control
├── corporate/           # legal identity, domains, brands, entities, licences
├── clinic-growth/       # baseline, offers, capacity, unit economics
├── patient-funnel/      # lead → booking → visit → diagnosis → plan → payment → recall (+ motivation SSOT DEC-786)
├── clinical-system/     # RAIM SMILE SYSTEM modules and quality standards
├── academy/             # future education products and release gates
├── elite-dental/        # future separate partner/franchise contour
├── content/             # route, CTA, truth/proof and editorial registers
├── design/              # brand, assets, components and accessibility decisions
├── technology/          # build, analytics, CRM interfaces, security and runtime
├── release/             # manifests, migration maps, smoke and rollback
└── operations/          # roles, SOPs, reporting cadence and data ownership

docs/copy/raimov/
├── README.md
├── ru/{routes,components,metadata,academy,professional,release-2}/
└── en/{routes,components,metadata,academy,professional,release-2}/  # legacy/future localisation

docs/legal/raimov/
├── website/
├── clinic/
├── patient-consent/
├── data-protection/
├── investor-communications/
├── academy/
├── franchise/
└── clearances/

docs/audits/raimov/
├── baseline/
├── funnel/
├── crm/
├── maps/
├── claims/
├── rights/
├── legal/
├── security/
├── accessibility/
├── performance/
└── releases/

docs/research/raimov/
├── competitors/
├── patient-intent/
├── investor-intent/
├── clinical-services/
├── maps-reputation/
├── international/
├── academy/
├── franchise/
└── visual-references/

research/raimov-profile/  # Layer 0 evidence and rights pack
site-raimovdental/        # current production source + future replacement root
scripts/raimov/{gates,generators,reports,migration,lib}/
tests/raimov/{e2e,axe,forms,security,release,visual,redirects,helpers}/
```

Directories are materialised only when there is a real owner, task or evidence source.

## Business-domain boundaries

| Domain | Current state | Repository owner | Release rule |
|---|---|---|---|
| Expert Dental Studio | operating clinic in Bishkek | `docs/raimov/clinic-growth/`, `patient-funnel/`, `operations/` | current facts only after confirmation |
| RAIMOV DENTAL | master brand, website and future clinic group | `site-raimovdental/`, `docs/copy/raimov/`, `docs/raimov/content/` | Stage A protected; public Stage B separately gated |
| Atabek Raimov | current clinical authority | `research/raimov-profile/`, `RAIMOV_PUBLIC_PROFILE.md` | curated facts only |
| RAIM SMILE SYSTEM | developing methodology | `docs/raimov/clinical-system/` | strategy-level in Stage A; no certification claim |
| Raimov Academy | future education line | `docs/raimov/academy/` | direction in Stage A; public programme later |
| Own RAIMOV DENTAL clinics | future Bishkek/Kyrgyzstan/Central Asia line | `clinic-growth/`, `corporate/`, `operations/` | perspective only until real projects exist |
| International expert practice | future expensive-jurisdiction track | `clinic-growth/`, `docs/research/raimov/international/` | later separate phase; Dubai conditional |
| ELITE DENTAL | future separate partner/franchise model | `docs/raimov/elite-dental/` | private; not a Stage A or Stage B offer |

## Source-of-truth matrix

| Subject | Authority | Derived output |
|---|---|---|
| Master routing and layer model | `docs/ssot/RAIMOV.md` | agent routing and project indexes |
| Clinic growth and commercial decisions | `docs/ssot/EXPERT_DENTAL_RAIMOV_ELITE_STRATEGY.md` | operating plans and dashboards |
| Website phases, depth, audience and release | `docs/ssot/RAIMOV_DENTAL_WEBSITE_STRATEGY.md` | Site Map, DESIGN brief, copy and replacement |
| Stage A clarification | `DEC-743_raimovdental-stage-a-strategic-presentation.md` | Gate 0A and content-depth rule |
| Public facts about Atabek | `RAIMOV_PUBLIC_PROFILE.md` + evidence pack | biography and factual profile copy |
| Legal gates | `RAIMOV_LEGAL_GATES.md` | public release blockers |
| Project topology | this file | namespaces, ownership and routing |
| Pricing | `site-raimovdental/src/config/pricing.ts` | authorised patient pricing only |
| Public route copy | approved strategy + curated facts + `docs/copy/raimov/` | website pages and metadata |
| Clinical cases | evidence and clearance registers | future Stage C case pages |
| Investor financial material | private baseline/economics + legal gate | closed discussions only |
| Release state | `docs/raimov/PROJECT_STATUS.md` + release evidence | preview/public cutover decision |

## Protected production and evidence zones

Do not move, rewrite or publish from these zones without a separate approved task:

- `research/raimov-profile/evidence/**` and rights/clearance records;
- `site-raimovdental/src/config/pricing.ts`;
- current routes, robots/noindex, forms, analytics and deploy workflow;
- legacy RU/EN route removal or redirects before migration mapping;
- patient forms, consent and CRM-connected endpoints;
- legal identity, licences, credentials and medical claims;
- public transition from Expert Dental Studio to RAIMOV DENTAL;
- investor terms, projections, P&L, cap table, KYC and private documents;
- public ELITE DENTAL claims.

## Mandatory gates by phase

### Stage A — protected strategic presentation

1. **Truth gate:** current facts have source/status; future directions are labelled.
2. **Website Studio Gate 0A:** closed by DEC-743.
3. **IA gate:** compact Site Map; no unnecessary case/service families.
4. **Visual gate:** design thesis, anti-attributes and visual signature.
5. **System gate:** `DESIGN.md`, tokens, shell, states and QA Manifest.
6. **Representative Gate 4A:** one protected/noindex strategic page passes responsive, accessibility, performance, anti-slop and truth review.
7. **Preview gate:** access control, noindex and no production cutover.

Atabek approval and case-level proof are not Stage A input gates.

### Stage B — public investor/doctor platform

1. **Atabek decision gate:** direction and public brand relationship are decided after Stage A.
2. **Investor-communications legal gate:** CTA and wording are counsel-approved.
3. **Public evidence gate:** every concrete public claim has sufficient proof.
4. **Form/privacy gate:** minimal data, consent, retention and delivery monitoring.
5. **Public release Gate 6:** migration, SEO, accessibility, performance, security, smoke and rollback.

### Stage C — patient/clinical contour

1. **Medical gate:** claims and service copy approved.
2. **Case gate:** consent, reviewer, source and rights recorded.
3. **Funnel/capacity gate:** CRM, SLA, diagnostic product and capacity ready.
4. **Reputation gate:** real reviews only.

## Delivery phases

1. **Strategy rebase:** investor-first direction and ecosystem trajectory captured.
2. **Stage A Website Studio:** compact IA, design thesis, DESIGN system and representative strategic page.
3. **Protected presentation:** Dmitry presents Stage A to Atabek.
4. **Decision capture:** Atabek's response becomes input to the next version.
5. **Stage B foundation:** public proof, brand relationship, investor legal and form decisions.
6. **Investor/doctor public release:** RU-only brand platform after Gate 6.
7. **Patient contour:** diagnostic product and clinical proof enable patient pages.
8. **Clinic replication:** own RAIMOV DENTAL clinics after real unit economics and management system.
9. **System and Academy:** documented methodology and approved education products.
10. **International / ELITE readiness:** only after jurisdiction, quality, legal and economic gates.

## Ownership rule

Each physical file has one primary writer. Strategy decisions remain in strategy SSOT/DEC; evidence status remains in the evidence/profile layer; public copy never becomes a fact source; private investor information never becomes public by default.

## Architecture completion rule

Architecture is complete when namespaces, authority, phases and routing are clear. It does not mean public proof, legal review, Academy, new clinics, international practice or ELITE DENTAL are ready.

---

*RAIMOV_ECOSYSTEM_PROJECT_ARCHITECTURE v1.2 · 2026-07-24 · Stage A separated from public proof gates; no runtime change authorised.*

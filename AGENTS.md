# AGENTS.md — raimovdental Cursor Agents satellite

This repository is the **Cursor Agents** surface for Expert Dental / RAIMOV DENTAL.

| | |
|--|--|
| Knowledge domain | `healthcare-ecosystem` |
| Agents project | `zaomir/raimovdental` (this repo) |
| Production SSOT + deploy | `zaomir/grainee-v2` → `site-raimovdental/` → https://raimovdental.com |
| Sync | Bidirectional DEC-784 — see `docs/raimov/AGENTS_SATELLITE.md` |

## Read first

1. `START.md`
2. `docs/expert-clinic-reference.md`
3. `docs/projects/raimovdental/AGENTS.md`
4. `agents/manifests/raimovdental.yaml`

## Do

- Edit clinic site, research, ops docs, copy, legal templates under mirrored trees (`SYNC_MANIFEST.yml`)
- After every completed task: commit + push here → sync Agents↔grainee → deploy from grainee if runtime — **no asks/reminders**
- Keep evidence, medical, legal and media-rights gates

## Do not

- Deploy from this repo
- Invent clinic facts not in `research/raimov-profile/FACT_REGISTER.csv`
- Edit protected evidence/pricing without gates
- Commit secrets or patient-identifiable data
- Open `grainee-v2` for clinic-only chats (use **this** project in Cursor Agents picker)

## Desktop IDE

Open multi-root workspace from grainee: `raimovdental.code-workspace`  
Or open this repo folder alone in Cursor Desktop.

## Cloud / Mobile Agents

1. Cursor → Cloud Agents → Environment for **`zaomir/raimovdental`**
2. Start agent chats on project **raimovdental** (not grainee-v2)
3. Setup guide: `docs/raimov/CURSOR_AGENTS_SETUP.md`

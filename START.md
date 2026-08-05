# START — raimovdental (Cursor Agents)

Это satellite-репозиторий для **Cursor Agents** (Mobile / Cloud / Desktop) по клинике Expert Dental / RAIMOV.

## Cold start (≤3 шага)

1. Прочитай `AGENTS.md` (этот репо).
2. Прочитай `docs/expert-clinic-reference.md`.
3. Прочитай `docs/projects/raimovdental/AGENTS.md` + `agents/manifests/raimovdental.yaml`.

## Где правда

| Роль | Репо |
|------|------|
| Cursor Agents (этот проект) | `zaomir/raimovdental` |
| Production SSOT + deploy | `zaomir/grainee-v2` |

Деплой **только** из grainee-v2. Синк двусторонний (DEC-784).

## Запреты

- Не деплоить из этого репо
- Не выдумывать факты клиники вне `research/raimov-profile/FACT_REGISTER.csv`
- Не трогать `research/raimov-profile/evidence/**` и `site-raimovdental/src/config/pricing.ts` без гейтов
- Не коммитить секреты / PII пациентов

## После правок

Коммит в этом репо → cron (10 мин) или ручной sync на VDS зеркалит в grainee → deploy только из grainee.

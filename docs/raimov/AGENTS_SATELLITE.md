# Raimovdental Agents satellite

**DEC-783 / TASK-777**

| Role | Repo | Path |
|------|------|------|
| Cursor Agents (Mobile/Cloud) | `zaomir/raimovdental` | `/var/www/raimovdental` |
| Production SSOT + deploy | `zaomir/grainee-v2` | `/var/www/grainee-v2` |

## Daily use

1. In Cursor Agents / Mobile: open project **raimovdental**.
2. Work and commit there.
3. On VDS: `cd /var/www/grainee-v2 && bash scripts/raimov/sync-from-agents-repo.sh --apply --commit --push`
4. Deploy from grainee as usual (`pnpm check:project raimovdental` / project deploy).

## Re-seed Agents from monorepo

When grainee is ahead:

```bash
bash scripts/raimov/seed-agents-repo.sh --apply --push
```

## Desktop IDE only

`raimovdental.code-workspace` — multi-root without Cloud Agents split.

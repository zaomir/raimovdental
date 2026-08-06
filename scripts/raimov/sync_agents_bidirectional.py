#!/usr/bin/env python3
"""Bidirectional sync: zaomir/raimovdental ↔ grainee-v2 mapped trees (DEC-784).

Per-file rules (after pull both remotes):
  - identical content → skip
  - only on one side → copy to the other
  - both differ from last sync state → conflict:
      * protected paths → grainee wins
      * else newer mtime wins (ties → grainee)
  - only one side changed since last sync → that side wins

State: docs/raimov/.agents-sync-state.json (mirrored into both trees).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple

GRAINEE_DEFAULT = Path("/var/www/grainee-v2")
CLINIC_DEFAULT = Path("/var/www/raimovdental")
CLINIC_URL = os.environ.get(
    "RAIMOV_AGENTS_REPO_URL", "https://github.com/zaomir/raimovdental.git"
)

TREES = [
    "site-raimovdental",
    "research/raimov-profile",
    "docs/projects/raimovdental",
    "docs/projects/healthcare-ecosystem",
    "docs/raimov",
    "docs/copy/raimov",
    "docs/legal/raimov",
    "docs/legal-templates/raimov",
    "docs/audits/raimov",
    "docs/research/raimov",
    "scripts/raimov",
    "tests/raimov",
    "tests/raimovdental",
    "site-caesthetic/private/bonita",
]

SSOT_GLOBS = [
    "docs/ssot/RAIMOV*.md",
    "docs/ssot/EXPERT_DENTAL*.md",
    "docs/ssot/ELITE_DENTAL*.md",
    "docs/ssot/BONITA*.md",
]

EXTRA_FILES = [
    "docs/expert-clinic-reference.md",
    "agents/manifests/raimovdental.yaml",
]

EXCLUDE_DIR_NAMES = {
    "node_modules",
    "dist",
    ".baseline",
    ".git",
    ".DS_Store",
}
EXCLUDE_FILE_PREFIXES = (".env",)
EXCLUDE_REL_EXACT = {
    # clinic-only root control files are outside TREES; keep state syncable
}

PROTECTED_PREFIXES = (
    "research/raimov-profile/evidence/",
    "site-raimovdental/src/config/pricing.ts",
)

STATE_REL = "docs/raimov/.agents-sync-state.json"
MARKER_REL = "docs/raimov/AGENTS_REPO_SYNC.md"
CONFLICTS_REL = "docs/raimov/AGENTS_SYNC_CONFLICTS.md"


def run(cmd: List[str], cwd: Optional[Path] = None) -> None:
    subprocess.run(cmd, cwd=str(cwd) if cwd else None, check=True)


def run_out(cmd: List[str], cwd: Optional[Path] = None) -> str:
    return subprocess.check_output(cmd, cwd=str(cwd) if cwd else None, text=True).strip()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def should_skip(rel: str, name: str, is_dir: bool) -> bool:
    if name in EXCLUDE_DIR_NAMES:
        return True
    if any(name.startswith(p) for p in EXCLUDE_FILE_PREFIXES):
        return True
    if rel in EXCLUDE_REL_EXACT:
        return True
    return False


def iter_files(root: Path, rel_root: str) -> Iterable[str]:
    base = root / rel_root
    if not base.exists():
        return
    if base.is_file():
        yield rel_root
        return
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [
            d
            for d in dirnames
            if not should_skip(
                str(Path(dirpath, d).relative_to(root)), d, True
            )
        ]
        for fn in filenames:
            full = Path(dirpath) / fn
            rel = str(full.relative_to(root))
            if should_skip(rel, fn, False):
                continue
            yield rel


def expand_ssot(root: Path) -> List[str]:
    out: List[str] = []
    ssot = root / "docs" / "ssot"
    if not ssot.is_dir():
        return out
    for pattern in ("RAIMOV*.md", "EXPERT_DENTAL*.md", "ELITE_DENTAL*.md", "BONITA*.md"):
        for p in sorted(ssot.glob(pattern)):
            out.append(str(p.relative_to(root)))
    return out


def collect_rels(root: Path) -> Set[str]:
    rels: Set[str] = set()
    for tree in TREES:
        for rel in iter_files(root, tree):
            rels.add(rel)
    for rel in expand_ssot(root):
        rels.add(rel)
    for rel in EXTRA_FILES:
        if (root / rel).is_file():
            rels.add(rel)
    # never sync conflict dump as a source of truth loop noise is ok but include it
    return rels


def is_protected(rel: str) -> bool:
    for p in PROTECTED_PREFIXES:
        if p.endswith("/") and rel.startswith(p):
            return True
        if rel == p:
            return True
    return False


def load_state(path: Path) -> Dict[str, str]:
    if not path.is_file():
        return {}
    try:
        data = json.loads(path.read_text())
        files = data.get("files") or {}
        return {str(k): str(v) for k, v in files.items()}
    except Exception:
        return {}


@dataclass
class Action:
    rel: str
    direction: str  # g2c | c2g
    reason: str


def decide(
    rel: str,
    g_path: Path,
    c_path: Path,
    last: Dict[str, str],
) -> Optional[Action]:
    g_exists = g_path.is_file()
    c_exists = c_path.is_file()

    if not g_exists and not c_exists:
        return None
    if g_exists and not c_exists:
        return Action(rel, "g2c", "only_in_grainee")
    if c_exists and not g_exists:
        return Action(rel, "c2g", "only_in_clinic")

    g_hash = sha256_file(g_path)
    c_hash = sha256_file(c_path)
    if g_hash == c_hash:
        return None

    prev = last.get(rel)
    g_changed = prev is None or g_hash != prev
    c_changed = prev is None or c_hash != prev

    # First sync / no state: prefer newer mtime; protected → grainee
    if prev is None:
        if is_protected(rel):
            return Action(rel, "g2c", "bootstrap_protected_grainee")
        g_m = g_path.stat().st_mtime
        c_m = c_path.stat().st_mtime
        if c_m > g_m:
            return Action(rel, "c2g", "bootstrap_newer_clinic")
        return Action(rel, "g2c", "bootstrap_newer_grainee")

    if g_changed and not c_changed:
        return Action(rel, "g2c", "grainee_changed")
    if c_changed and not g_changed:
        return Action(rel, "c2g", "clinic_changed")

    # both changed (or prev mismatched both) → conflict
    if is_protected(rel):
        return Action(rel, "g2c", "conflict_protected_grainee")
    g_m = g_path.stat().st_mtime
    c_m = c_path.stat().st_mtime
    if c_m > g_m:
        return Action(rel, "c2g", "conflict_newer_clinic")
    return Action(rel, "g2c", "conflict_newer_grainee")


def copy_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def ensure_clinic(clinic: Path) -> None:
    if not (clinic / ".git").is_dir():
        run(["git", "clone", CLINIC_URL, str(clinic)])
    else:
        run(["git", "fetch", "origin", "-q"], cwd=clinic)
        run(["git", "checkout", "main"], cwd=clinic)
        run(["git", "pull", "--ff-only", "origin", "main"], cwd=clinic)


def git_commit_push(repo: Path, message: str, paths: List[str], do_commit: bool, do_push: bool) -> None:
    if not do_commit:
        return
    existing = [p for p in paths if (repo / p).exists()]
    for extra in (STATE_REL, MARKER_REL, CONFLICTS_REL):
        if (repo / extra).exists() and extra not in existing:
            existing.append(extra)
    if not existing:
        print(f"[{repo.name}] nothing to add")
        return
    run(["git", "add", "-A", "--"] + existing, cwd=repo)
    diff = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=str(repo))
    if diff.returncode == 0:
        print(f"[{repo.name}] nothing staged")
        return
    name = run_out(["git", "log", "-1", "--format=%an"], cwd=repo) or "grainee-bot"
    email = run_out(["git", "log", "-1", "--format=%ae"], cwd=repo) or "bot@local"
    run(
        ["git", "-c", f"user.name={name}", "-c", f"user.email={email}", "commit", "-m", message],
        cwd=repo,
    )
    if do_push:
        run(["git", "push", "origin", "main"], cwd=repo)


def write_marker(grainee: Path, clinic: Path, summary: str) -> None:
    g_sha = run_out(["git", "rev-parse", "HEAD"], cwd=grainee)
    c_sha = run_out(["git", "rev-parse", "HEAD"], cwd=clinic)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    body = f"""# Agents repo sync marker

- **Mode:** bidirectional (DEC-784)
- **Grainee SHA (pre-commit):** `{g_sha}`
- **Clinic SHA (pre-commit):** `{c_sha}`
- **Synced at (UTC):** {now}
- **Script:** `scripts/raimov/sync-agents-bidirectional.sh`
- **Summary:** {summary}

Production deploy still ships only from grainee-v2.
"""
    path = grainee / MARKER_REL
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(body)
    copy_file(path, clinic / MARKER_REL)


def main() -> int:
    ap = argparse.ArgumentParser(description="Bidirectional Raimov Agents ↔ grainee sync")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--commit", action="store_true")
    ap.add_argument("--push", action="store_true")
    ap.add_argument("--grainee", type=Path, default=Path(os.environ.get("GRAINEE_ROOT", GRAINEE_DEFAULT)))
    ap.add_argument("--clinic", type=Path, default=Path(os.environ.get("RAIMOV_AGENTS_DIR", CLINIC_DEFAULT)))
    args = ap.parse_args()
    if args.push:
        args.commit = True

    grainee: Path = args.grainee.resolve()
    clinic: Path = args.clinic.resolve()

    print("== Bidirectional Agents ↔ grainee sync ==")
    print(f"grainee: {grainee}")
    print(f"clinic:  {clinic}")
    print(f"mode:    {'APPLY' if args.apply else 'DRY-RUN'}")

    run(["git", "fetch", "origin", "main", "-q"], cwd=grainee)
    run(["git", "pull", "--ff-only", "origin", "main"], cwd=grainee)
    ensure_clinic(clinic)

    last = load_state(grainee / STATE_REL)
    if not last and (clinic / STATE_REL).is_file():
        last = load_state(clinic / STATE_REL)

    rels = collect_rels(grainee) | collect_rels(clinic)
    # exclude state file from decide loop content comparison driving itself oddly —
    # we rewrite state at end; skip copying decisions for STATE_REL during decide
    rels.discard(STATE_REL)
    rels.discard(MARKER_REL)

    actions: List[Action] = []
    conflicts: List[Action] = []
    for rel in sorted(rels):
        act = decide(rel, grainee / rel, clinic / rel, last)
        if not act:
            continue
        actions.append(act)
        if act.reason.startswith("conflict_"):
            conflicts.append(act)

    g2c = [a for a in actions if a.direction == "g2c"]
    c2g = [a for a in actions if a.direction == "c2g"]
    print(f"planned: grainee→clinic={len(g2c)} clinic→grainee={len(c2g)} conflicts={len(conflicts)}")
    for a in actions[:50]:
        print(f"  {a.direction}\t{a.reason}\t{a.rel}")
    if len(actions) > 50:
        print(f"  ... +{len(actions) - 50} more")

    if not args.apply:
        print("DRY-RUN complete (no writes)")
        return 0

    if not actions:
        print("Nothing to sync; skipping writes/commits")
        return 0

    for a in actions:
        if a.direction == "g2c":
            copy_file(grainee / a.rel, clinic / a.rel)
        else:
            copy_file(clinic / a.rel, grainee / a.rel)

    # rebuild state from grainee after copies (canonical hashes)
    new_state_files: Dict[str, str] = {}
    for rel in sorted(collect_rels(grainee) | collect_rels(clinic)):
        if rel in (STATE_REL, MARKER_REL):
            continue
        g_p = grainee / rel
        c_p = clinic / rel
        # after apply they should match when both exist
        if g_p.is_file():
            new_state_files[rel] = sha256_file(g_p)
        elif c_p.is_file():
            new_state_files[rel] = sha256_file(c_p)

    state_obj = {
        "version": 1,
        "updated_at_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "policy": "bidirectional_hash_lww_protected_grainee",
        "files": new_state_files,
    }
    state_path = grainee / STATE_REL
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(state_obj, indent=2, sort_keys=True) + "\n")
    copy_file(state_path, clinic / STATE_REL)

    if conflicts:
        lines = [
            "# Agents sync conflicts (auto-resolved)",
            "",
            f"UTC: {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}",
            "",
            "| Rel | Winner | Reason |",
            "|-----|--------|--------|",
        ]
        for a in conflicts:
            winner = "grainee→clinic" if a.direction == "g2c" else "clinic→grainee"
            lines.append(f"| `{a.rel}` | {winner} | `{a.reason}` |")
        lines.append("")
        conf_path = grainee / CONFLICTS_REL
        conf_path.write_text("\n".join(lines) + "\n")
        copy_file(conf_path, clinic / CONFLICTS_REL)

    summary = f"g2c={len(g2c)} c2g={len(c2g)} conflicts={len(conflicts)}"
    write_marker(grainee, clinic, summary)

    mapped_paths = TREES + [
        "docs/ssot",
        "docs/expert-clinic-reference.md",
        "agents/manifests/raimovdental.yaml",
        STATE_REL,
        MARKER_REL,
        CONFLICTS_REL,
    ]

    if args.commit:
        git_commit_push(
            grainee,
            f"sync(raimov): bidirectional Agents↔grainee ({summary})",
            mapped_paths,
            True,
            args.push,
        )
        git_commit_push(
            clinic,
            f"sync(raimov): bidirectional Agents↔grainee ({summary})",
            mapped_paths,
            True,
            args.push,
        )

    print(f"DONE {summary}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

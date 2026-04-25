# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for this project.

ADRs document significant technical and architectural decisions made during the project. They provide context for future maintainers (human and AI) about why the system works the way it does.

## What belongs here

Document a decision if it:

- Affects the overall architecture or structure
- Involves a significant technology choice
- Deviates from lab standards (must cite the standard)
- Would be hard to reverse later
- Would confuse a new team member without explanation

## Current ADRs

| ADR | Title       | Status |
| --- | ----------- | ------ |
| —   | No ADRs yet | —      |

<!-- Update this table as ADRs are added -->

## Creating a new ADR

Use the helper script:

```bash
npm run adr:new my-decision-title
```

Or run directly:

```bash
./scripts/new-adr.sh my-decision-title
```

Or copy the template manually:

```bash
cp _template.md 0001-my-decision-title.md
```

## ADR lifecycle

1. **Proposed** — Under discussion
2. **Accepted** — Decision made, implementation underway or complete
3. **Superseded** — Replaced by a newer ADR (link to replacement)
4. **Deprecated** — No longer relevant but kept for history

## Lab standards reference

Project-level ADRs should align with lab standards. When a decision deviates from a standard, cite the specific standard and explain the rationale.

- [ARCHITECTURE-DECISIONS.md](https://github.com/friends-innovation-lab/lab-standards/blob/main/ARCHITECTURE-DECISIONS.md) — the ADR practice itself
- [STANDARDS-INDEX.md](https://github.com/friends-innovation-lab/lab-standards/blob/main/STANDARDS-INDEX.md) — all lab standards

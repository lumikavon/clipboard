# Clipboard (剪切板)

## What This Is

A fast, keyboard-driven clipboard history manager for Windows built with Tauri 2 (Rust) + React 19.
It captures text, rich text, images and files from the system clipboard, keeps an encrypted searchable
history, and pastes items back anywhere with global hotkeys. This is the rebranded successor of TieZ.

## Core Value

Reliably capture and instantly find/paste any clipboard item without ever leaving the keyboard.

## Requirements

### Validated

- ✓ Global-hotkey clipboard history popup — existing app
- ✓ Captures text / rich text / images / files with search and pin — existing app
- ✓ Hotkey-driven paste, sequential paste, paste queue — existing app
- ✓ Emoji panel, theme system, auto-update — existing app

### Active

- [ ] Clean identity: app renamed to "Clipboard" (zh: 剪切板) everywhere it is user-visible
- [ ] Lean feature set: LAN file transfer, AI assistant, cloud sync, verification-code sync, Tags removed
- [ ] Settings opened in its own independent window instead of the main popup
- [ ] Build + run verified on Windows

### Out of Scope

- Cloud / network syncing of any kind — removed by explicit user request (2026-09-11)
- AI integration — removed by explicit user request (2026-09-11)
- LAN file transfer between devices — removed by explicit user request (2026-09-11)
- Tag-based organization UI — removed by explicit user request; internal sensitive-content encryption retained

## Context

- Repo was previously branded TieZ (repo `jimuzhe/tiez-clipboard`), version 0.3.4.
- Feature deletion targets are entangled with core clipboard code; internal "sensitive" tag logic
  (`pipeline.rs` auto-tag, `has_sensitive_tag()` encryption trigger) deliberately stays for privacy encryption.
- DB schema migrations are append-only; obsolete tables/columns may remain but are unused after cleanup.

## Constraints

- **Tech stack**: Tauri 2 + React 19 + TypeScript + Rust; SQLite storage — no framework changes.
- **Compatibility**: Windows desktop is the primary target; macOS workflows exist in CI.
- **Packaging**: `npm run tauri:build` must keep working after the rebrand (identifier/name changes included).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep internal sensitive-tag encryption while removing Tags UI | Privacy encryption is driven by tags; full removal is high-risk | — Pending |
| Settings opens as a separate Tauri WebviewWindow | User request; route scaffolding (`?window=`) already exists | — Pending |
| Verify build only; upgrade deps only if broken | User chose lowest-risk option | — Pending |

---
*Last updated: 2026-09-11 after GSD bootstrap for quick task 260911-h1t*

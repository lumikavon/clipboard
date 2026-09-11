---
status: complete
quick_id: 260911-h1t
date: 2026-09-11
description: init git repo & commit; rename app to Clipboard (剪切板); verify build/run; settings in separate window; remove LAN file transfer, AI, cloud sync, verification-code sync, Tags
commits:
  - 6895569 (baseline commit)
  - f59ecea (rebrand)
  - 1dcae4e (feature removal + settings window)
---

# Quick Task 260911-h1t — Summary

## Result

All requested work completed and verified:

1. **Git init + full baseline commit** — repo already had an empty git init; committed all 293 pre-existing files as `6895569`.
2. **Rebrand to Clipboard (剪切板)** — productName/window title/tray/settings footer/locales, npm+cargo package names
   (`clipboard-app`), installer/uninstaller process & registry cleanup, autostart value with legacy migration.
   Kept `com.tiez` identifier, data dirs, updater endpoints and localStorage keys for user-data compatibility.
3. **Feature removal (5 features)** — LAN file transfer, AI assistant+, cloud sync, MQTT verification-code sync
   (+ sensitive_align), and the Tags UI were deleted across Rust backend, frontend, settings groups, hooks,
   styles, capabilities and dependencies. Internal sensitive-tag encryption and privacy masking were deliberately
   retained (privacy encryption is driven by the internal "sensitive" tag).
4. **Settings in an independent window** — settings now opens in its own decorated Tauri window
   (`index.html?window=settings` → `SettingsWindow`), with singleton reuse, both capability files updated,
   and cross-window sync via a new `settings-changed` event emitted on `save_setting` / `set_theme`.
5. **Build + run verification** — `tsc`, `vite build`, `cargo check`, `cargo build`, `tauri build --debug --no-bundle`,
   vitest (18/18) all pass. Runtime verified via WebView2 CDP:
   - app boots with title "Clipboard" (41.6 MB working set, no crash)
   - clicking the gear opened a separate `?window=settings` target
   - saving a setting in the settings window propagated to the main window (`--surface-opacity-scale` → 0.8)
   - test-modified setting restored afterwards

## Dependency policy outcome

No dependency upgrades were required. The only dependency change was **adding the missing `vitest` devDependency**,
which was necessary because `src/shared/lib/utils.test.ts` imports vitest and its absence broke `npm run build`
(tsc) on a fresh checkout. Removed now-unused Cargo deps: `axum`, `axum-extra`, `local-ip-address`, `tokio-util`,
`futures`, `mime_guess`, `rumqttc`, `rustls`, `webpki-roots`.

## Files of note

- `src/features/settings/components/SettingsWindow.tsx` (new settings-window root)
- `src/features/settings/lib/settingsWindow.ts` (opener helper)
- `src-tauri/src/app/commands/settings_cmd.rs` (emits `settings-changed`)
- `src-tauri/src/app/commands/ui_cmd.rs` (theme propagation to main window)
- Deleted Rust: `services/file_transfer/**`, `services/cloud_sync.rs`, `services/mqtt_sub.rs`,
  `services/sensitive_align.rs`, `commands/ai_cmd.rs`, `commands/tag_color_cmd.rs`,
  `repository/tag_repo.rs`
- Deleted frontend: `features/file-transfer/**`, `features/tag/**`, feature settings groups,
  `useAiActions`/`useMqttListener`/`useTagColors`/`useTagManagerRefresh`, feature CSS

## Deviations / notes

- Locale strings for removed features remain in `src/locales.ts` (dead data, no code paths reference them).
- DB schema migrations are append-only; unused tables/seed rows from removed features remain harmless.
- `.planning/` (GSD scaffolding) is committed by the orchestrator in the final docs commit, per quick workflow.

## Verification evidence

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `node_modules\.bin\tsc --noEmit` | pass |
| Frontend build | `npm run build` | pass (774 kB bundle) |
| Rust check | `cargo check` | pass |
| Rust build | `cargo build` + `tauri build --debug --no-bundle` | pass |
| Unit tests | `npx vitest run` | 18/18 pass |
| Runtime | CDP: gear click → settings window → setting sync | pass |

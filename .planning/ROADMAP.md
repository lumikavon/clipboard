# Roadmap: Clipboard (剪切板)

## Overview

Rebrand the former TieZ clipboard manager to "Clipboard (剪切板)", strip out the non-core
network/AI/sync/tag features, move settings into its own window, and keep the core clipboard
capture/paste experience fully working on Windows.

## Phases

- [ ] **Phase 1: Rebrand & Slim Down** - Rename identity to Clipboard (剪切板) and remove LAN transfer, AI, cloud sync, verification-code sync and Tags UI
- [ ] **Phase 2: Settings Window** - Open settings in an independent window and keep main window in sync
- [ ] **Phase 3: Build Verification** - Verify compile + run on Windows and fix any fallout

## Phase Details

### Phase 1: Rebrand & Slim Down
**Goal**: The app is called Clipboard (剪切板) and no longer contains the removed features.
**Depends on**: Nothing (first phase)
**Success Criteria** (what must be TRUE):
  1. App name shows "Clipboard" / "剪切板" in window title, tray, package metadata and locales
  2. No LAN file transfer / AI / cloud sync / MQTT verification-code sync / Tags code paths remain reachable
  3. Clipboard capture, search, paste and emoji features still work
**Plans**: 3 plans

Plans:
- [ ] 01-01: Baseline commit + rebrand
- [ ] 01-02: Remove obsolete features
- [ ] 01-03: Settings window + build verification

### Phase 2: Settings Window
**Goal**: Settings page pops up in its own independent OS window.
**Depends on**: Phase 1
**Success Criteria** (what must be TRUE):
  1. Clicking the gear opens a separate window containing the full settings panel
  2. Settings changed there persist and reflect in the main window
**Plans**: included in 01-03

### Phase 3: Build Verification
**Goal**: `npm run build` + `cargo check` + app launch succeed.
**Depends on**: Phase 2
**Plans**: included in 01-03

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Rebrand & Slim Down | 0/3 | Not started | - |
| 2. Settings Window | 0/1 | Not started | - |
| 3. Build Verification | 0/1 | Not started | - |

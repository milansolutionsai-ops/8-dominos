# 8 Dominos — Batch 0 Build Plan (internal)

Working plan for the Batch 0 elevation. For the full strategy and the client-facing version, this is the technical companion to the Game of Life "Build & Growth Plan". Design bar lives in `DESIGN.md`.

## Goal

Take the app that is already live and elevate it to premium (feel, motion, sound, visual craft), add "Share my week", finish loose ends, and ship. **Upgrade, never rebuild** — everything here is the client-side foundation of the future platform.

## Passes / sequence

1. **Prep** (this branch): context docs + `DESIGN.md`, install, baseline. ✅ in progress
2. **Diagnose:** `/design-pass` audit of the whole app → baseline score + gap list.
3. **Elevate:** Claude design pass (read-only) → tokens, comps, motion direction. Milan reviews and locks the palette.
4. **GATE:** Hass approves the look, sets up store accounts, commits the testimonial. No heavy build before this.
5. **Build:** implement (this repo).
6. **Ship:** EAS build + launch, then `/design-pass` again as the acceptance gate.

## Build scope (Phase 5)

- **Theme extraction:** one theme module, migrate ~200 scattered hex literals to tokens. Zero new hardcoded colours.
- **Motion:** migrate tile/score/transitions from RN `Animated` to `react-native-reanimated` v4 (+ Moti for declarative polish); domino-chain cascade; Lottie perfect-day celebration.
- **Sound:** replace/expand the sound set (currently `toggle` and `complete` share `pop.mp3`); distinct crafted sounds per event via `expo-av`.
- **Components:** rebuild `DominoTile`, `ScoreDisplay`, `MoodCheckIn` against the new design system.
- **Share my week:** render a branded summary card (`react-native-view-shot`) → native share sheet.
- **Finish:** wire morning mood (storage already supports it; UI only shows evening), tidy weekly analytics.
- **Ship:** EAS build. Launch path is Hass's call — Option A stores (Apple $99/yr + Google $25), or Option B free Android APK / web link now, stores later.

## Fence (out of scope for Batch 0)

No backend, accounts, multi-user, coach dashboard, leaderboards, points economy, or survey engine. Those are Batch 1+ and gated on client/revenue milestones.

## Forward-compat rules

Theme centralized · persistence stays behind `StorageService`/`useDominos` · `types/domino.ts` is the single data-model source · components presentational, data access in hooks/services.

## Arrangement (context)

Batch 0 done as a friend in exchange for one video testimonial. Referred clients that close are Milan's (no commission back) and fund the future platform build. Code stays Milan's; Game of Life brand is Hass's.

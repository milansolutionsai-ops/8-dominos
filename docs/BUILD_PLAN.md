# 8 Dominos — Batch 0 Build Plan (internal)

Technical companion to the Game of Life "Build & Growth Plan". Design bar lives in `DESIGN.md`.

## Goal

Elevate the live app to premium and **on-brand** (feel, motion, sound, visual craft), add "Share my week", finish loose ends, ship. **Upgrade, never rebuild** — this is the client-side foundation of the future platform.

> **Brand pivot:** 8 Dominos rebranded to **blue + navy + cream, Poppins** (live at 8dominos.com). Supersedes the white paper's dark + gold. See `DESIGN.md`.

## Sequence

1. **Prep** — context docs + `DESIGN.md`, install, baseline. ✅
2. **Diagnose** — `/design-pass` audit. ✅ scored **46/100**: strong skeleton + clean architecture, off-brand generic-AI skin, split motion stack. Top gaps: brand misalignment, no theme layer, buried home IA.
3. **Foundation (this pass, no comps needed)** — ✅/in progress:
   - `constants/theme.ts` design system (brand tokens, Poppins type scale, motion springs, elevation). ✅
   - Migrate ~200 hardcoded hex → theme tokens across all files.
   - Wire Poppins (`@expo-google-fonts/poppins`).
   - Fix baseline type errors (stale lucide imports in `DailyJournal`, implicit `any` in `(tabs)/_layout`).
   - Fix home IA (game board leads; demote journal/mood).
   - Wire morning mood (storage already supports it).
   - Libs installed: moti, lottie-react-native, react-native-view-shot.
4. **Claude design pass** — Milan runs it (read-only repo). Produces final palette/tokens (+ light-vs-dark call), screen comps, motion direction.
5. **GATE** — Hass approves the look, sets up store accounts, commits the testimonial. No heavy visual build before this.
6. **Visual build (needs comps)** — apply final tokens; redesign component structure per comps; rebuild `DominoTile` + `ScoreDisplay`; domino-chain cascade; Lottie perfect-day; upgraded sound set; "Share my week" card.
7. **Ship** — EAS build + launch (Option A stores / Option B free Android+web), then `/design-pass` again as the acceptance gate.

## Fence (out of scope for Batch 0)

No backend, accounts, multi-user, coach dashboard, leaderboards, points economy, or survey engine. Batch 1+, gated on client/revenue milestones.

## Forward-compat rules

Theme centralized in `constants/theme.ts` · persistence behind `StorageService`/`useDominos` · `types/domino.ts` single data-model source · components presentational, data access in hooks/services.

## Arrangement (context)

Batch 0 as a friend for one video testimonial. Referred clients that close are Milan's (no commission back) and fund the future platform. Code stays Milan's; brand is Hass's.

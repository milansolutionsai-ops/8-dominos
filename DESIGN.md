# 8 Dominos — Design Brief (Batch 0 Elevation)

This is the bar for the app. It is read by the `/design-pass` audit and is the context brief for the **Claude design** pass (read-only repo access). Claude design produces the visual assets (palette, tokens, screen comps, component states, motion direction). **Milan implements everything** in this Expo / React Native codebase.

> **BRAND UPDATE (supersedes the white paper's "dark + gold").** 8 Dominos rebranded. The live brand at **https://8dominos.com** is **blue + navy + cream, font Poppins**, positioned as premium accountability coaching for men (founder Hassan Hallal). All colour work aligns to this brand, NOT the old gold direction.

---

## 1. The product in one line

A minimalist, **premium, game-first** habit tracker. The user commits to 8 daily habits across 8 pillars of life (Body, Health, Happiness, Love, Work, Wealth, Spirituality, Soul) and builds a chain reaction of momentum. It must feel like a game first and a tracker second: immersive, satisfying, rewarding on every tap.

**Audience:** accountability-coaching clients (men, executive/serious tone). **Owner brand:** 8 Dominos / Game of Life (Hass). **Positioning:** premium, masculine, blue/navy.

---

## 2. Live brand reference (8dominos.com — authoritative)

- **Primary blue** `#046BD2` · **hover/darker blue** `#045CB4` · **lighter blue** `#3F73C8`
- **Deep navy** `#0D1F4F` · **slate** `#1E293B` / `#334155`
- **White** `#FFFFFF` · **light-blue tint** `#F0F5FA` · **warm cream** `#F7F3EA` · **ink** `#111111`
- **Font: Poppins** (400/500/600/700)
- Site vibe: clean, high-contrast, light-themed, premium, direct, masculine, trustworthy.

---

## 3. App state

**Second design pass (12 skills, dual-agent critique, real screenshots) scored the app 47/100** against this brief — barely above the 46 baseline below, because Batches 0–0.6 bought visual quality while accessibility, design-system adoption and the share system went untouched. The elevation pass that followed addressed all six areas; see the `milan/elevation-pass` commits for what changed and why.

Standing rules that came out of it:
- The `type` scale in `constants/theme.ts` is mandatory. It went unused for a whole batch because it lacked the sizes screens needed; those exist now. Never pair `fontWeight` with a `fonts.*` face — Poppins is static, so iOS ignores the weight and Android can fake-bold a real bold.
- Incomplete tiles are the loud ones. The board is a chain that falls, not a wall that lights up.
- Weekly scores against **elapsed days**. Never denominate on the full seven mid-week, and never count a day that has not happened as missed.
- `DateUtils.getWeekKeyForDate` buckets Sunday into the next week. It cannot be fixed in place — user data was written with it. Aggregate per date via `StatsService.summarizeWeek`.

### Original baseline (pre-Batch 0, scored 46/100)

- **Stack:** Expo SDK 54, React Native 0.81, React 19, TypeScript, Expo Router, AsyncStorage (single-user). Reanimated v4 + gesture-handler installed. Now also: Moti, Lottie, react-native-view-shot, Poppins.
- **Off-brand look today:** cream `#fffbea` + bright yellow `#fedd14` + black borders + OS system font. Matches neither the new brand nor a premium feel.
- **Colour debt (RESOLVED):** the ~200 hardcoded hex across ~18 files were fully migrated to the theme system (`constants/theme.ts`). Zero raw hex remain outside the theme; `tsc` clean. Swapping the palette now re-skins the whole app from one file.
- **Motion:** split stack (DominoTile on legacy `Animated`, ScoreDisplay on Reanimated). No domino-chain cascade.
- **Sound:** 3 assets; `toggle` and `complete` share `pop.mp3`; weak.
- **IA issue:** home buries the 8 dominoes below day-nav, score, journal, mood.

---

## 4. Target direction (the key decision for the Claude design pass)

**Aligned to the blue/navy brand, game-first.** The one open call: **light vs dark.** The brand *website* is light; the product wants a premium game feel.

**Milan's recommendation (implemented as the working default in `constants/theme.ts`): navy-dark surface + brand-blue `#046BD2` accent.** This stays on-brand, keeps the premium game feel, reads masculine, and suits a daily/evening habit app. Claude design confirms or flips to light — because everything routes through the theme, the switch is a values change in one file.

Reference feel: Apple-grade native motion (springs, interruptible, physical) + a premium, restrained brand aesthetic. Blue is the hero; everything else restrained.

---

## 5. Design goals by area

- **Daily board (home):** the game board leads (IA being fixed so tiles come first). Today's 8 tiles read as a domino chain; completing one feels physical and nudges the next. Score/streak as a HUD.
- **Domino tile:** the hero component. Distinct, satisfying complete / incomplete states, depth, blue accent on completion.
- **Score display:** daily x/8 and weekly x/56 as a premium ring HUD, brand-anchored score ramp (not traffic-light).
- **Weekly analytics + mood trend:** dark data-viz, blue highlights, legible.
- **Onboarding + quote splash:** premium first impression on brand.
- **Settings, journal, mood, day nav, tab bar:** consistent system, no orphan light screens.
- **Share cards (built):** day and week summaries exported at a fixed **1080x1920 (9:16)**, full-bleed, no inner frame. Both go through `SharePreviewSheet`, which shows the finished image before it leaves the device. That preview is the consent gate for the habit text being on the card; **do not add a share path that bypasses it.** Geometry lives in `constants/shareCard.ts` — read the header there before touching sizing, since view-shot has no `pixelRatio` and its width/height mean points on iOS but pixels on Android. Cards must stay free of `LinearGradient` so the iOS `useRenderInContext` fallback can rasterise them.
- **Share is a moment, not a feature.** The only prompts are the Perfect Day celebration and a Sunday week card, each once, each silenced permanently by one tap. No notifications.

---

## 6. Motion spec (Reanimated v4 + Moti; Lottie for celebrations)

- Tile completion: physical spring, blue fill sweep, success haptic.
- Domino chain: completing a tile visibly influences the next (cascade cue).
- Perfect day (8/8): a real Lottie celebration, better than the current confetti.
- Screen/tab transitions: smooth, native, interruptible.
- Streak / milestone beats. Respect reduced-motion. Motion tokens live in `theme.motion`.

## 7. Sound spec (expo-av; source a licensed premium set)

Distinct crafted sounds per event: complete, un-complete (different from complete), perfect-day flourish, streak/level-up, mood check-in. Replace the shared `pop.mp3`. Sounds are assets Claude design does not produce; Milan sources and wires them.

---

## 8. Brand tokens — IMPLEMENTED in `constants/theme.ts`

The theme system is built and is the single source of truth (semantic tokens: `bg`, `surface`, `border`, `textPrimary/Secondary/Muted`, `accent`, `onAccent`, score ramp, per-pillar tints, type scale on Poppins, spacing, radius, motion springs, elevation). Working default = navy-dark + blue.

**What Claude design finalizes:** the exact palette values (and the light-vs-dark call), the type scale refinements, and the per-screen visual language. Delivering new values = editing `palette`/`colors` in one file; the whole app re-skins.

---

## 9. What we want Claude design to deliver

1. Final **design tokens** (colour incl. light-vs-dark decision, type scale, spacing, radius, elevation) mapped to the semantic names in `constants/theme.ts`.
2. **Screen comps** for: daily board, domino tile (both states), score HUD, weekly analytics, onboarding/splash, and the "Share my week" card.
3. **Component states** (default / pressed / complete / disabled) for the tile, buttons, inputs.
4. **Motion direction** notes per interaction.
Deliver as assets/specs. This is React Native (StyleSheet), so express tokens/layout in framework-neutral terms, mapped to the token names above.

---

## 10. Forward-compatibility rules (non-negotiable — this becomes the platform foundation)

- All colour/type/spacing lives in **`constants/theme.ts`**. Zero hardcoded hex in components.
- Persistence stays behind `StorageService` + the `useDominos` hook so the storage layer can later be swapped for a backend without touching UI.
- `types/domino.ts` stays the single source of truth for the data model.
- Components presentational; data access in hooks/services.

---

## 11. Out of scope for Batch 0 (the fence)

No backend, accounts, multi-user, coach dashboard, leaderboards, points economy, or survey auto-assign engine. Batch 0 is: premium brand-aligned redesign + motion + sound + component craft + "Share my week" + finish morning mood + ship.

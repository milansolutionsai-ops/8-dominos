# 8 Dominos — Design Brief (Batch 0 Elevation)

This is the bar for the app. It is read by the `/design-pass` audit and is the context brief for the **Claude design** pass (read-only repo access). Claude design produces the visual assets (palette, tokens, screen comps, component states, motion direction). **Milan implements everything** in this Expo / React Native codebase.

---

## 1. The product in one line

A minimalist, **premium, game-first** habit tracker. The user commits to 8 daily habits across 8 pillars of life (Body, Health, Happiness, Love, Work, Wealth, Spirituality, Soul) and builds a chain reaction of momentum. It must feel like a game first and a tracker second: immersive, satisfying, rewarding on every tap.

**Audience:** self-development / coaching clients. **Owner brand:** Game of Life (Hass). **Positioning:** premium, dark, gold-accented.

---

## 2. Current state (honest baseline)

- **Stack:** Expo SDK 54, React Native 0.81, React 19, TypeScript, Expo Router (file-based), AsyncStorage (single-user, on-device). `react-native-reanimated` v4 and `gesture-handler` are installed but barely used. `expo-haptics`, `expo-av`, `expo-notifications` wired.
- **Screens:** Daily board (`app/(tabs)/index.tsx`), Weekly analytics (`weekly.tsx`), Settings (`settings.tsx`), plus Onboarding, Domino setup form, Quote splash, Journal, Mood check-in, Mood trend chart, Score display, Confetti, Custom tab bar.
- **Look today:** light "notebook / sticky-note" aesthetic. Cream background `#fffbea`, bright yellow `#fedd14`, muted yellow tiles `#f5d80a`, black `#000000` borders and text. This is the **opposite** of the target premium dark + gold direction.
- **Colour debt:** ~200 hardcoded hex literals scattered across files, including many default Tailwind greys (`#6b7280`, `#9ca3af`, `#e5e7eb`, `#f3f4f6`…). No central theme. This is both the biggest "generic AI-generated" tell and the biggest elevation opportunity. Note: onboarding already dips into near-black `#030001`, so a dark direction is not a stretch.
- **Motion today:** basic RN `Animated` API (a small scale/spring on tile completion). No shared design language, no domino-chain motion, no screen transitions.
- **Sound today:** 3 real assets in `assets/sounds/` (`pop.mp3`, `8_dominos_completed.wav`, `morning_check-in.mp3`). Only 4 events mapped, and `toggle` + `complete` share the same `pop.mp3`. Milan's note: the sounds are weak. This is a marquee upgrade area.

---

## 3. Target direction

**Dark, premium, gold-accented, game-like.** Think a high-end game HUD, not a productivity app. Deep near-black surfaces, real depth and materials, one confident gold as the hero accent, restrained everywhere else. The 8 pillars should feel like a chain of dominoes with real physicality: momentum, cascade, weight.

Reference feel: Apple-grade native motion (springs, interruptible, physical) + a luxury game aesthetic (gold, dark, tasteful glow, premium type).

---

## 4. Design goals by area

- **Daily board (home):** the game board. Today's 8 tiles read as a domino chain. Completing one should feel physical and consequential, ideally visibly nudging the next. Score/streak prominent as a HUD.
- **Domino tile:** the hero component. Distinct, satisfying complete / incomplete states. Depth, not flat. The single most-touched surface, so it earns the most polish.
- **Score display:** daily x/8 and weekly x/56 as a premium progress HUD (rings/bars), not plain numbers.
- **Weekly analytics + mood trend:** dark data-viz, gold highlights, legible. Replace the default-grey chart look.
- **Onboarding + quote splash:** premium first impression, set the tone in the first 3 seconds.
- **Settings, journal, mood check-in, day navigator, tab bar:** consistent with the system, no orphan light screens.
- **NEW — "Share my week":** a one-tap action that renders a branded dark + gold summary card (week score, streak, best domino, mood trend) and opens the native share sheet. Doubles as marketing (every share is top-of-funnel). Needs a designed card layout.

---

## 5. Motion spec (implementation target: Reanimated v4 + Moti; Lottie for celebrations)

- Tile completion: physical spring, subtle scale + gold fill sweep, success haptic.
- Domino chain: completing a tile visibly influences the next (cascade / topple cue).
- Perfect day (8/8): a real celebration moment (Lottie), better than the current confetti.
- Screen/tab transitions: smooth, native-feeling, interruptible.
- Level / streak milestones: a rewarding beat.
- Respect reduced-motion.

## 6. Sound spec (implementation: expo-av; source a licensed premium UI set)

Distinct, crafted, quiet-premium sounds per event: tile complete, tile un-complete (different from complete), perfect-day flourish, streak/level-up, mood check-in. Replace the current shared `pop.mp3`. Sounds are assets Claude design does not produce; Milan sources and wires them.

---

## 7. Brand tokens (PLACEHOLDER — Claude design finalizes)

Starting direction only. Claude design delivers the real palette + scale.

```
--bg            #0b0b0d   (deep near-black)
--surface       #151519
--surface-2     #1c1c22
--line          #2b2b33
--gold          #d4af37   (hero accent)
--gold-soft     #e7cd84
--text          #ece9e2
--text-muted    #9b9aa3
--success        (define)
--danger         (define)
```
Per-pillar accents (optional): each of the 8 dominoes may get a subtle signature tint, but gold stays the system hero.

---

## 8. What we want Claude design to deliver

1. Final **design tokens** (colour, type scale, spacing, radius, elevation) as a clean spec.
2. **Screen comps** for: daily board, domino tile (both states), score HUD, weekly analytics, onboarding/splash, and the "Share my week" card.
3. **Component states** (default / pressed / complete / disabled) for the tile, buttons, inputs.
4. **Motion direction** notes per interaction (what moves, how, timing feel).
Deliver as assets/specs. Do not assume web/CSS; this is React Native (StyleSheet), so express tokens and layout in framework-neutral terms.

---

## 9. Forward-compatibility rules (non-negotiable — this becomes the platform foundation)

Batch 0 is single-user, but it must be built so Batch 1 (backend + multi-user + coach dashboard) is an upgrade, never a rewrite:

- All colour/type/spacing lives in **one theme module**. Zero new hardcoded hex.
- Keep persistence behind `StorageService` + the `useDominos` hook so the storage layer can later be swapped for a backend without touching UI.
- Keep `types/domino.ts` the single source of truth for the data model.
- Components stay presentational; data access stays in hooks/services.

---

## 10. Out of scope for Batch 0 (the fence)

No backend, no accounts, no multi-user, no coach dashboard, no leaderboards, no points economy, no survey auto-assign engine. Those are later batches. Batch 0 is: premium redesign + motion + sound + component craft + "Share my week" + finish morning mood + ship.

# 8 DOMINOS APP - OPTIMIZED BOLT.NEW PROMPTS

## 🎯 TOKEN-OPTIMIZED IMPLEMENTATION GUIDE

Each prompt is designed to stay well under the 300k token limit. Feed them one at a time.

---

## 📦 PROMPT 1: INSTALL DEPENDENCIES

```
Install these dependencies for the 8 Dominos app:

npx expo install react-native-svg expo-av expo-haptics

Confirm when done.
```

---

## 🎨 PROMPT 2A: DOMINO TILE - ANIMATION SETUP

```
Update components/DominoTile.tsx - Part 1: Animation Setup

Add these animation refs at the top of the component (after existing refs):
- translateYAnim: new Animated.Value(0)

Update the animation logic in useEffect when completed becomes true:

Replace the current animation sequence with this 3-phase approach:

Phase 1: Anticipation (pull back)
- Parallel: scale to 0.95 (100ms), rotate to -0.05 (100ms)

Phase 2: Fall (spring)
- Parallel: spring scale to 1, spring rotate to 1, timing translateY to -3 (200ms)
- Use spring configs: tension: 100, friction: 7

Phase 3: Settle
- Spring translateY back to 0

Add translateY to the transform array in the Animated.View.

When completed is false, animate all values back to defaults.

Make this change now and confirm.
```

---

## 🎨 PROMPT 2B: DOMINO TILE - ROTATION FIX

```
Update components/DominoTile.tsx - Part 2: Fix Rotation

Change the rotateInterpolate to be much more subtle:
- inputRange: [0, 1]
- outputRange: ['0deg', '2deg']  (currently 15deg - too much!)

This creates a subtle tilt instead of dramatic rotation.

Confirm when done.
```

---

## 🎨 PROMPT 2C: DOMINO TILE - DOTS ENHANCEMENT

```
Update components/DominoTile.tsx - Part 3: Enhance Dots

1. Update dominoDots mapping to add completion state:
   - Add a 'completed' prop check for each dot
   - Style: completed dots should be fully black, incomplete should be gray

2. Update dot styles:
   - Default dot: width: 12, height: 12, backgroundColor: '#d1d5db', borderColor: '#9ca3af'
   - Completed dot (new style): backgroundColor: '#000000', borderColor: '#000000', add shadow
   - Border width: 2

3. Add a dots container background:
   - Wrap dots in a View with style dotsSection
   - Background: 'rgba(0, 0, 0, 0.03)' when incomplete
   - Background: 'rgba(0, 0, 0, 0.08)' when completed
   - Padding: 8 vertical, 12 horizontal
   - Border radius: 12
   - Margin bottom: 14

Confirm when done.
```

---

## 🎨 PROMPT 2D: DOMINO TILE - STYLING POLISH

```
Update components/DominoTile.tsx - Part 4: Final Styling

1. Update tile border radius to 20 (currently 16)
2. Update border width to 2
3. Increase minHeight to 130
4. Update shadows:
   - shadowOffset: { width: 0, height: 4 }
   - shadowOpacity: 0.15
   - shadowRadius: 8
   - elevation: 5
5. When completed, add yellow glow to shadow:
   - shadowColor: '#fedd14'
   - shadowOpacity: 0.3
6. Update title font:
   - fontSize: 20
   - fontWeight: '800'
   - letterSpacing: 0.3
7. Update activity text:
   - fontSize: 15
   - When completed: fontWeight: '600'
   - When incomplete: fontWeight: '500'

Confirm when done.
```

---

## 📊 PROMPT 3A: SCORE DISPLAY - CIRCULAR PROGRESS SETUP

```
Update components/ScoreDisplay.tsx - Part 1: Add Circular Progress

Import SVG components at the top:
import Svg, { Circle } from 'react-native-svg';

Add circular progress configuration constants:
- size = 100
- strokeWidth = 10
- center = size / 2
- radius = (size - strokeWidth) / 2
- circumference = 2 * Math.PI * radius

Calculate strokeDashoffset for daily progress:
- dailyDashOffset = circumference - (dailyPercentage / 100) * circumference

Add function to get score color based on percentage:
- 100%: '#10b981'
- >=75%: '#fedd14'
- >=50%: '#f59e0b'
- <50%: '#ef4444'

Confirm when done, then I'll give you the render part.
```

---

## 📊 PROMPT 3B: SCORE DISPLAY - RENDER CIRCLES

```
Update components/ScoreDisplay.tsx - Part 2: Render Circular Progress

Replace the current progress bar UI with circular progress:

Structure for daily score:
1. Wrap in View (circularProgressContainer)
2. Add Svg component (width/height = 100)
3. Inside Svg:
   - Background Circle: cx={center}, cy={center}, r={radius}, stroke="#fffbea", strokeWidth={strokeWidth}, fill="none"
   - Progress Circle: same props but stroke={dailyColor}, strokeDasharray={circumference}, strokeDashoffset={dailyDashOffset}, strokeLinecap="round", rotation="-90", origin={center, center}
4. Position absolute inner View showing score numbers

Score text inside circle:
- Large number (32, fontWeight 800, colored by progress)
- Small /8 (18, opacity 0.6)

Add label below circle: "Today" (14, fontWeight 700, uppercase)

Do the same for weekly score if showWeekly is true.

Confirm when done.
```

---

## 📊 PROMPT 3C: SCORE DISPLAY - ADD ANIMATION & MESSAGES

```
Update components/ScoreDisplay.tsx - Part 3: Polish

1. Add pulse animation when score changes:
   - Create scaleAnim ref
   - useEffect watching dailyScore
   - When changes: scale to 1.15 (150ms) → spring back to 1
   - Apply to score value text

2. Add motivational message section at bottom:
   - Border-top: 2px rgba(0, 0, 0, 0.1)
   - Padding-top: 16, margin-top: 16
   - Messages based on score:
     * 8/8: "🔥 Perfect Day! All dominos down!"
     * 6-7: "💪 Great progress! Keep going!"
     * 4-5: "⚡ Halfway there!"
     * 1-3: "🎯 Good start! Stack those Ws!"
     * 0: "👊 Start stacking your wins!"

3. Update container styling:
   - borderRadius: 24
   - padding: 24
   - shadowOffset: { width: 0, height: 6 }
   - shadowOpacity: 0.2
   - shadowRadius: 12
   - elevation: 8

Confirm when done.
```

---

## 🎉 PROMPT 4A: CONFETTI - CREATE COMPONENT FILE

```
Create new file: components/ConfettiCelebration.tsx

Import: React, useEffect, useRef, View, StyleSheet, Animated, Dimensions

Interface:
interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

Interface for confetti piece:
interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
}

Constants:
- COLORS = ['#fedd14', '#000000', '#10b981', '#ef4444', '#3b82f6', '#f59e0b']
- CONFETTI_COUNT = 50
- Get screen dimensions

Create component shell that returns null when trigger is false.

Confirm when done, then I'll give you the animation logic.
```

---

## 🎉 PROMPT 4B: CONFETTI - ANIMATION LOGIC

```
Update components/ConfettiCelebration.tsx - Add Animation

1. Create ref for confetti pieces array
2. Initialize in useEffect (empty dependency):
   - Create 50 pieces with random colors and shapes
   - Initial values: x at screen center, y at -50, rotate/scale at 0/1

3. Add launchConfetti function:
   - For each piece, reset values
   - Create parallel animations:
     * X: random across screen width
     * Y: fall to screen height + 100
     * Rotate: 0 to 10 (3600deg spin)
     * Scale: 0 → 1 → 0 (appear/disappear)
   - Stagger by index * 30ms
   - Duration: 2000 + random 1000ms

4. Trigger in useEffect when trigger becomes true

5. Rotate interpolate: 0-10 → '0deg'-'3600deg'

Confirm when done, then I'll give you the render logic.
```

---

## 🎉 PROMPT 4C: CONFETTI - RENDER & STYLES

```
Update components/ConfettiCelebration.tsx - Render

1. Create renderConfettiPiece function:
   - Returns Animated.View
   - Applies transform: translateX, translateY, rotate, scale
   - Applies background color
   - Applies shape style

2. Shape styles:
   - circle: borderRadius 6, 12x12
   - square: borderRadius 2, 12x12
   - triangle: border trick (width 0, height 0, borderLeft/Right 6, borderBottom 12, transparent sides)

3. Render in return:
   - Full screen absolute View (zIndex 9999, pointerEvents "none")
   - Map confettiPieces and renderConfettiPiece

Export component.

Confirm when done.
```

---

## 🔊 PROMPT 5: SOUND EFFECTS UTILITY

```
Create new file: utils/soundEffects.ts

Import Audio from expo-av

Create SoundEffects class with:
- private sounds: { [key: string]: Audio.Sound } = {}
- private enabled: boolean = true

Methods:
1. async initialize() - set audio mode (playsInSilentModeIOS: false)
2. async loadSound(key, url) - load one sound
3. async loadAllSounds() - load complete, perfect, toggle sounds
4. async play(soundKey) - play if enabled, use replayAsync()
5. async playComplete() - play('complete')
6. async playPerfect() - play('perfect')
7. async playToggle() - play('toggle')
8. setEnabled(enabled: boolean)
9. isEnabled()
10. async cleanup() - unload all

Use these URLs:
- complete: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
- perfect: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
- toggle: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'

Export singleton: export const soundEffects = new SoundEffects();

Confirm when done.
```

---

## 📅 PROMPT 6: ENHANCE DAY NAVIGATOR

```
Update components/DayNavigator.tsx

1. Add day of week display above date:
   - Get day name from date.getDay()
   - Style: fontSize 16, fontWeight 700, uppercase, letterSpacing 0.5

2. Enhance button styling:
   - borderRadius: 16
   - padding: 14
   - minWidth/minHeight: 52
   - borderWidth: 2
   - shadowOffset: { width: 0, height: 4 }
   - shadowOpacity: 0.15
   - shadowRadius: 8
   - elevation: 5

3. Improve Today badge:
   - borderWidth: 2
   - borderRadius: 12
   - fontSize: 12, fontWeight: 800, letterSpacing: 0.5
   - Add shadow

4. Add "Future" badge for dates after today:
   - Background: #e5e7eb
   - Text: #6b7280
   - Same styling as Today

5. Add "Jump to Today" button (only show when not on today):
   - Calendar icon + text
   - Background: rgba(254, 221, 20, 0.2)
   - Border: 1px #fedd14
   - Appears below nav buttons

6. Add container borderBottom: 2px black

7. Icons strokeWidth: 3

Confirm when done.
```

---

## 📈 PROMPT 7A: WEEKLY OVERVIEW - SETUP & STATS

```
Create/Update app/(tabs)/weekly.tsx - Part 1: Structure & Stats

Create basic structure with:
- ScrollView container
- Import ScoreDisplay component

Add header section:
- Title: "Weekly Overview" (fontSize 28, fontWeight 800)
- Week range badge (placeholder text: "Nov 24 - Nov 30, 2025")

Add ScoreDisplay component with showWeekly={true}

Create performance summary card with:
1. Calculate weeklyPercentage from props
2. Display large percentage (fontSize 48, fontWeight 800)
3. Trend icon based on %:
   - ≥75%: TrendingUp green
   - ≥50%: Minus yellow
   - <50%: TrendingDown red
4. Three stats: Completed, Missed, Perfect Days
5. White background, border 2px black, borderRadius 20, shadow

Calculate stats from weekData and dominos props.

Confirm when done, then I'll add the heatmap.
```

---

## 📈 PROMPT 7B: WEEKLY OVERVIEW - DAILY HEATMAP

```
Update app/(tabs)/weekly.tsx - Part 2: Daily Heatmap

Add heatmap card below performance summary:

1. Card title: "Daily Breakdown"
2. Calculate daily scores for all 7 days
3. Create 7 vertical bars:
   - Height based on (dayScore / 8) * 100%
   - Color coded:
     * 100%: #10b981
     * 75-99%: #fedd14
     * 50-74%: #f59e0b
     * <50%: #ef4444
   - Show score number inside bar
   - Day label below (Mon, Tue, Wed...)
   - Today's bar has thicker border (3px vs 2px)

4. Heatmap container:
   - Height: 150
   - Bars use flexDirection row, alignItems flex-end
   - Each bar: flex 1, width 80%, minHeight 20
   - Border radius: 8

5. White card background, standard styling

Confirm when done, then I'll add the domino list.
```

---

## 📈 PROMPT 7C: WEEKLY OVERVIEW - DOMINO PERFORMANCE LIST

```
Update app/(tabs)/weekly.tsx - Part 3: Domino Performance

Add domino list card below heatmap:

1. Calculate completion stats for each domino (completed/7)
2. Sort by percentage (high to low)
3. Identify best (highest %) and worst (lowest %)

For each domino, show item with:
- Number badge (1-8) in yellow circle
- Domino title
- Score (X/7)
- Horizontal progress bar (80px wide, color coded like heatmap)
- Best domino: 🏆 badge, green tint background
- Worst domino: ⚠️ badge, red tint background

Make items tappable with state tracking (selectedDomino).

When tapped, expand to show 7 day dots:
- 7 circles in a row
- Completed: green filled (#10b981)
- Incomplete: gray (#e5e7eb)
- Day letter below (M, T, W, T, F, S, S)

Standard card styling.

Confirm when done, then I'll add motivation footer.
```

---

## 📈 PROMPT 7D: WEEKLY OVERVIEW - MOTIVATION & PROPS

```
Update app/(tabs)/weekly.tsx - Part 4: Motivation & Finalize

Add motivational footer card:
- Yellow background (#fedd14)
- Title and message based on weekly %:
  * 100%: "🔥 Perfect Week!" / "Incredible discipline..."
  * 75-99%: "💪 Strong Performance!" / "Solid week..."
  * 50-74%: "⚡ Keep Building!" / "Halfway there..."
  * <50%: "🎯 Let's Level Up!" / "Every champion..."

Add component props interface:
interface WeeklyOverviewProps {
  dominos: Domino[];
  weekData: Record<DayOfWeek, Record<string, boolean>>;
  currentDate: Date;
}

Add bottom spacer (40px height).

Apply consistent styling:
- All cards: white background (except motivation = yellow)
- Border radius: 20
- Border: 2px black
- Shadow: offset (0, 4), opacity 0.15, radius 8
- Margins: 16 horizontal, 12 vertical

Confirm when done.
```

---

## ⚙️ PROMPT 8A: SETTINGS SCREEN - STRUCTURE & PREFERENCES

```
Create/Update app/(tabs)/settings.tsx - Part 1: Structure

Create ScrollView with sections:

Header:
- Settings icon (32px) centered
- "Settings" title below (fontSize 32, fontWeight 800)

Preferences Section:
1. Sound Effects toggle:
   - Volume2/VolumeX icon
   - Title: "Sound Effects"
   - Description: "Play sounds when completing dominos"
   - Switch component (trackColor: gray/yellow, thumb: gray/black)
   - State: soundEnabled
   - On toggle: call soundEffects.setEnabled(), play test sound if enabling

2. Daily Reminders toggle (same styling):
   - Bell/BellOff icon
   - State: notificationsEnabled
   - Placeholder for future implementation

Styling for setting items:
- White background
- Border radius: 16
- Border: 2px black
- Padding: 16
- Row layout with space-between
- Icon and text on left, switch on right

Confirm when done, then I'll add data management.
```

---

## ⚙️ PROMPT 8B: SETTINGS SCREEN - DATA MANAGEMENT & ABOUT

```
Update app/(tabs)/settings.tsx - Part 2: Actions & Info

Data Management Section:

1. Reset Week button:
   - RotateCcw icon in orange container (44x44)
   - Title: "Reset This Week"
   - Description: "Clear all progress for the current week"
   - On press: show Alert with confirmation, call onResetWeek prop

2. Delete All Data button (same layout):
   - Trash2 icon in red container
   - Title: "Delete All Data" (red text)
   - Description: "Permanently remove all dominos and progress"
   - On press: DOUBLE Alert confirmation, call onResetData prop

About Section:

1. Info card (yellow background):
   - Info icon
   - Title: "The 8 Dominos Philosophy"
   - Description paragraph about the 8 areas
   - Quote: "What if you actually did everything you said you would?"

2. Version card (white):
   - "Version 1.0.0"
   - "Built by Hasslogics"

Component props:
interface SettingsScreenProps {
  onResetData: () => void;
  onResetWeek: () => void;
}

Confirm when done, then I'll add stats.
```

---

## ⚙️ PROMPT 8C: SETTINGS SCREEN - STATS & STYLING

```
Update app/(tabs)/settings.tsx - Part 3: Stats & Finalize

Add Stats Section ("Your Journey"):

2x2 grid of stat cards:
1. Total Dominos: "—"
2. Current Streak: "—"
3. Perfect Days: "—"
4. Best Week: "—"

Each card:
- White background
- Padding: 20
- Border radius: 16
- Border: 2px black
- Centered text
- Large value (fontSize 32, fontWeight 800)
- Small label below (fontSize 12, gray)
- Min width: 47%
- Gap: 8

Apply consistent styling throughout:
- Background: #fffbea
- Section titles: fontSize 14, fontWeight 800, uppercase, letterSpacing 1, opacity 0.6
- Margins: 16-20px
- Bottom spacer: 40px

Action icon containers:
- Warning (orange): backgroundColor rgba(245, 158, 11, 0.1), borderColor #f59e0b
- Danger (red): backgroundColor rgba(239, 68, 68, 0.1), borderColor #ef4444

Confirm when done.
```

---

## 🎯 PROMPT 9: CUSTOM TAB BAR

```
Create new file: components/CustomTabBar.tsx

Accept props: state, descriptors, navigation (from React Navigation)

For each route in state.routes:

1. Determine if focused (state.index === index)
2. Get icon based on route.name:
   - 'index' or 'daily': Home icon
   - 'weekly': Calendar icon
   - 'settings': Settings icon
3. Get label: Daily, Weekly, Settings

Render TouchableOpacity for each tab:
- Icon in container (48x48, borderRadius 16)
- If focused:
  * Container background: #fedd14
  * Border: 2px black
  * Enhanced shadow
  * Bold icon (strokeWidth 2.5)
  * Black text (fontWeight 800)
  * Bottom indicator line (32px wide, 3px height, black, absolute bottom)
- If not focused:
  * Transparent background
  * Gray icon/text (#6b7280)
  * Normal weight (strokeWidth 2, fontWeight 600)

Tab bar container:
- Background: #fffbea
- Border top: 2px black
- Shadow on top
- Padding: 8 top, 24 bottom (iOS) / 8 (Android)
- flexDirection: row

Export component.

Then update app/(tabs)/_layout.tsx:
- Import CustomTabBar
- Add tabBar prop: tabBar={(props) => <CustomTabBar {...props} />}

Confirm when done.
```

---

## 🎨 PROMPT 10A: ONBOARDING - AUTO-SAVE SETUP

```
Update components/OnboardingScreen.tsx - Part 1: Auto-Save

Add state:
- hasUnsavedChanges: boolean (default false)

Add useEffect to auto-save dominos:
- Watch: dominos, currentStep, hasUnsavedChanges
- If currentStep > 0 AND hasUnsavedChanges:
  * Set timeout for 1 second (debounce)
  * Call StorageService.saveDominos(dominos)
  * Log "✅ Auto-saved dominos"
  * Clear timeout on cleanup

Update DominoSetupForm onSave callback:
- Set dominos state
- Set hasUnsavedChanges to true

Add auto-save indicator in header (when saving):
- Show only if currentStep > 0 and hasUnsavedChanges
- Small badge: Save icon (12px) + "Auto-saving..." text
- Green background: rgba(16, 185, 129, 0.15)
- Position: flex row in headerTop, right side

Confirm when done, then I'll enhance the UI.
```

---

## 🎨 PROMPT 10B: ONBOARDING - UI ENHANCEMENTS

```
Update components/OnboardingScreen.tsx - Part 2: Polish UI

Welcome screen improvements (Step 1):
1. Enhance mini dominos:
   - Add transform: rotate('15deg')
   - Add shadow: offset (2, 4), opacity 0.2, radius 4
   - borderWidth: 2
2. Add "next step hint" card at bottom:
   - Text: "Next: Set up your daily activities →"
   - Background: rgba(254, 221, 20, 0.2)
   - Border: 1px #fedd14
   - Padding: 12 vertical, 20 horizontal
   - Border radius: 12

Setup screen improvements (Step 2):
1. Add completion hint above button:
   - "✨ Your activities are being auto-saved"
   - Green text (#10b981), centered
2. Complete button includes ArrowRight icon

Header styling updates:
- Border bottom: 2px black (not 1px)
- Title: fontSize 28, fontWeight 800, letterSpacing -0.5

Button styling updates:
- Border radius: 16
- Padding: 18
- Border: 2px black
- Shadow: offset (0, 4), opacity 0.15, radius 8
- Text: fontSize 18, fontWeight 800, letterSpacing 0.3

Confirm when done, then I'll fix the save logic.
```

---

## 🎨 PROMPT 10C: ONBOARDING - SAVE BEFORE TRANSITION

```
Update components/OnboardingScreen.tsx - Part 3: Save on Navigation

Update handleNext function:
- Before incrementing currentStep
- Try to save dominos: await StorageService.saveDominos(dominos)
- If error: show Alert("Error", "Failed to save...")
- Only proceed if save succeeds

Update handleComplete function:
- Already saves, so keep as is
- But ensure it shows Alert on error

This ensures dominos are saved when:
1. User types (auto-save after 1s)
2. User clicks "Get Started" (explicit save)
3. User clicks "Complete Setup" (final save)

Test flow:
1. Set up dominos on step 2
2. Click Complete Setup
3. Should save and proceed without data loss

Confirm when done.
```

---

## 🎵 PROMPT 11A: INTEGRATE SOUNDS - INITIALIZATION

```
Integrate sound effects - Part 1: App Initialization

In app/(tabs)/_layout.tsx or App.tsx (main layout file):

1. Import soundEffects from '@/utils/soundEffects'
2. Add useEffect on component mount:
   - Call soundEffects.initialize()
   - Call soundEffects.loadAllSounds()
   - Add cleanup: soundEffects.cleanup()
3. Wrap in try-catch, log any errors

This ensures sounds are loaded when app starts.

Confirm when done, then I'll integrate in components.
```

---

## 🎵 PROMPT 11B: INTEGRATE SOUNDS - DOMINO TILE

```
Integrate sound effects - Part 2: DominoTile

In components/DominoTile.tsx:

1. Import:
   - soundEffects from '@/utils/soundEffects'
   - * as Haptics from 'expo-haptics'

2. Update onToggle handler:
   - Add: await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
   - If marking complete: await soundEffects.playComplete()
   - If marking incomplete: await soundEffects.playToggle()

3. Wrap in try-catch (sounds/haptics might fail on some devices)

Test by toggling a domino - should feel vibration and hear sound.

Confirm when done.
```

---

## 🎵 PROMPT 11C: INTEGRATE SOUNDS - BUTTONS & SETTINGS

```
Integrate sound effects - Part 3: Buttons & Settings

Add haptics to these buttons:

1. DayNavigator arrows:
   - Import Haptics
   - Add Haptics.impactAsync(ImpactFeedbackStyle.Light) on press

2. Onboarding buttons (Get Started, Complete Setup):
   - Add Haptics.impactAsync(ImpactFeedbackStyle.Light)

3. Settings toggles:
   - Add Haptics.impactAsync(ImpactFeedbackStyle.Light) when switching
   - When enabling sound toggle: play soundEffects.playToggle() as test

4. Settings screen:
   - Import soundEffects
   - In handleToggleSound: call soundEffects.setEnabled(value)

Test all buttons for haptic feedback.

Confirm when done.
```

---

## 🎊 PROMPT 12: INTEGRATE CONFETTI

```
Integrate confetti in daily tracker screen

In your main daily tracker screen (app/(tabs)/index.tsx or similar):

1. Import:
   - ConfettiCelebration from '@/components/ConfettiCelebration'
   - soundEffects
   - Haptics

2. Add state: showConfetti (boolean, default false)

3. Add ref to track previous score: previousScoreRef

4. Add useEffect watching dailyScore:
   - If dailyScore === 8 AND previousScore < 8:
     * setShowConfetti(true)
     * soundEffects.playPerfect()
     * Haptics.notificationAsync(NotificationFeedbackType.Success)
     * setTimeout to reset confetti after 3000ms
   - Update previousScoreRef.current = dailyScore

5. Render ConfettiCelebration at root level of screen:
   - <ConfettiCelebration trigger={showConfetti} onComplete={() => console.log('Confetti done')} />

6. Ensure it's positioned after main content so it overlays everything

Test by completing all 8 dominos.

Confirm when done.
```

---

## 🧪 PROMPT 13A: POLISH - TYPOGRAPHY & SHADOWS

```
Final polish - Part 1: Consistency Pass

Go through all components and ensure:

Typography:
- All headers: fontWeight: '800', letterSpacing: -0.5 to 0.5
- All body text: fontWeight: '500' to '600'
- All labels: fontWeight: '700'
- Button text: fontWeight: '800', letterSpacing: 0.3

Shadows (apply based on component size):
- Small (buttons): offset (0, 2), opacity 0.1, radius 4, elevation 3
- Medium (cards): offset (0, 4), opacity 0.15, radius 8, elevation 5
- Large (score card): offset (0, 6), opacity 0.2, radius 12, elevation 8

Borders:
- All interactive elements: 2px black border
- All cards: 2px black border
- Subtle dividers: 1px with rgba(0, 0, 0, 0.1)

Confirm when done, then I'll do spacing.
```

---

## 🧪 PROMPT 13B: POLISH - SPACING & TESTING

```
Final polish - Part 2: Spacing & Test

Spacing consistency:
- Screen horizontal margins: 16-20px
- Card padding: 16-24px (larger for important cards like score)
- Vertical gaps between items: 8-12px
- Section gaps: 12-16px
- Bottom spacer on scrollable screens: 40px

Border radius consistency:
- Buttons: 16
- Cards: 20
- Small elements (badges): 12

Test checklist (mark each as you test):
1. Toggle dominos - animation smooth? ✓
2. Complete 8/8 - confetti triggers? ✓
3. Navigate days - date updates? ✓
4. View weekly overview - stats accurate? ✓
5. Expand domino in weekly - dots show? ✓
6. Toggle sound - works? ✓
7. Complete onboarding - saves? ✓
8. Switch tabs - smooth? ✓

Report any issues found.

Confirm when done.
```

---
---
# ✨ NEW FEATURES — PHASE 2
---
---

## 💬 PROMPT 15A: QUOTES - CREATE DATA FILE

```
Create new file: utils/quotes.ts

Create an array of motivational quotes exported as a constant.
Each quote is an object with:
- text: string (the quote itself)
- author: string (attribution)

Include 60 quotes. Mix styles:
- About discipline and consistency
- About balance and taking care of yourself
- About building habits and small wins
- About mental strength
- About legacy and purpose

Examples to get you started:
{ text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
{ text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
{ text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
{ text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
{ text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },

Fill out the remaining 55 quotes with real, authentic quotes from well-known figures.
Keep them short (max 2 lines when displayed on mobile).

Export as:
export const QUOTES = [...];

Also export a helper function:
export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

Confirm when done.
```

---

## 💬 PROMPT 15B: QUOTES - CREATE SPLASH SCREEN COMPONENT

```
Create new file: components/QuoteSplash.tsx

This screen shows a motivational quote while the app loads.
It displays for exactly 2.5 seconds then calls onComplete.

Props:
interface QuoteSplashProps {
  onComplete: () => void;
}

Structure:
1. Full screen view, background color #fedd14 (yellow)
2. Border: none, edge to edge
3. Centered content layout

Content (vertically centered):
- Small "8 DOMINOS" text at top
  * fontSize 14, fontWeight 800, letterSpacing 3, color #000, opacity 0.5
  * Uppercase

- Large quote text in the middle
  * Get quote using getRandomQuote() — store in state so it doesn't change on re-render
  * fontSize 22, fontWeight 700, color #000, textAlign center, lineHeight 32
  * Wrap in quotes: add opening " before and closing " after the text

- Author attribution below quote
  * "— AuthorName"
  * fontSize 14, fontWeight 600, color #000, opacity 0.6
  * marginTop 16

- Small domino dots decoration at the bottom
  * Row of 8 small black circles (8px diameter each)
  * Spaced evenly, opacity 0.3

Animations:
1. On mount: fade in the quote (opacity 0 → 1, duration 800ms)
2. After 1800ms: fade out (opacity 1 → 0, duration 500ms)
3. After fade out completes: call onComplete()

Total visible time: ~2.5 seconds

Use useEffect with a timeout for the fade out trigger.
Use Animated.Value for opacity.

Confirm when done.
```

---

## 💬 PROMPT 15C: QUOTES - INTEGRATE INTO APP

```
Integrate QuoteSplash into the app entry point.

In app/index.tsx or your main App component (wherever the app first renders):

1. Import QuoteSplash
2. Add state: showSplash (boolean, default true)
3. Render logic:
   - If showSplash is true: render <QuoteSplash onComplete={() => setShowSplash(false)} />
   - If showSplash is false: render the normal app (tabs/onboarding/whatever currently shows)

This means:
- Every time the app is opened fresh, the quote splash shows first
- After 2.5 seconds it fades out and the real app loads
- It only shows once per app open, not on every navigation

Test by:
1. Opening the app - quote should appear
2. Wait 2.5 seconds - should fade and show normal app
3. Close and reopen - should show a DIFFERENT random quote

Confirm when done.
```

---

## 📝 PROMPT 16A: JOURNAL - CREATE STORAGE LOGIC

```
Update utils/storage.ts - Add Journal Storage

Add these methods to your existing StorageService:

1. saveJournalEntry(date: string, entry: string): Promise<void>
   - Key format: 'journal_YYYY-MM-DD' (e.g., 'journal_2025-11-29')
   - Save the entry string to AsyncStorage using that key

2. getJournalEntry(date: string): Promise<string | null>
   - Retrieve entry for the given date key
   - Return null if nothing saved for that date

3. getAllJournalEntries(): Promise<Array<{ date: string, entry: string }>>
   - Get all keys from AsyncStorage
   - Filter for keys starting with 'journal_'
   - Return array of objects with date and entry
   - Sort by date descending (newest first)

Use the same AsyncStorage pattern already in the file.
Wrap all methods in try-catch.

Confirm when done.
```

---

## 📝 PROMPT 16B: JOURNAL - CREATE JOURNAL COMPONENT

```
Create new file: components/DailyJournal.tsx

This is a collapsible journal section that sits on the daily tracker screen.

Props:
interface DailyJournalProps {
  currentDate: Date;
}

Structure:
1. A yellow header bar that acts as a toggle button
   - Left side: Pencil icon (from lucide) + "Today's Journal" text
   - Right side: ChevronDown or ChevronUp icon (toggles based on open state)
   - Background: #fedd14, border bottom 2px black
   - Tap to expand/collapse

2. When expanded, show:
   - A TextInput (multiline, min 4 lines)
   - Placeholder: "How was your day? What did you accomplish? How do you feel?"
   - Background: #fffbea
   - Border: 2px black, borderRadius 12
   - Padding: 16
   - fontSize 15, color #000

   - A "Save" button below the input
     * Yellow background, border 2px black, borderRadius 12
     * Text: "Save Entry" with a Check icon
     * Only visible when text has changed from saved version

3. State management:
   - isExpanded: boolean
   - journalText: string
   - savedText: string (to track if changes were made)

4. On mount: load existing entry for currentDate using StorageService.getJournalEntry()
5. On save: call StorageService.saveJournalEntry() with formatted date and text
6. Show "Saved ✓" text briefly after saving (2 seconds)

Animation:
- Expand/collapse with a smooth height animation
- Use Animated.Value for maxHeight (0 → 300, duration 300ms, easing)

Confirm when done.
```

---

## 📝 PROMPT 16C: JOURNAL - INTEGRATE INTO DAILY TRACKER

```
Integrate DailyJournal into the daily tracker screen.

In app/(tabs)/index.tsx (your daily tracker):

1. Import DailyJournal component
2. Place it BELOW the ScoreDisplay and ABOVE the list of DominoTiles
3. Pass currentDate prop

Layout order on daily screen should now be:
1. DayNavigator (top)
2. ScoreDisplay (score card)
3. DailyJournal (collapsible - starts collapsed)
4. DominoTile x8 (the dominos)

The journal starts collapsed by default so it doesn't clutter the main view.
Users tap to expand when they want to write.

Test:
1. Open daily screen - journal should be collapsed
2. Tap header - should expand with smooth animation
3. Type something
4. Tap Save
5. Close and reopen - entry should persist
6. Navigate to different day - should show empty or that day's entry

Confirm when done.
```

---

## 😊 PROMPT 17A: MOOD - CREATE MOOD COMPONENT

```
Create new file: components/MoodCheckIn.tsx

This component handles the morning and evening mood check-in.

Props:
interface MoodCheckInProps {
  currentDate: Date;
  period: 'morning' | 'evening';
  onSave: (mood: number) => void;
  savedMood: number | null;
}

The mood scale is 1-5, represented by these emojis:
1: 😞  2: 😐  3: 😊  4: 😁  5: 🔥

Structure:
1. A card with:
   - Title: "Morning Check-In" or "Evening Check-In" based on period prop
   - Small subtitle: 
     * Morning: "How are you starting today?"
     * Evening: "How did today end?"
   - Background: #ffffff, border 2px black, borderRadius 16

2. Emoji selector row (centered):
   - 5 TouchableOpacity buttons in a row
   - Each shows the emoji at fontSize 28
   - Each has a subtle circle background (40x40, borderRadius 20)
   - Selected emoji: background #fedd14, border 2px black, scale up slightly (1.1)
   - Unselected: background transparent, no border
   - Smooth scale animation on selection

3. If savedMood exists (not null):
   - Show the saved emoji selected
   - Show small green text below: "Saved ✓"
   - Disable further selection (or allow re-selection)

4. On selection:
   - Animate the selected emoji (quick pulse: scale 1 → 1.2 → 1)
   - Call onSave with the mood value (1-5)

Confirm when done.
```

---

## 😊 PROMPT 17B: MOOD - CREATE STORAGE LOGIC

```
Update utils/storage.ts - Add Mood Storage

Add these methods to StorageService:

1. saveMood(date: string, period: 'morning' | 'evening', mood: number): Promise<void>
   - Key format: 'mood_YYYY-MM-DD_morning' or 'mood_YYYY-MM-DD_evening'
   - Save the mood number (1-5) as a string

2. getMood(date: string, period: 'morning' | 'evening'): Promise<number | null>
   - Retrieve mood for given date and period
   - Parse back to number
   - Return null if not found

3. getWeekMoods(startDate: string): Promise<Array<{ date: string, morning: number | null, evening: number | null }>>
   - Takes the Monday date of the week as startDate
   - Loop through 7 days (Monday to Sunday)
   - For each day, get both morning and evening moods
   - Return array of 7 objects

Use same AsyncStorage pattern. Wrap in try-catch.

Confirm when done.
```

---

## 😊 PROMPT 17C: MOOD - INTEGRATE INTO DAILY TRACKER

```
Integrate mood check-ins into the daily tracker screen.

In app/(tabs)/index.tsx:

1. Import MoodCheckIn component
2. Add state for morning and evening moods:
   - morningMood: number | null (default null)
   - eveningMood: number | null (default null)

3. On mount / when currentDate changes:
   - Load saved moods: StorageService.getMood(date, 'morning') and getMood(date, 'evening')
   - Set state with results

4. Determine which check-in to show based on time of day:
   - Before 12:00 noon: show Morning Check-In
   - After 12:00 noon: show Evening Check-In
   - If morning mood is not saved AND it's afternoon: show Morning first, then Evening below it
   - This way users don't miss morning if they open late

5. Place mood check-ins BELOW the DailyJournal and ABOVE the DominoTiles

Layout order on daily screen:
1. DayNavigator
2. ScoreDisplay
3. DailyJournal (collapsible)
4. MoodCheckIn (morning and/or evening)
5. DominoTile x8

6. Save handler:
   - Call StorageService.saveMood() with date, period, and selected mood
   - Update local state

Test:
1. Open app before noon - should show Morning Check-In
2. Select a mood - should save and show "Saved ✓"
3. Open app after noon - should show Evening Check-In (and Morning if not done)

Confirm when done.
```

---

## 📊 PROMPT 18A: MOOD TREND - CREATE CHART COMPONENT

```
Create new file: components/MoodTrendChart.tsx

A simple line chart showing mood across 7 days of the week.
Uses react-native-svg (already installed).

Props:
interface MoodTrendChartProps {
  data: Array<{
    date: string;
    morning: number | null;
    evening: number | null;
    dayLabel: string;  // e.g. "Mon", "Tue"
  }>;
}

Structure:
1. Card container:
   - Title: "Mood This Week"
   - Background: #ffffff, border 2px black, borderRadius 20
   - Padding: 20

2. Legend (below title, horizontal row):
   - Yellow dot + "Morning"
   - Black dot + "Evening"
   - fontSize 12, fontWeight 600

3. SVG Chart area:
   - Width: full card width minus padding
   - Height: 140px
   - Y-axis range: 1 to 5 (mood scale)
   - X-axis: 7 days (Mon-Sun)

4. Drawing logic:
   - Calculate point positions:
     * X: evenly spaced across width (index * (width / 6))
     * Y: map mood 1-5 to pixel height (5 = top, 1 = bottom)
   - Draw morning line: yellow (#fedd14) stroke, width 3
   - Draw evening line: black (#000000) stroke, width 3
   - Draw dots at each data point: circles radius 5
     * Morning dots: yellow fill, black border
     * Evening dots: black fill
   - Skip points where mood is null (don't draw dot or connect line through it)

5. Day labels below chart:
   - Row of 7 labels (Mon, Tue, Wed...)
   - fontSize 11, fontWeight 600, color #000, opacity 0.5
   - Evenly spaced

6. If no mood data at all this week:
   - Show placeholder text: "Start checking in to see your mood trend"
   - Centered, gray, italic

Use SVG Path for lines and Circle for dots.

Confirm when done.
```

---

## 📊 PROMPT 18B: MOOD TREND - INTEGRATE INTO WEEKLY OVERVIEW

```
Integrate MoodTrendChart into the weekly overview screen.

In app/(tabs)/weekly.tsx:

1. Import MoodTrendChart
2. Import StorageService

3. Add state: weekMoods (array of mood data for the week)

4. On mount / when week changes:
   - Calculate the Monday of the current week
   - Call StorageService.getWeekMoods(mondayDate)
   - Format data for MoodTrendChart:
     * Map each day to { date, morning, evening, dayLabel }
     * dayLabel: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
   - Set weekMoods state

5. Place MoodTrendChart BELOW the Daily Breakdown heatmap
   and ABOVE the Domino Performance list

Layout order on weekly screen:
1. Header
2. ScoreDisplay
3. Performance Summary Card
4. Daily Breakdown Heatmap
5. MoodTrendChart  ← NEW
6. Domino Performance List
7. Motivation Footer

Test:
1. Check in with moods on a few days
2. Open weekly overview
3. Chart should show lines for days with data
4. Days without data should have gaps in the line

Confirm when done.
```

---

## 📱 PROMPT 19: BUILD PREPARATION

```
Prepare for deployment

1. Update app.json:
   - name: "8 Dominos"
   - slug: "8-dominos"
   - version: "1.0.0"
   - Update description: "Track 8 key life habits daily. Build momentum, stack wins, achieve balance."

2. Clean up code:
   - Remove excessive console.logs (keep error logs)
   - Remove unused imports
   - Remove commented-out code

3. Create README.md with:
   - Project description
   - Setup instructions (npm install, npx expo start)
   - Feature list
   - Tech stack
   - Credits: "Built by Hasslogics"

4. Test final build:
   - Run: npx expo start --clear
   - Test on device via Expo Go
   - Verify all features work
   - Check performance

5. App icon requirements:
   - 1024x1024 PNG
   - Yellow background (#fedd14)
   - Black domino tiles design
   - Save as assets/icon.png

6. Splash screen requirements:
   - Yellow background
   - "8 Dominos" text
   - Save as assets/splash.png

Confirm when ready for deployment.
```

---

## ✅ FULL EXECUTION ORDER

```
PHASE 1 — Core UI (already done ✓)
[✓] 1     Install dependencies
[✓] 2A    DominoTile animation
[✓] 2B    DominoTile rotation
[✓] 2C    DominoTile dots
[✓] 2D    DominoTile styling
[✓] 3A    Score setup
[✓] 3B    Score circles
[✓] 3C    Score polish
[✓] 4A    Confetti file
[✓] 4B    Confetti animation
[✓] 4C    Confetti render
[✓] 5     Sound utility
[✓] 6     Day navigator
[✓] 7A    Weekly stats
[✓] 7B    Weekly heatmap
[✓] 7C    Weekly list
[✓] 7D    Weekly motivation
[✓] 8A    Settings structure
[✓] 8B    Settings actions
[✓] 8C    Settings stats
[✓] 9     Tab bar

PHASE 2 — Remaining Integration
[ ] 10A   Onboarding auto-save
[ ] 10B   Onboarding UI
[ ] 10C   Onboarding save
[ ] 11A   Sounds init
[ ] 11B   Sounds domino
[ ] 11C   Sounds buttons
[ ] 12    Confetti integration
[ ] 13A   Polish typography
[ ] 13B   Polish spacing

PHASE 3 — NEW FEATURES
[ ] 15A   Quotes data file
[ ] 15B   Quote splash screen
[ ] 15C   Quote splash integration
[ ] 16A   Journal storage
[ ] 16B   Journal component
[ ] 16C   Journal integration
[ ] 17A   Mood component
[ ] 17B   Mood storage
[ ] 17C   Mood integration
[ ] 18A   Mood trend chart
[ ] 18B   Mood trend integration

PHASE 4 — Ship It
[ ] 19    Build preparation
```

### Tips:
- **Multi-part prompts (2A-2D, 3A-3C, etc.) must be done in sequence**
- Test after completing each component (after 2D, 3C, 4C, etc.)
- Single-letter prompts (A, B, C) build on each other - don't skip
- **Phase 3 prompts can be done in any group order** (all 15s, then all 16s, etc.)
- Within each group, letters must be sequential (A before B before C)

Good luck! 🚀
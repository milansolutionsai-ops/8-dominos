# 8 Dominos Mobile App - Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [The 8 Dominos Philosophy](#the-8-dominos-philosophy)
3. [Technical Stack](#technical-stack)
4. [Project Architecture](#project-architecture)
5. [Current Implementation Status](#current-implementation-status)
6. [Completed Features (Prompts 1-13B)](#completed-features)
7. [Remaining Work (Phase 3)](#remaining-work)
8. [Design System](#design-system)
9. [Data Model & Storage](#data-model--storage)
10. [Component Hierarchy](#component-hierarchy)
11. [Development Setup](#development-setup)
12. [Known Constraints & Decisions](#known-constraints--decisions)

---

## 📱 Project Overview

**App Name:** 8 Dominos  
**Platform:** iOS & Android (React Native)  
**Client:** Hasslogics  
**Purpose:** Companion app for Hasslogics' 8-week accountability coaching program ($444 package)  
**Developer:** Milan Veljkovikj (Macedonia)  
**Status:** 70% complete (Core UI done, new features in progress)

### Business Context
This app is **NOT** a standalone product. It's bundled with:
- 8-week coaching program
- Course materials
- Book
- 1-on-1 coaching sessions

The app is designed to be used **beyond** the 8-week program—users continue tracking dominos weekly indefinitely.

---

## 🎯 The 8 Dominos Philosophy

### Core Concept
The "8 Dominos" is a daily accountability system based on the principle that successful people maintain balance across 8 fundamental life domains. Each completed "domino" is a "Little W" (small win) that compounds over time.

### The Hook
> **"What if you actually did everything you said you would?"**

### The 8 Dominos (Life Pillars)

| # | Domino | Car Analogy | Definition |
|---|--------|-------------|------------|
| 1 | **Body** | The Vehicle | Physical strength, appearance, fitness. Is it a dented clunker or a pristine S-Class? |
| 2 | **Health** | The Engine | Internal performance. Nutrition, organs, longevity. V12 or sputtering 4-cylinder? |
| 3 | **Happiness** | The Maintenance | Gratitude and mindset. Is the interior clean or full of trash/negative thoughts? |
| 4 | **Love** | The Passengers | Relationships. Who is riding with you? Supporting or distracting? |
| 5 | **Wealth** | The Club | Financial literacy and network. "Ferraris hang out with Ferraris." |
| 6 | **Work** | The Mods | Career and output. Performance upgrades or cheap rain covers? |
| 7 | **Spirituality** | The Traction | Grounding and faith. Grip so you don't slip in bad weather. |
| 8 | **Soul** | The Warranty | The Afterlife/Legacy. What happens after the car stops running forever. |

### Key Principles
- **Binary Tracking:** Did you do it or not? No "kind of" or "almost."
- **Daily Execution:** The checkmark doesn't care how you feel. It only cares if you executed.
- **Stack Little Ws:** Small consistent wins compound into life-changing momentum.
- **Lose yourself to find yourself:** Daily discipline leads to freedom.

### Visual Theme
The app uses **domino tiles** as the core visual metaphor:
- 8 dots on each tile representing the 8 dominos
- Tiles "fall" when completed (satisfying animation)
- Binary state: Standing (incomplete) vs. Fallen (complete)

**Note:** The original "car analogy" metaphor was considered but ultimately **skipped** in favor of keeping the domino theme pure.

---

## 🛠 Technical Stack

### Core Framework
- **React Native** via **Expo SDK**
- **TypeScript** (strict mode)
- **Expo Router** (file-based routing)

### Key Dependencies
```json
{
  "expo": "~51.x",
  "react-native": "0.74.x",
  "react": "18.2.x",
  "typescript": "~5.3.x",
  "expo-router": "~3.5.x",
  "lucide-react-native": "^0.263.1",
  "react-native-svg": "^14.1.0",
  "expo-av": "~14.0.x",
  "expo-haptics": "~13.0.x",
  "@react-native-async-storage/async-storage": "1.23.x"
}
```

### Libraries & Tools
| Library | Purpose | Status |
|---------|---------|--------|
| **lucide-react-native** | Icon system | ✅ Installed |
| **react-native-svg** | Circular progress rings, charts | ✅ Installed |
| **expo-av** | Sound effects (completion, perfect day) | ✅ Installed |
| **expo-haptics** | Tactile feedback on interactions | ✅ Installed |
| **AsyncStorage** | Local data persistence (no backend) | ✅ Installed |
| **Animated API** | All animations (domino fall, confetti, etc.) | ✅ Built-in |

### What's NOT Used
- ❌ No backend (fully client-side)
- ❌ No cloud sync
- ❌ No user accounts / authentication
- ❌ No push notifications (yet - considered for future)
- ❌ No third-party analytics
- ❌ No in-app purchases / monetization

---

## 🏗 Project Architecture

### File Structure
```
8-dominos/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation with custom tab bar
│   │   ├── index.tsx             # Daily tracker (main screen)
│   │   ├── weekly.tsx            # Weekly overview with stats
│   │   └── settings.tsx          # Settings & preferences
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # App entry point (splash screen logic here)
│
├── components/
│   ├── ConfettiCelebration.tsx   # 8/8 celebration animation
│   ├── CustomTabBar.tsx          # Custom bottom tab navigation
│   ├── DayNavigator.tsx          # Date navigation controls
│   ├── DominoSetupForm.tsx       # Setup screen for defining activities
│   ├── DominoTile.tsx            # Individual domino card with animation
│   ├── OnboardingScreen.tsx      # First-time user setup flow
│   └── ScoreDisplay.tsx          # Circular progress rings (daily/weekly)
│
├── types/
│   └── domino.ts                 # TypeScript interfaces & types
│
├── utils/
│   ├── dateUtils.ts              # Date formatting & manipulation
│   ├── soundEffects.ts           # Audio playback management
│   └── storage.ts                # AsyncStorage wrapper (CRUD operations)
│
├── assets/
│   ├── icon.png                  # App icon (1024x1024)
│   └── splash.png                # Splash screen
│
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

### Routing Strategy
Using **Expo Router** (file-based):
- `/` → Daily tracker (home screen)
- `/weekly` → Weekly overview
- `/settings` → Settings screen
- Onboarding shows on first launch only (controlled by AsyncStorage flag)

### State Management
**No Redux, MobX, or Zustand.** Using:
- **React `useState`** for component-level state
- **`useEffect`** for side effects (data loading, auto-save)
- **`useRef`** for animation values and previous state tracking
- **AsyncStorage** for persistence (acts as "database")

### Navigation Flow
```
App Launch
    ↓
[Check AsyncStorage: setupCompleted?]
    ↓
NO → OnboardingScreen (2 steps)
    ↓
YES → Tab Navigator (Daily, Weekly, Settings)
```

---

## ✅ Current Implementation Status

### Phase 1: Core UI (100% Complete) ✓
**Prompts 1-9 executed successfully.**

| Feature | Status | Notes |
|---------|--------|-------|
| Dependencies installed | ✅ | react-native-svg, expo-av, expo-haptics |
| DominoTile animation | ✅ | 3-phase fall animation (pull back → fall → settle) |
| DominoTile rotation fix | ✅ | Subtle 2° tilt (was 15°) |
| DominoTile dots enhancement | ✅ | Gray → black on complete, shadow effect |
| DominoTile styling polish | ✅ | Border radius 20, enhanced shadows |
| ScoreDisplay circular progress | ✅ | SVG rings, color-coded (green/yellow/orange/red) |
| ScoreDisplay animations | ✅ | Pulse animation on score change |
| ScoreDisplay messages | ✅ | Motivational text based on score |
| Confetti celebration | ✅ | 50 pieces, staggered animation, 3s duration |
| Sound effects utility | ✅ | Complete, perfect, toggle sounds |
| Day navigator enhancements | ✅ | Day of week, "Jump to Today" button |
| Weekly overview stats | ✅ | Performance summary, percentage display |
| Weekly heatmap | ✅ | 7-day bar chart, color-coded |
| Weekly domino list | ✅ | Expandable, best/worst badges |
| Weekly motivation footer | ✅ | Dynamic messages based on performance |
| Settings structure | ✅ | Sound toggle, notifications placeholder |
| Settings data management | ✅ | Reset week, delete all data (with confirmations) |
| Settings about section | ✅ | Philosophy card, version info |
| Custom tab bar | ✅ | Active state with yellow background, indicator line |

### Phase 2: Integration & Polish (100% Complete) ✓
**Prompts 10-13 executed successfully.**

| Feature | Status | Notes |
|---------|--------|-------|
| Onboarding auto-save | ✅ | 1s debounce, saves as user types |
| Onboarding UI enhancements | ✅ | Next step hint, improved shadows |
| Onboarding save on navigation | ✅ | Explicit save before transitioning |
| Sound initialization | ✅ | Loads on app mount in main layout |
| Sounds in DominoTile | ✅ | Haptics + sound on toggle |
| Sounds in buttons/settings | ✅ | Light haptics throughout, test sound in settings |
| Confetti integration | ✅ | Triggers on 8/8, with perfect sound & haptic |
| Typography consistency | ✅ | Headers 800, body 500-600, labels 700 |
| Shadow consistency | ✅ | Small/medium/large categorized |
| Spacing consistency | ✅ | 16-20px margins, 8-12px gaps |

---

## 🚧 Remaining Work (Phase 3)

### NEW FEATURES - To Be Implemented

#### 1. Motivational Quotes on Splash Screen
**Prompts: 15A, 15B, 15C**

**Purpose:** Show a random motivational quote during app load (2.5-3 seconds).

**Implementation Details:**
- Create `utils/quotes.ts` with 60 quotes array
- Each quote: `{ text: string, author: string }`
- Create `components/QuoteSplash.tsx`:
  - Full screen, yellow background (#fedd14)
  - Fade in quote (800ms)
  - Display for 1.8s
  - Fade out (500ms)
  - Total: ~2.5s visible
- Integrate in `app/index.tsx` or main entry point
- State: `showSplash` (boolean) controls visibility
- After fade out: load main app

**UI Specs:**
- Background: #fedd14 (edge-to-edge)
- "8 DOMINOS" text at top (small, uppercase, letterSpacing 3)
- Quote in center: fontSize 22, fontWeight 700, textAlign center
- Author attribution: "— Name" below, fontSize 14, opacity 0.6
- 8 small dots at bottom (decoration)

**Storage:** None needed (quotes are static JSON).

---

#### 2. Daily Journal
**Prompts: 16A, 16B, 16C**

**Purpose:** Allow users to write free-form reflections each day.

**Implementation Details:**

**Storage (`utils/storage.ts`):**
```typescript
saveJournalEntry(date: string, entry: string): Promise<void>
  // Key: 'journal_YYYY-MM-DD'

getJournalEntry(date: string): Promise<string | null>
  // Retrieve entry for specific date

getAllJournalEntries(): Promise<Array<{ date: string, entry: string }>>
  // Get all entries, sorted newest first
```

**Component (`components/DailyJournal.tsx`):**
- Collapsible section (starts collapsed)
- Yellow header bar acts as toggle button
- Pencil icon + "Today's Journal" text + ChevronDown/Up
- When expanded:
  - Multiline TextInput (min 4 lines)
  - Placeholder: "How was your day? What did you accomplish? How do you feel?"
  - Save button (only visible when text changed)
- On save: show "Saved ✓" for 2 seconds
- Smooth height animation (0 → 300px, 300ms)

**Integration (`app/(tabs)/index.tsx`):**
- Place BELOW ScoreDisplay, ABOVE DominoTiles
- Pass `currentDate` prop
- Load existing entry on mount/date change

**Data Flow:**
```
User opens daily tracker
    ↓
Load journal entry for currentDate
    ↓
User taps to expand journal
    ↓
User types
    ↓
Save button appears
    ↓
User taps Save
    ↓
StorageService.saveJournalEntry()
    ↓
Show "Saved ✓" confirmation
```

---

#### 3. Mood Check-In (Morning & Evening)
**Prompts: 17A, 17B, 17C**

**Purpose:** Track emotional state twice daily with emoji selector.

**Implementation Details:**

**Mood Scale:**
- 1: 😞
- 2: 😐
- 3: 😊
- 4: 😁
- 5: 🔥

**Storage (`utils/storage.ts`):**
```typescript
saveMood(date: string, period: 'morning' | 'evening', mood: number): Promise<void>
  // Key: 'mood_YYYY-MM-DD_morning' or 'mood_YYYY-MM-DD_evening'

getMood(date: string, period: 'morning' | 'evening'): Promise<number | null>
  // Retrieve mood for specific date/period

getWeekMoods(startDate: string): Promise<Array<{ 
  date: string, 
  morning: number | null, 
  evening: number | null 
}>>
  // Get 7 days of mood data for weekly chart
```

**Component (`components/MoodCheckIn.tsx`):**
- Props: `currentDate`, `period` ('morning'|'evening'), `onSave`, `savedMood`
- Card with title: "Morning Check-In" or "Evening Check-In"
- Subtitle: "How are you starting today?" or "How did today end?"
- 5 emoji buttons in a row (40x40 circles)
- Selected emoji: yellow background, border, scale 1.1
- On selection: pulse animation (1 → 1.2 → 1), call onSave
- If savedMood exists: show selected, display "Saved ✓"

**Integration (`app/(tabs)/index.tsx`):**
- Place BELOW DailyJournal, ABOVE DominoTiles
- Logic for which check-in to show:
  ```
  If time < 12:00 noon → Show Morning Check-In only
  If time >= 12:00 noon:
    - If morning not saved → Show Morning + Evening (stacked)
    - If morning saved → Show Evening only
  ```
- State: `morningMood`, `eveningMood`
- Load on mount/date change
- Save handler calls StorageService.saveMood()

**Time Logic:**
```javascript
const now = new Date();
const currentHour = now.getHours();
const isMorning = currentHour < 12;
```

---

#### 4. Weekly Mood Trend Chart
**Prompts: 18A, 18B**

**Purpose:** Visualize emotional patterns across the week.

**Implementation Details:**

**Component (`components/MoodTrendChart.tsx`):**
- Props: `data` array of 7 days with morning/evening moods
- Card with title: "Mood This Week"
- Legend: Yellow dot + "Morning", Black dot + "Evening"
- SVG line chart:
  - Width: full card width minus padding
  - Height: 140px
  - Y-axis: 1-5 (mood scale)
  - X-axis: 7 days (Mon-Sun labels)
- Morning line: yellow (#fedd14), stroke width 3
- Evening line: black (#000000), stroke width 3
- Dots at each point: circles radius 5
  - Morning: yellow fill, black border
  - Evening: black fill
- Skip null values (don't draw dot, gap in line)
- Placeholder if no data: "Start checking in to see your mood trend"

**Chart Calculation:**
```javascript
// Map mood 1-5 to pixel Y position (inverted: 5 = top)
const yPosition = chartHeight - ((mood - 1) / 4) * chartHeight;

// X positions evenly spaced
const xPosition = (index / 6) * chartWidth;
```

**Integration (`app/(tabs)/weekly.tsx`):**
- Place BELOW Daily Breakdown Heatmap, ABOVE Domino Performance List
- On mount: call `StorageService.getWeekMoods(mondayDate)`
- Format data with day labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
- Pass to MoodTrendChart component

**Data Structure:**
```typescript
[
  { date: "2025-11-24", morning: 4, evening: 3, dayLabel: "Mon" },
  { date: "2025-11-25", morning: 5, evening: 4, dayLabel: "Tue" },
  { date: "2025-11-26", morning: null, evening: 2, dayLabel: "Wed" },
  // ... 4 more days
]
```

---

## 🎨 Design System

### Brand Colors
```css
Primary Yellow:    #fedd14  /* Buttons, active states, highlights */
Black:             #000000  /* Text, borders, icons */
Cream Background:  #fffbea  /* Main background, cards */
White:             #ffffff  /* Card backgrounds, overlays */
```

### Status Colors
```css
Perfect (100%):    #10b981  /* Green - all dominos complete */
Good (75-99%):     #fedd14  /* Yellow - strong performance */
Okay (50-74%):     #f59e0b  /* Orange - halfway there */
Poor (<50%):       #ef4444  /* Red - needs attention */
Gray (inactive):   #6b7280  /* Disabled states, secondary text */
```

### Typography Scale
```css
/* Headers */
h1: fontSize 32, fontWeight 800, letterSpacing -0.5
h2: fontSize 28, fontWeight 800, letterSpacing -0.5
h3: fontSize 20, fontWeight 800, letterSpacing 0.3

/* Body */
body-large:  fontSize 18, fontWeight 600
body-medium: fontSize 16, fontWeight 500-600
body-small:  fontSize 14, fontWeight 500

/* Labels */
label-large:  fontSize 14, fontWeight 700, uppercase, letterSpacing 1
label-medium: fontSize 12, fontWeight 700
label-small:  fontSize 11, fontWeight 600
```

### Spacing System
```css
/* Margins */
screen-margin: 16-20px
card-padding: 16-24px (larger for important cards)

/* Gaps */
item-gap: 8-12px
section-gap: 12-16px
bottom-spacer: 40px (scrollable screens)
```

### Shadow Hierarchy
```javascript
// Small (buttons, small cards)
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 4
elevation: 3

// Medium (standard cards)
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.15
shadowRadius: 8
elevation: 5

// Large (hero cards like score display)
shadowOffset: { width: 0, height: 6 }
shadowOpacity: 0.2
shadowRadius: 12
elevation: 8
```

### Border Radius
```css
buttons: 16
cards: 20
small-elements (badges, icons): 12
```

### Animation Timing
```javascript
// Micro-interactions (button press)
duration: 150-200ms
easing: Easing.out(Easing.ease)

// Standard animations (expand/collapse)
duration: 300ms
easing: Easing.bezier(0.4, 0, 0.2, 1)

// Spring animations (domino fall, scale effects)
tension: 100
friction: 7-8
```

---

## 💾 Data Model & Storage

### Storage Architecture
**No backend.** All data stored locally using **AsyncStorage** (key-value store).

### Key Naming Convention
```
Format: [type]_[identifier]_[optional_modifier]

Examples:
- dominos                    → Array of domino configurations
- completions_2025-11-29     → Daily completion data
- journal_2025-11-29         → Journal entry for specific date
- mood_2025-11-29_morning    → Morning mood for specific date
- mood_2025-11-29_evening    → Evening mood for specific date
- setup_completed            → Boolean flag (onboarding done)
```

### Data Structures

#### Domino Configuration
```typescript
interface Domino {
  id: string;              // 'body', 'health', 'happiness', etc.
  title: string;           // 'Body', 'Health', 'Happiness', etc.
  activities: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

// Stored as: 'dominos' → JSON.stringify(Domino[])
```

#### Daily Completions
```typescript
interface DayCompletions {
  [dominoId: string]: boolean;  // e.g., { body: true, health: false, ... }
}

// Stored as: 'completions_YYYY-MM-DD' → JSON.stringify(DayCompletions)
```

#### Journal Entry
```typescript
// Stored as: 'journal_YYYY-MM-DD' → string (plain text)
```

#### Mood Entry
```typescript
// Stored as: 'mood_YYYY-MM-DD_morning' → '1' to '5' (number as string)
// Stored as: 'mood_YYYY-MM-DD_evening' → '1' to '5' (number as string)
```

### StorageService API (`utils/storage.ts`)

#### Domino Operations
```typescript
saveDominos(dominos: Domino[]): Promise<void>
loadDominos(): Promise<Domino[] | null>
createDefaultDominos(): Domino[]  // Factory method
```

#### Completion Operations
```typescript
saveCompletions(date: string, completions: Record<string, boolean>): Promise<void>
getCompletions(date: string): Promise<Record<string, boolean> | null>
```

#### Setup Flag
```typescript
setSetupCompleted(completed: boolean): Promise<void>
isSetupCompleted(): Promise<boolean>
```

#### Journal Operations (Phase 3)
```typescript
saveJournalEntry(date: string, entry: string): Promise<void>
getJournalEntry(date: string): Promise<string | null>
getAllJournalEntries(): Promise<Array<{ date: string, entry: string }>>
```

#### Mood Operations (Phase 3)
```typescript
saveMood(date: string, period: 'morning' | 'evening', mood: number): Promise<void>
getMood(date: string, period: 'morning' | 'evening'): Promise<number | null>
getWeekMoods(startDate: string): Promise<Array<{ 
  date: string, 
  morning: number | null, 
  evening: number | null 
}>>
```

### Data Flow Examples

#### Daily Tracker Load
```
User opens daily tracker
    ↓
Get currentDate (YYYY-MM-DD)
    ↓
StorageService.loadDominos()
    ↓
StorageService.getCompletions(currentDate)
    ↓
Render DominoTiles with completion state
```

#### Toggling a Domino
```
User taps DominoTile
    ↓
Update local state (completions[dominoId] = !completions[dominoId])
    ↓
Trigger animation (fall or reset)
    ↓
Play sound/haptic
    ↓
StorageService.saveCompletions(currentDate, completions)
    ↓
Check if dailyScore === 8
    ↓
If YES: trigger confetti + perfect sound
```

#### Weekly Overview Load
```
User navigates to Weekly tab
    ↓
Calculate Monday of current week
    ↓
Loop through 7 days (Mon-Sun)
    ↓
For each day: StorageService.getCompletions(date)
    ↓
Calculate stats: totalCompleted, totalPossible, per-domino scores
    ↓
Render heatmap, performance list, motivation message
```

---

## 🧩 Component Hierarchy

### Daily Tracker Screen (`app/(tabs)/index.tsx`)
```
SafeAreaView
└── ScrollView
    ├── DayNavigator (date navigation, "Jump to Today")
    ├── ScoreDisplay (circular progress rings)
    ├── [DailyJournal] ← Phase 3 (collapsible)
    ├── [MoodCheckIn (morning)] ← Phase 3
    ├── [MoodCheckIn (evening)] ← Phase 3 (conditional)
    ├── DominoTile (Body)
    ├── DominoTile (Health)
    ├── DominoTile (Happiness)
    ├── DominoTile (Love)
    ├── DominoTile (Work)
    ├── DominoTile (Wealth)
    ├── DominoTile (Spirituality)
    ├── DominoTile (Soul)
    └── ConfettiCelebration (overlay, z-index 9999)
```

### Weekly Overview Screen (`app/(tabs)/weekly.tsx`)
```
ScrollView
├── Header (title + week range badge)
├── ScoreDisplay (daily + weekly scores)
├── Performance Summary Card
│   ├── Weekly percentage (48, fontWeight 800)
│   ├── Trend icon (TrendingUp/Minus/TrendingDown)
│   └── Stats grid (Completed, Missed, Perfect Days)
├── Daily Breakdown Heatmap
│   └── 7 vertical bars (color-coded by score)
├── [MoodTrendChart] ← Phase 3
├── Domino Performance List
│   ├── Domino item x8 (sorted by percentage)
│   │   ├── Number badge
│   │   ├── Title
│   │   ├── Score (X/7)
│   │   ├── Progress bar
│   │   └── [Expandable] Weekly dots (7 circles)
│   └── Best/Worst badges
└── Motivational Footer Card
```

### Settings Screen (`app/(tabs)/settings.tsx`)
```
ScrollView
├── Header (icon + title)
├── Preferences Section
│   ├── Sound Effects toggle
│   └── Daily Reminders toggle (placeholder)
├── Data Management Section
│   ├── Reset Week button (orange warning)
│   └── Delete All Data button (red danger)
├── About Section
│   ├── Philosophy info card (yellow)
│   └── Version card (white)
└── Stats Section ("Your Journey")
    ├── Total Dominos stat card
    ├── Current Streak stat card
    ├── Perfect Days stat card
    └── Best Week stat card
```

### Onboarding Flow (`components/OnboardingScreen.tsx`)
```
SafeAreaView
├── Header (step indicator, title, subtitle)
├── Content Area (changes per step)
│   ├── Step 1: Welcome Screen
│   │   ├── 8 mini domino tiles (rotated 15°)
│   │   ├── Description text
│   │   └── "Next: Set up your daily activities →" hint
│   └── Step 2: Setup Screen
│       └── DominoSetupForm
│           ├── Day tabs (Mon-Sun)
│           └── 8 activity input fields
└── Footer (button)
    ├── Step 1: "Get Started" button
    └── Step 2: "Complete Setup" button
```

---

## 🔧 Development Setup

### Prerequisites
```bash
Node.js 18+
npm or yarn
Expo CLI: npm install -g expo-cli
Expo Go app on iOS/Android device
```

### Installation
```bash
# Clone repository
git clone [repo-url]
cd 8-dominos

# Install dependencies
npm install

# Start development server
npx expo start

# Or with cache clear
npx expo start --clear
```

### Running on Device
```bash
# iOS
Press 'i' in terminal (requires Xcode)
Or scan QR code with Camera app → Opens in Expo Go

# Android
Press 'a' in terminal (requires Android Studio)
Or scan QR code with Expo Go app
```

### Testing Workflow
```bash
# Test on physical device (recommended)
npx expo start
Scan QR code with Expo Go

# Test specific features
1. Complete onboarding (first launch only)
2. Toggle dominos → Check animation, sound, haptic
3. Complete all 8 → Verify confetti triggers
4. Navigate days → Check date display
5. View weekly overview → Verify stats calculate correctly
6. Change settings → Toggle sound on/off
```

### Common Commands
```bash
# Clear cache and restart
npx expo start --clear

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Check for issues
npx expo doctor

# Update dependencies
npx expo install --fix
```

---

## 🚨 Known Constraints & Decisions

### Technical Constraints
1. **No Backend:** All data stored locally. Data does not sync across devices.
2. **No User Accounts:** Single-user experience per device.
3. **No Cloud Backup:** If user deletes app, all data is lost.
4. **AsyncStorage Limits:** ~6MB practical limit (far more than needed for this use case).
5. **Sound URLs:** Using external CDN (Mixkit). May fail if user is offline or CDN is down.
6. **Haptics:** Only work on physical devices, not simulators.

### Design Decisions
1. **Car Analogy Skipped:** Original spec had car metaphors for each domino. Decided to keep pure domino theme for simplicity.
2.
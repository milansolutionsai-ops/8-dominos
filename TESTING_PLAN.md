# 8 Dominos - V1 Testing Plan

## 1. Setup & Launch

### Starting the Development Server
```bash
# Navigate to project directory
cd "c:\Users\Milan\Desktop\8 Dominos"

# Start Expo development server (PowerShell)
npx expo start

# Alternative (Command Prompt - RECOMMENDED to avoid PS errors)
npm start

# For tunnel mode (if testing on physical device not on same network)
npx expo start --tunnel
```

### 💡 Pro Tip for Windows
If PowerShell keeps giving you "Execution Policy" or "Security" errors, switch your terminal to **Command Prompt (CMD)**. CMD does not have these restrictions, and `npm start` will work there immediately without any extra setup.

### 🌍 Remote Testing (Sharing with others)
If you need to share the app with someone in a different location:
1. Run: `npm run dev -- --tunnel`
2. Expo will generate a unique URL (e.g., `exp://u.expo.dev/...`).
3. **Important for iOS:** The remote user must have the **Expo Go** app and be logged into the **same Expo account** as you (or you can invite them to your Expo project/team if you have an organization setup).
4. They can then manually enter the URL in Expo Go or scan a QR code you send them.

### Testing Platforms
- [ ] **iOS** (via Expo Go or development build)
- [ ] **Android** (via Expo Go or development build)
- [ ] **Web** (optional, for quick UI checks)

---

## 2. First-Time User Experience

### Onboarding Flow
- [ ] App launches to onboarding screen
- [ ] DominoIllustration displays correctly (8 dominos, 1-8 dots)
- [ ] "Next: Set up your daily activities →" hint is visible and subtle
- [ ] Tapping "Next" advances to activity setup
- [ ] Can set custom activities for each of 8 dominos
- [ ] Can set different activities per day of week
- [ ] "Save & Start" button works and navigates to Daily screen

---

## 3. Daily Screen - Core Functionality

### DominoTile Component (NEW DESIGN)
- [ ] **Layout**: Pillar name is small uppercase label at top
- [ ] **Layout**: Activity text is large, bold, and primary
- [ ] **Layout**: No 8-dot grid visible (removed)
- [ ] **Completion Color**: Tile turns softer yellow (`#f5d80a`) when completed
- [ ] **Text Readability**: Activity text remains clearly visible on yellow background
- [ ] **Animation**: Tapping tile triggers subtle "pop" (scale down/up)
- [ ] **Animation**: Scale animation does NOT overlap adjacent tiles
- [ ] **Haptics**: Toggle ON produces distinct "success" double-pulse
- [ ] **Haptics**: Toggle OFF produces light single tap
- [ ] **Sound**: Completion sound plays on toggle ON
- [ ] **Sound**: Different sound plays on toggle OFF

### Score Display
- [ ] Shows correct daily score (X/8)
- [ ] Circular progress ring updates correctly
- [ ] Score number animates with scale-pop when changed
- [ ] Motivational message updates based on score
- [ ] "Perfect Day" message shows at 8/8

### Perfect Day Celebration
- [ ] Confetti animation triggers at 8/8 completion
- [ ] Celebration sound (`success.mp3`) plays
- [ ] Success haptic feedback fires
- [ ] Confetti stops after ~3 seconds

### Mood Check-In
- [ ] Morning mood check-in appears before noon
- [ ] Evening mood check-in appears after noon
- [ ] Tapping mood emoji saves selection
- [ ] Subtle chime sound plays on mood selection
- [ ] Selected mood shows checkmark
- [ ] Mood persists after app restart

### Daily Journal
- [ ] Can add journal entry for current day
- [ ] Text persists after saving
- [ ] Can edit existing entry

### Day Navigator
- [ ] Can navigate to previous days
- [ ] Can navigate to future days
- [ ] Selected date displays correctly
- [ ] Domino completion states load correctly for past dates

---

## 4. Weekly Screen

### Weekly Overview
- [ ] Shows 7-day grid for current week
- [ ] Each day shows completion count (X/8)
- [ ] Can tap individual days to see details
- [ ] Weekly score displays correctly
- [ ] Streak counter shows accurate count

### Mood Trend Chart
- [ ] Morning mood trend line displays
- [ ] Evening mood trend line displays
- [ ] Chart scrolls horizontally for past weeks
- [ ] Data points are accurate

---

## 5. Settings Screen

### Domino Management
- [ ] Can edit existing domino activities
- [ ] Can set different activities per weekday
- [ ] Changes save and reflect immediately on Daily screen
- [ ] Can delete custom activities

### Data Management
- [ ] "Reset All Data" button shows confirmation dialog
- [ ] Confirming reset clears all data
- [ ] After reset, app returns to onboarding

### Sound Settings
- [ ] Sound toggle works
- [ ] Sounds respect toggle state
- [ ] Setting persists after app restart

---

## 6. Data Persistence

### After App Restart
- [ ] Domino activities persist
- [ ] Completion states persist
- [ ] Mood check-ins persist
- [ ] Journal entries persist
- [ ] Settings persist
- [ ] Current streak persists

---

## 7. Edge Cases & Error Handling

### Boundary Conditions
- [ ] App handles first day of week correctly
- [ ] App handles last day of week correctly
- [ ] App handles month transitions
- [ ] App handles year transitions
- [ ] App handles empty activity strings gracefully

### Performance
- [ ] Animations are smooth (60fps)
- [ ] No lag when toggling dominos rapidly
- [ ] ScrollView scrolls smoothly
- [ ] No memory leaks after extended use

---

## 8. UI/UX Polish

### Visual Consistency
- [ ] All screens use consistent color palette
- [ ] Typography is consistent and readable
- [ ] Spacing and padding feel balanced
- [ ] Shadows and elevations are subtle and consistent

### Accessibility
- [ ] Text is readable at default system font size
- [ ] Touch targets are large enough (minimum 44x44pt)
- [ ] Color contrast meets WCAG AA standards

### Sound & Haptics
- [ ] All sounds play in silent mode (iOS)
- [ ] Haptics feel distinct and appropriate
- [ ] No sound/haptic errors in console

---

## 9. Final Acceptance Criteria

### Must-Have (V1 Release Blockers)
- [ ] All 8 dominos can be toggled
- [ ] Completion states save and persist
- [ ] Confetti triggers at 8/8
- [ ] Onboarding flow completes successfully
- [ ] No critical crashes or data loss

### Nice-to-Have (Can defer to V1.1)
- [ ] Widgets
- [ ] Push notifications
- [ ] Radar chart analytics
- [ ] Streak recovery/rest days

---

## 10. Sign-Off

Once all items above are checked:
- [ ] **Developer Sign-Off**: All tests passed
- [ ] **User Acceptance**: App feels polished and ready
- [ ] **Ready for Production**: Build and deploy

---

**Testing Notes:**
- Test on both iOS and Android if possible
- Test with sound ON and OFF
- Test with haptics enabled and disabled
- Test in both light and dark mode (if supported)
- Test with different system font sizes

**Estimated Testing Time:** 30-45 minutes for full checklist

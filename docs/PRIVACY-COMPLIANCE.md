# Privacy compliance — read before shipping any release that collects data

**Current state (v1.0): the app collects nothing.** No accounts, no server, no analytics,
no third-party SDKs that phone home. Everything lives in AsyncStorage on the device.
Local notifications only. The "Share my day/week" image is generated on-device and only
leaves it if the user hands it to the share sheet themselves.

That is a genuinely clean position with Apple, and it is claimed in **three places that
must always agree**. The moment one of them drifts, the app is in violation.

---

## The three places the privacy claim lives

| # | Where | What it says now | Owner |
|---|---|---|---|
| 1 | **App Store Connect → App Privacy** | "Data Not Collected" | whoever submits |
| 2 | **8dominos.com/privacy** | "does not collect your data… stays on your phone" | Hass's web dev |
| 3 | **In-app Settings → About** (`app/(tabs)/settings.tsx`) | philosophy copy + link to the policy | this repo |

**Apple cross-checks 1 against 2.** A mismatch is a Guideline 5.1.1 rejection, and for an
app already live it can mean removal. This is one of the most common rejection causes.

---

## The rule that matters

> The privacy labels and the privacy policy must be updated **in the same release** that
> starts collecting data — not after, not "in the next one".

Labels are **per-version and editable at any time**, so there is no lock-in from shipping
v1 as "Data Not Collected". The designed flow is: you change the declaration when you
submit the version whose behaviour changed. Just never ship the collection ahead of the
declaration.

---

## What Batch 1 (backend + accounts + coach dashboard) will trigger

When the storage layer moves off-device, expect to declare at minimum:

- **Contact Info → Email Address** — if accounts use email
- **Identifiers → User ID** — the account identifier
- **User Content** — habits, journal entries, mood check-ins once they hit a server
- Mark these **"Linked to the user"** (they're tied to an account by definition)
- **Purpose: App Functionality.** Not advertising, not analytics.

Two judgement calls to make deliberately, not by accident:

1. **Health & Fitness.** Mood check-ins and body/health habits can read as health data.
   Decide consciously whether to declare it, and lean toward declaring if unsure.
2. **HealthKit.** If the app ever reads or writes Apple Health, extra rules apply — HealthKit
   data may never be used for advertising or sold, and the privacy policy must address it
   specifically. Don't wire HealthKit in casually.

### Keep the app out of "Tracking"

"Collecting" data is normal and easy to declare. **"Tracking"** — sharing data with third
parties for advertising or data brokerage, or combining it with third-party data for ad
targeting — triggers the App Tracking Transparency permission prompt and a pile of extra
obligations.

As long as no advertising or attribution SDK is ever added, the app never has to ask for
tracking permission. That is worth protecting: it keeps the privacy section trivial and
keeps the store listing free of a "Data Used to Track You" section.

---

## Hard requirements that arrive with accounts

These are easy to forget and are hard blockers at review:

- **In-app account deletion.** Any app that lets a user *create* an account must let them
  *delete* it from inside the app — not merely delete local data, and not "email us".
  Budget for this in the Batch 1 spec, not as an afterthought.
- **Sign in with Apple.** If third-party login (Google, Facebook, etc.) is offered, Apple
  generally requires Sign in with Apple as an equivalent option. Plain email/password-only
  auth carries no such requirement. Choosing email-only keeps Batch 1 smaller.
- **Data in transit.** TLS everywhere, obviously — but also note that adding real crypto
  beyond standard HTTPS would invalidate the current export-compliance declaration
  (`ios.config.usesNonExemptEncryption: false` in `app.json`). Standard HTTPS stays exempt.

---

## Why the swap is cheap on our side

The architecture was built for this from the start:

- All persistence goes through **`utils/storage.ts` (`StorageService`)** and the
  **`hooks/useDominos.ts`** hook. Components never touch storage directly, so the backend
  swap happens behind that boundary without rewriting UI.
- **`types/domino.ts`** is the single source of truth for the data model.
- Nothing in the UI assumes single-user; there's simply no account concept yet to remove.

So Batch 1 is additive — a backend, auth, and a dashboard — not a rebuild. The compliance
work is the part that needs a checklist, which is what this file is.

---

## Checklist for the release that first collects data

- [ ] Update **App Store Connect → App Privacy** with every category collected
- [ ] Update **8dominos.com/privacy** to match exactly (categories, purpose, retention, deletion)
- [ ] Update **Settings → About** copy in-app if it still implies nothing leaves the device
- [ ] Ship **in-app account deletion**
- [ ] Confirm no ad/attribution SDK crept in (keeps the app out of ATT)
- [ ] Decide and document the **Health & Fitness** declaration
- [ ] Re-read the three-places table above and confirm all three agree

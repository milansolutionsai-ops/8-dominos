# Game of Life — Product White Paper

> Source: Hass. Original spec (the long-term product vision / ceiling). This is NOT the Batch 0 scope. See DESIGN.md and docs/BUILD_PLAN.md for what we are actually building now.

---

GAME OF LIFE
App Development White Paper
The 8 Dominoes of Life — A Gamified Lifestyle Transformation PlatformConfidential — For Developer Use Only

1. EXECUTIVE SUMMARY
Game of Life is a two-sided mobile and web platform built around a proprietary coaching framework: the 8 Dominoes of Life. The system transforms personal development into an immersive, gamified experience — helping clients redesign their lifestyle across eight core pillars while giving coaches unprecedented visibility and control over client progress.
This white paper serves as the complete product specification and build directive for the development team. It covers platform architecture, user flows, gamification mechanics, onboarding logic, the Domino framework, and the task bank system.

Core Value Proposition
Clients experience personal growth as a game — earning points, unlocking levels, and competing on leaderboards.
Coaches manage, motivate, and monitor every client from a powerful web dashboard.
The system auto-assigns personalised habit tasks based on each client's survey results, or allows manual selection.
Every habit tracked maps back to one of the 8 Dominoes — creating a holistic, data-rich picture of each client's life.

2. PLATFORM ARCHITECTURE
Game of Life is a two-sided platform consisting of:
2.1  Client-Facing Mobile App (iOS & Android)
Primary interface for clients to track habits, earn points, view progress, and engage with gamification features.
Built with cross-platform mobile framework (React Native recommended for shared codebase).
Push notification support for daily reminders, challenges, and rewards.
Offline-capable for habit check-ins; syncs when connection is restored.
2.2  Coach / Admin Web Dashboard
Full-featured web application accessible from any browser.
Coach can view all clients, their progress, point totals, streaks, and domino completion status.
Coach can assign, modify, or override habit tasks for any client.
Coach can send push notifications, motivational messages, and custom challenges directly to clients.
Analytics layer: aggregate data across all clients to identify patterns and coaching opportunities.
2.3  Backend & Data Layer
Cloud-based backend (Node.js / Firebase or Supabase recommended).
Real-time database syncing between coach dashboard and client app.
Secure user authentication with role-based access (Coach vs. Client).
Data collection engine that logs all habit completions, timestamps, streaks, and point transactions.
API-ready architecture to allow future integrations (wearables, health apps, payment systems).

3. THE 8 DOMINOES OF LIFE — FRAMEWORK OVERVIEW
The 8 Dominoes of Life is the philosophical and structural backbone of the entire platform. Each Domino represents a pillar of holistic human performance. Clients progress through all eight simultaneously, though the system visually represents them as dominoes — implying that momentum in one area creates a chain reaction across all others.
Each Domino has its own task bank of at least 20 curated activities. Tasks are assigned automatically based on survey results, presented as selectable options, or entered manually by the client or coach.

Domino 01 — BODY: What you do with your body
The Body domino tracks all physical movement and physical self-investment. It measures what a client is actively doing to use, strengthen, and care for their physical body. This includes structured exercise, restorative movement, and physical treatments.
Task Bank (20 Curated Options):
01. Morning run (specify distance goal)
02. Evening walk (30+ minutes)
03. Gym session — strength training
04. Gym session — cardio focus
05. HIIT workout
06. Yoga session
07. Stretching / mobility routine (15–30 min)
08. Swimming laps
09. Cycling (outdoor or stationary)
10. Sports activity (tennis, basketball, football, etc.)
11. Pilates class
12. Martial arts / boxing session
13. Rock climbing / bouldering
14. Get a professional massage
15. Cold shower / ice bath recovery
16. Foam rolling / myofascial release
17. Dance class or session
18. Jump rope — 10 to 20 minutes
19. Hiking (outdoor nature walk)
20. Active rest — gentle movement on recovery day

Domino 02 — HEALTH: What you put inside your body
The Health domino focuses entirely on nutrition, hydration, and internal wellness. It tracks what the client consumes — ensuring that what goes into the body supports their goals, energy levels, and long-term vitality.
Task Bank (20 Curated Options):
01. Drink 2–3 litres of water (daily target)
02. Fresh juice — cold pressed, no added sugar
03. Eat a serving of fresh fruit
04. Eat a serving of leafy greens / salad
05. High-protein meal (chicken, fish, eggs, legumes)
06. Healthy complex carbs (sweet potato, brown rice, oats)
07. Take daily vitamins / supplements
08. Eat a whole food breakfast (no processed food)
09. Intermittent fasting protocol (client-defined window)
10. Avoid alcohol for the day
11. Avoid refined sugar for the day
12. Eat within a calorie target (client-defined)
13. Prepare a home-cooked meal (no takeaway)
14. Drink herbal tea / anti-inflammatory drink
15. Consume omega-3s (fish, flaxseed, walnuts)
16. Probiotic intake (yogurt, kefir, supplements)
17. Alcohol-free day
18. No caffeine after 2pm
19. Track macros for the day
20. Eat mindfully — no screens during meals

Domino 03 — HAPPINESS: What you do for yourself
The Happiness domino is dedicated to self-care and personal joy. It captures the activities that recharge the client emotionally and mentally — things done purely for personal pleasure, restoration, and self-expression. A man who invests in his own happiness performs better in every other domain.
Task Bank (20 Curated Options):
01. Play a round of golf
02. Play video games (scheduled leisure time)
03. Watch a favourite movie or show
04. Get a manicure / pedicure
05. Visit a spa or sauna
06. Read a book for pleasure (non-work)
07. Cook a meal you enjoy
08. Listen to a full album from start to finish
09. Spend time in nature (park, beach, forest)
10. Visit a museum, gallery, or cultural event
11. Attend a comedy show or live performance
12. Take a long bath or shower ritual
13. Go shopping for yourself (self-investment)
14. Plan and take a day trip
15. Try a new restaurant or cuisine
16. Engage in a creative hobby (art, music, writing)
17. Do absolutely nothing for 30 minutes (deliberate rest)
18. Watch a sunrise or sunset
19. Play a sport purely for fun
20. Schedule and protect personal alone time

Domino 04 — LOVE: How you invest in your relationships
The Love domino tracks relationship investment — the intentional time, energy, and communication a client puts into the people who matter most. Strong relationships are a core performance multiplier. This domino ensures clients do not let life erode their most important connections.
Task Bank (20 Curated Options):
01. Call or FaceTime a parent
02. Text a meaningful message to a family member
03. Schedule and go on a date night with partner
04. One-on-one quality time with your child(ren)
05. Family dinner — everyone present, no phones
06. Reach out to a close friend you haven't spoken to recently
07. Write a heartfelt message to someone you appreciate
08. Plan a weekend activity with the family
09. Attend a child's school event or sporting activity
10. Have a meaningful conversation with your partner (no phones)
11. Surprise your partner with a thoughtful gesture
12. Call your sibling(s)
13. Organise a friend catch-up (in person)
14. Write a thank-you note to someone who has helped you
15. Spend time with grandparents or elder family
16. Resolve an outstanding conflict or tension with someone
17. Plan a group outing with close friends
18. Do something special for a friend with no expectation of return
19. Have a family meeting or check-in
20. Celebrate a milestone or achievement with someone you love

Domino 05 — WORK: Purposeful work that creates impact
The Work domino is not just about being busy — it is about purposeful, meaningful work that builds something, impacts someone, or moves the client closer to their professional vision. This domino tracks high-value work activities and entrepreneurial or career development actions.
Task Bank (20 Curated Options):
01. Record and publish a piece of content (video, podcast, post)
02. Cold call or outreach to 10+ prospects
03. Complete a key business task from your priority list
04. Have a strategy or planning session (90 minutes, no distractions)
05. Create or refine a product / service offering
06. Design or update a marketing asset
07. Write a business proposal or pitch deck
08. Attend or host a networking event
09. Follow up with clients or leads
10. Complete an online course module or professional development
11. Build or update your website / social media presence
12. Analyse your business metrics / KPIs
13. Delegate tasks and follow up with your team
14. Hold a team meeting with clear agenda and outcomes
15. Read an industry publication or business book (30 min)
16. Do deep work — 2+ hours on your most important project
17. Respond to all high-priority emails / messages
18. Set your top 3 priorities for tomorrow
19. Work on your personal brand (content, bio, positioning)
20. Identify and solve one problem in your business today

Domino 06 — WEALTH: How you build generational wealth
The Wealth domino focuses on financial growth, investment, and generational legacy. This is the domain the system pushes hardest — because true wealth is not just earned income but assets that grow and outlast the individual. The system tracks what clients are actively doing to build financial freedom and leave a legacy.
Task Bank (20 Curated Options):
01. Research and analyse a real estate investment opportunity
02. Make a scheduled contribution to your investment portfolio
03. Invest in Bitcoin or cryptocurrency (defined amount)
04. Review and update your monthly budget
05. Study a new investment strategy or asset class
06. Consult with your financial advisor or accountant
07. Open or contribute to a savings / wealth account
08. Research and apply for a business loan or credit facility
09. Identify a new income stream and take one action toward it
10. Review your net worth tracker
11. Invest in stock market (ETFs, index funds, individual stocks)
12. Read a chapter of a wealth or investing book
13. Set up or review your estate plan / will
14. Research a passive income opportunity
15. Analyse the ROI on a current investment
16. Contribute to your children's education fund
17. Invest in gold, silver, or commodities
18. Attend a financial literacy or investment seminar / webinar
19. Review and reduce an unnecessary monthly expense
20. Take one tangible action on a real estate deal or acquisition

Domino 07 — SPIRITUALITY: How you connect with something greater
The Spirituality domino tracks the client's investment in their inner world — practices that cultivate peace, clarity, presence, and connection to a higher power or universal energy. This is the domino that grounds all other performance.
Task Bank (20 Curated Options):
01. Morning meditation (10–30 minutes)
02. Evening reflection / journaling session
03. Pray (morning, evening, or both)
04. Listen to a healing or Solfeggio frequency session
05. Read a spiritual or religious text (10–30 minutes)
06. Practice gratitude — write 3 to 5 things you are grateful for
07. Breathwork session (Wim Hof, box breathing, 4-7-8)
08. Spend time in complete silence for 20+ minutes
09. Attend a religious service or place of worship
10. Listen to a spiritual podcast or sermon
11. Practice mindfulness — be fully present for 30 minutes
12. Do a digital detox for a defined window of time
13. Write a letter to your future self
14. Practice visualisation of your ideal life (15 minutes)
15. Spend time in nature with full sensory awareness
16. Recite affirmations — written or spoken
17. Attend a guided meditation or sound bath session
18. Fast intentionally (spiritual fast)
19. Study a philosophy, teaching, or wisdom tradition
20. Sit with a feeling or emotion without distraction — emotional processing

Domino 08 — SOUL: How you invest in the afterlife and your legacy
The Soul domino is the most elevated pillar — it asks: what are you doing today that will outlast you? This domino tracks acts of generosity, service, kindness, and devotion that connect the client to their deepest values and their relationship with God or the universe. It is the domino that defines character.
Task Bank (20 Curated Options):
01. Give to a charity or cause you believe in
02. Perform a random act of kindness for a stranger
03. Volunteer time to a community or non-profit organisation
04. Pray for others — friends, family, community, or the world
05. Donate clothes, food, or goods to those in need
06. Mentor or advise someone who is coming up
07. Spend time with the elderly or visit someone who is unwell
08. Write in your legacy journal — what do you want to be remembered for?
09. Plant a tree or contribute to an environmental initiative
10. Support a local business or individual in need
11. Pay for someone's meal or coffee anonymously
12. Sponsor a child or family in need (monthly commitment)
13. Share knowledge — teach something valuable to someone for free
14. Forgive someone — write it out or communicate it
15. Spend time in prayer or reflection on your purpose
16. Create something that will outlast you (book, art, business, legacy)
17. Build or contribute to a community initiative
18. Make a commitment to a cause larger than yourself
19. Express gratitude to God / the universe in a dedicated ritual
20. Do one thing today purely for others — nothing in return


4. PRE-ONBOARDING SURVEY & CLIENT ASSESSMENT
Before a client is onboarded into the Game of Life app, they must complete a Lifestyle & Goals Assessment. This survey captures where the client is today vs. where they want to be — and drives the automated task assignment engine. No two clients get the same starting setup.
4.1  Survey Purpose
Identify the client's current lifestyle baseline across all 8 Dominoes.
Capture their goals and desired outcomes in each pillar.
Determine which tasks are relevant, feasible, and motivating for their specific situation.
Feed the data into the task recommendation engine to generate a personalised week plan.
4.2  Survey Structure
The survey is divided into two parts:
Part A — Current State Assessment
For each of the 8 Dominoes, the client rates their current satisfaction and consistency on a scale of 1–10, and answers short qualitative questions such as:
"How would you rate your current physical activity level?" (1–10)
"How consistently do you invest in your relationships?" (1–10)
"Are you actively investing your money? If yes, where?"
"What does your spiritual practice look like today?"
Part B — Desired State & Goals
For each Domino, the client describes where they want to be, then selects or confirms which tasks they want to pursue:
Option A — Auto-assign: The system selects the most relevant tasks from the bank based on their survey answers and goals.
Option B — Guided selection: The client is presented with the 20-option task bank for each Domino and chooses their preferred activities.
Option C — Manual entry: The client types in their own custom habit(s) for a given Domino.
The coach can review, override, or supplement any auto-assigned tasks before the client begins.
4.3  Output: The Client's Weekly Habit Plan
Once the survey is complete, the system generates a 7-day habit plan showing which tasks are scheduled for each day across all 8 Dominoes. This becomes the client's live game board inside the app.

5. GAMIFICATION SYSTEM
Gamification is the engine that drives daily engagement. Every habit completed is a move in the game. The system is designed to make personal development addictive, competitive, and deeply rewarding.
5.1  Points System
Every completed habit task earns the client a defined number of points.
Point values can vary by task difficulty, category, or streak bonus.
Bonus points awarded for completing all tasks in a single Domino on a given day.
Streak multipliers: completing tasks 7, 14, 30, 60, or 90 days in a row multiplies point earnings.
Coach can award bonus points manually as a motivational reward.
5.2  Levels & Progression
Clients start at Level 1 and progress through named levels as they accumulate points.
Suggested level tiers: Recruit → Player → Contender → Champion → Legend → Icon.
Each level unlock triggers an in-app celebration animation and a notification.
Higher levels may unlock exclusive challenges, leaderboard tiers, or premium content.
5.3  Domino Unlocks
The 8 Dominoes are presented visually as a domino chain.
Each Domino must reach a minimum activity threshold before the next one "falls" and unlocks.
This creates a sense of sequential momentum — clients see one win triggering the next.
Coach can customise unlock thresholds per client based on their goals and pace.
5.4  Trophies & Badges
Trophies are awarded for milestone achievements: first habit completed, first week streak, first Domino fully activated, etc.
Badges can be earned within each Domino category (e.g., "Body Warrior" for 30 consecutive Body tasks).
Trophies and badges are displayed on the client's profile page.
Coach can create and award custom trophies for exceptional performance.
5.5  Leaderboards
Global Leaderboard: All clients ranked by total points — visible to clients with public accounts.
Private Leaderboard: Coach-curated groups where specific clients compete against each other.
Weekly Leaderboard: Resets every Monday — keeps competition fresh and accessible.
Domino-Specific Leaderboards: Who is performing best in each of the 8 pillar categories.
Clients can opt in or out of public leaderboard visibility.

6. CLIENT-FACING MOBILE APP — FEATURE SPECIFICATION
6.1  Home / Dashboard Screen
Displays today's tasks across all 8 Dominoes — the client's daily game board.
Progress bar showing how many of today's tasks are complete.
Current point total, level, and streak counter displayed prominently.
Quick-tap habit check-in — one tap to mark a task complete.
Motivational message or coach note pinned at the top (if set by coach).
6.2  Domino View Screen
Visual domino chain showing all 8 pillars and their activation status.
Tap any Domino to see its full task list, completion history, and point earnings.
Progress ring or bar for each Domino showing weekly completion rate.
6.3  Points & Rewards Screen
Full point history and transaction log.
Trophy cabinet displaying all earned badges and achievements.
Level progress bar showing how many points to the next level.
6.4  Leaderboard Screen
Toggle between Global, Weekly, and Private leaderboards.
Client's own ranking highlighted.
Tap on any player to view their public profile and domino stats.
6.5  Profile Screen
Client name, photo, current level, and member since date.
Bio / goal statement.
All-time stats: total habits completed, total points, longest streak.
Trophy and badge display wall.
6.6  Notifications & Alerts
Daily habit reminders at client-preferred times.
Streak warnings ("You're at risk of losing your 14-day streak!").
Level-up and trophy alerts.
Coach messages and custom challenges.
Leaderboard movement alerts ("You've moved into the Top 10!").

7. COACH / ADMIN WEB DASHBOARD — FEATURE SPECIFICATION
7.1  Client Overview Panel
List view of all active clients with key stats: points, level, streak, last active date.
Filter and sort by: most active, least active, highest points, lowest engagement.
Search by client name or tag.
Status indicators: On Fire (high streak), At Risk (3+ days inactive), New Client.
7.2  Individual Client Profile (Coach View)
Full breakdown of client's habit completion by Domino and by day.
Point history and level progression timeline.
All survey answers and assigned task plan.
Ability to add, remove, or modify habit tasks for the client.
Notes field for private coach observations.
Direct message / push notification send to this client.
7.3  Task Management
Assign tasks from the 20-option bank per Domino to any client.
Add custom tasks not in the bank.
Set task frequency: daily, weekly, or specific days.
Set point values per task.
Enable or disable specific tasks without deleting them.
7.4  Broadcast & Motivation Tools
Send a push notification to all clients or a selected group.
Create a weekly challenge and push it to clients.
Award bonus points or custom trophies to specific clients.
Post a motivational message that pins to client home screens.
7.5  Analytics & Reporting
Platform-wide engagement metrics: daily active users, average habits per day, top performers.
Domino completion rates across all clients — identify which pillars need coaching focus.
Client retention and churn indicators.
Exportable reports in CSV or PDF format.

8. DATA ARCHITECTURE & COLLECTION
The platform is designed to be a data-rich environment. Every interaction is logged and timestamped, creating a powerful longitudinal dataset of client behaviour and lifestyle performance.
8.1  Core Data Entities
Users (role: client or coach, profile data, survey responses)
Habits / Tasks (domino, name, point value, frequency, completion log)
Dominos (8 pillars, task banks, unlock thresholds)
Points Ledger (all point transactions with timestamps and reasons)
Streaks (active streak, longest streak, history)
Trophies & Badges (earned date, category, criteria)
Leaderboard Records (weekly snapshots, all-time rankings)
Notifications (sent log, open rates, types)
Coach Actions (assignments, messages, manual point awards)
8.2  Data Privacy & Security
All client data encrypted at rest and in transit (TLS 1.3+).
Role-based access: coaches see only their assigned clients.
Clients control leaderboard visibility and public profile settings.
GDPR and applicable data privacy compliance built in from day one.
Regular automated backups with point-in-time recovery.

9. RECOMMENDED TECHNOLOGY STACK
The following stack is recommended for speed of development, scalability, and cross-platform support. Developer may propose alternatives.
Layer
Recommendation
Mobile App
React Native (iOS + Android from one codebase)
Coach Web Dashboard
React.js (Next.js recommended for SSR)
Backend / API
Node.js with Express or NestJS
Database
PostgreSQL (relational) + Redis (caching/streaks)
Auth
Firebase Auth or Auth0 (role-based: Coach / Client)
Real-time Sync
Firebase Realtime DB or Supabase Realtime
Push Notifications
Firebase Cloud Messaging (FCM)
File Storage
AWS S3 or Supabase Storage (profile images, media)
Hosting
Vercel (web dashboard) + AWS or Railway (backend)
Analytics
Mixpanel or Amplitude for behavioural analytics


10. DEVELOPMENT PHASES & MILESTONES
Phase 1 — Foundation (MVP)
User authentication (client + coach roles)
Pre-onboarding survey flow
All 8 Dominoes with full task banks loaded
Daily habit check-in (mobile app)
Basic points system
Coach dashboard — client list + individual client view
Phase 2 — Gamification Layer
Level progression system with animations
Streak tracking and multipliers
Trophy and badge engine
Leaderboard (global and weekly)
Push notifications (reminders, streak alerts, level-ups)
Phase 3 — Coach Power Tools
Full task assignment and customisation by coach
Broadcast messaging and challenge tools
Manual point and trophy awards
Analytics dashboard with client engagement metrics
Phase 4 — Scale & Intelligence
AI-powered task recommendation engine (learns from client behaviour)
Domino unlock animations and visual chain system
Private group leaderboards
Exportable client reports
Potential wearable / Apple Health / Google Fit integration

11. DEVELOPER NOTES & BUILD DIRECTIVES
The following directives must be considered non-negotiable from a product philosophy standpoint:
The app must feel like a game first, a habit tracker second. UI/UX must be immersive, dark-themed, and premium.
Every interaction should provide instant feedback — point animations, sound effects (optional), and visual rewards on habit completion.
The coach dashboard must be built for speed — a coach managing 50+ clients needs to see everything at a glance.
The task bank is the core content asset. It must be stored in a database, not hardcoded, so it can be expanded without app updates.
Survey logic must be flexible — the auto-assignment algorithm should be configurable by the coach, not just the client.
All 8 Dominoes must be treated as equally weighted at the system level — no pillar should be de-prioritised in the UI.
Leaderboard privacy must be robust — clients must be able to compete anonymously if they choose.
The platform must be built to scale — architecture decisions must not create a ceiling at 100 or 1,000 users.
Data is king — every action, click, and completion must be logged. This data is a core business asset.
Design system should use a dark, gold-accented aesthetic to match the premium, game-like positioning of the brand.

Next Steps for Developer
Review this white paper in full and flag any technical questions.
Propose a tech stack confirmation or alternative with rationale.
Provide a project timeline estimate by phase.
Confirm database schema design before any front-end work begins.
Schedule kickoff call with Hass to align on MVP scope and design direction.

Game of Life — Confidential Product White Paper | Created by Hass | For Developer Use Only

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/** Short labels — used in tight layouts (day pills, bar charts, mood chart axis). */
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Full labels — used in prose (setup prompts). Index-aligned with DAYS_OF_WEEK. */
export const FULL_DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Short parenthetical used inside the setup prompt, e.g.
 * "What can you do to invest in your BODY (Physically) on Tuesday?"
 * Kept terse on purpose — the full descriptors below don't fit that sentence.
 */
export const PILLAR_HINTS: Record<string, string> = {
  body: 'Physically',
  health: 'Dietary',
  happiness: 'Self Care',
  love: 'Relationships',
  work: 'Daily Grind',
  wealth: 'Future Gains',
  spirituality: 'Grounding',
  soul: 'Afterlife',
};

/**
 * Public-facing pillar descriptors — verbatim from 8dominos.com so the app and
 * the site speak the same language. Used wherever there's room to read.
 */
export const PILLAR_DESCRIPTORS: Record<string, string> = {
  body: 'Your physical vessel',
  health: 'What fuels you',
  happiness: 'What brings you joy',
  love: 'The people who matter',
  work: 'Aligned with your values',
  wealth: 'Your compounding future',
  spirituality: 'Grounding the inner you',
  soul: 'What comes after this life',
};

export interface Domino {
  id: string;
  title: string;
  activities: Record<DayOfWeek, string>;
  completionStatus: Record<string, Record<string, boolean>>;
}

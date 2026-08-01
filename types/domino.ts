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
 * What each pillar is really asking about — shown in the setup prompt,
 * e.g. "What can you do to invest in your BODY (Physically) on Tuesday?"
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

export interface Domino {
  id: string;
  title: string;
  activities: Record<DayOfWeek, string>;
  completionStatus: Record<string, Record<string, boolean>>;
}

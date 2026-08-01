/**
 * All motivational copy lives here — one source so the daily HUD and the score
 * card can't drift apart (they had already grown three conflicting lines).
 *
 * Voice (from Hass): calm, compounding, direct. No hype, no emoji.
 * "One day at a time. Little wins, compounded daily, lead to big wins in life."
 */

/** One line for the daily board — shown in the HUD and on the score card. */
export function dailyMessage(score: number, total: number = 8): string {
  if (score >= total) return 'Perfect day. All eight down.';
  if (score >= 6) return 'Almost there. Finish the chain.';
  if (score >= 4) return 'Halfway. Keep going.';
  if (score >= 1) return 'Good start. One at a time.';
  return 'Tap a domino to start the chain.';
}

export interface WeeklyMessage {
  title: string;
  message: string;
}

/** Title + line for the weekly summary card, keyed off the week's percentage. */
export function weeklyMessage(percentage: number): WeeklyMessage {
  if (percentage >= 100) {
    return {
      title: 'Perfect week.',
      message: 'Every domino, every day. This is what compounding looks like.',
    };
  }
  if (percentage >= 75) {
    return {
      title: 'Strong week.',
      message: 'Consistency is doing its work. Keep stacking.',
    };
  }
  if (percentage >= 50) {
    return {
      title: 'Halfway there.',
      message: 'Momentum builds from here. Keep showing up.',
    };
  }
  return {
    title: 'One day at a time.',
    message: 'Little wins, compounded daily, lead to big wins in life.',
  };
}

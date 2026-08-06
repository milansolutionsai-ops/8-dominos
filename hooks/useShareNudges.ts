import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';

const DAY_KEY = 'share_nudge_day_last';
const WEEK_KEY = 'share_nudge_week_last';

/** Below this, we don't ask. Nobody wants a prompt to broadcast a bad week. */
const WEEK_NUDGE_FLOOR = 50;

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * The two share prompts, and the guarantee that they stay gentle.
 *
 * Bounded to two persisted markers rather than one flag per day, so storage
 * can't grow without limit.
 *
 * The contract, so it stays auditable:
 *   - at most one perfect-day celebration per calendar day
 *   - at most one week nudge per week, Sunday only, and only at >= 50%
 *   - either is silenced permanently by a single tap
 *   - no notifications, no badges, nothing on days 1-6
 * Worst case for a user having a great week is two prompts in seven days,
 * both of which he earned by hitting 8/8.
 */
export function useShareNudges() {
  const [dayResolved, setDayResolved] = useState<string | null>(null);
  const [weekResolved, setWeekResolved] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [d, w] = await Promise.all([
        StorageService.getValue(DAY_KEY),
        StorageService.getValue(WEEK_KEY),
      ]);
      if (!alive) return;
      setDayResolved(d);
      setWeekResolved(w);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  /** True once the celebration for today has been shared or dismissed. */
  const dayAlreadyResolved = useCallback(
    (date: Date = new Date()) => dayResolved === isoDay(date),
    [dayResolved]
  );

  const resolveDay = useCallback((date: Date = new Date()) => {
    const key = isoDay(date);
    setDayResolved(key);
    void StorageService.saveValue(DAY_KEY, key);
  }, []);

  const weekNudgeVisible = useCallback(
    (percentage: number, today: Date = new Date()) => {
      if (!ready) return false;
      if (today.getDay() !== 0) return false; // Sunday only: the week is actually done
      if (percentage < WEEK_NUDGE_FLOOR) return false;
      return weekResolved !== isoDay(DateUtils.startOfWeek(today));
    },
    [ready, weekResolved]
  );

  const resolveWeekNudge = useCallback((today: Date = new Date()) => {
    const key = isoDay(DateUtils.startOfWeek(today));
    setWeekResolved(key);
    void StorageService.saveValue(WEEK_KEY, key);
  }, []);

  return { ready, dayAlreadyResolved, resolveDay, weekNudgeVisible, resolveWeekNudge };
}

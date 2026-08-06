export class DateUtils {
  static getWeekKeyForDate(date: Date): string {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const year = startOfWeek.getFullYear();
    const month = String(startOfWeek.getMonth() + 1).padStart(2, '0');
    const day = String(startOfWeek.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static getDateFromWeekKey(weekKey: string): Date {
    const [year, month, day] = weekKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  static getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static formatDate(date: Date): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayName = dayNames[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName}, ${month} ${day}, ${year}`;
  }

  static getCurrentWeekKey(): string {
    return this.getWeekKeyForDate(new Date());
  }

  /**
   * The Monday that starts `date`'s week, at local midnight.
   *
   * Sunday is the end of the week here, not the start — `getDay()` returns 0
   * for it, so the naive `getDate() - getDay() + 1` used across the screens
   * lands on *tomorrow* and shifts the whole week forward one day in seven.
   *
   * Note this deliberately does NOT match `getWeekKeyForDate`, which has that
   * same off-by-one and cannot be corrected in place: existing completion data
   * was written with it, so changing it would silently re-bucket every user's
   * history. Aggregation reads a key per date instead, which is correct either
   * way. See docs/BUILD_PLAN.md for the migration.
   */
  static startOfWeek(date: Date): Date {
    const d = new Date(date);
    const offset = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
    d.setDate(d.getDate() - offset);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /** Whole days from `startOfWeek(today)` to `today`, 1-7. */
  static daysElapsedInWeek(today: Date = new Date()): number {
    return ((today.getDay() + 6) % 7) + 1;
  }

  /** Short range label, e.g. "Aug 3 - Aug 9, 2026". */
  static formatWeekRange(weekStart: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const end = this.addDays(weekStart, 6);
    return `${months[weekStart.getMonth()]} ${weekStart.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  }
}

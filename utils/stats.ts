import { Domino } from '@/types/domino';
import { DateUtils } from './dateUtils';

interface UserStats {
    totalDominos: number;
    currentStreak: number;
    perfectDays: number;
    bestWeek: string;
}

export interface WeekPillar {
    title: string;
    /** Days completed this week, 0..daysCounted. */
    count: number;
}

export interface WeekSummary {
    weekStart: Date;
    /** "Aug 3 - Aug 9, 2026" */
    dateRange: string;
    /** Index-aligned with the `dominos` array passed in. */
    pillars: WeekPillar[];
    /** Days the score is judged against: elapsed days for the current week, else 7. */
    daysCounted: number;
    /** True when `daysCounted < 7`, i.e. the week is still running. */
    partial: boolean;
    completed: number;
    possible: number;
    /** 0-100, rounded, denominated on `possible`. */
    percentage: number;
    perfectDays: number;
    /** Days so far with at least one domino down. Never counts future days. */
    activeDays: number;
    /** Elapsed days with nothing done. Never counts future days. */
    missedDays: number;
    /** Per-day totals, Monday-first, length 7. `null` for days not yet reached. */
    dailyScores: (number | null)[];
}

export class StatsService {
    static calculateStats(dominos: Domino[]): UserStats {
        let totalDominos = 0;
        let perfectDays = 0;
        let maxWeeklyScore = 0;

        const target = dominos.length || 8;

        const allWeeks = new Set<string>();
        dominos.forEach(d => Object.keys(d.completionStatus).forEach(k => allWeeks.add(k)));

        allWeeks.forEach(weekKey => {
            const weekStart = DateUtils.getDateFromWeekKey(weekKey);
            let weeklyScore = 0;

            for (let i = 0; i < 7; i++) {
                const dailyScore = this.getScoreForDate(dominos, DateUtils.addDays(weekStart, i));
                if (dailyScore === target) perfectDays++;
                weeklyScore += dailyScore;
            }

            totalDominos += weeklyScore;
            if (weeklyScore > maxWeeklyScore) maxWeeklyScore = weeklyScore;
        });

        // Consecutive days (ending today or yesterday) with at least one domino
        // completed. Showing up keeps the chain alive.
        let streakCount = 0;
        const cursor = new Date();
        // Grace: if nothing is done yet today, start counting from yesterday.
        if (this.getScoreForDate(dominos, cursor) === 0) {
            cursor.setDate(cursor.getDate() - 1);
        }
        for (let i = 0; i < 365; i++) {
            if (this.getScoreForDate(dominos, cursor) >= 1) {
                streakCount++;
                cursor.setDate(cursor.getDate() - 1);
            } else {
                break;
            }
        }

        const weeklyTarget = target * 7;
        return {
            totalDominos,
            currentStreak: streakCount,
            perfectDays,
            bestWeek: `${maxWeeklyScore}/${weeklyTarget}`,
        };
    }

    /**
     * Days completed per pillar over `days` days from `weekStart`.
     * Index-aligned with `dominos`.
     */
    static getWeeklyPillarCounts(dominos: Domino[], weekStart: Date, days = 7): number[] {
        return dominos.map(domino => {
            let count = 0;
            for (let i = 0; i < days; i++) {
                const date = DateUtils.addDays(weekStart, i);
                const weekKey = DateUtils.getWeekKeyForDate(date);
                const dayOfWeek = DateUtils.getDayOfWeek(date);
                if (domino.completionStatus[weekKey]?.[dayOfWeek]) count++;
            }
            return count;
        });
    }

    /**
     * Everything the Weekly screen and the week share card need, in one pass.
     *
     * Scores against **elapsed days**, not the full seven. Denominating on 7
     * mid-week told a man who had done 22 of 24 possible dominos that he was at
     * 39%, and counted days that had not happened yet as "missed".
     *
     * Every lookup resolves its own week key from its own date, so this is
     * immune to `getWeekKeyForDate` bucketing Sunday into the next week.
     */
    static summarizeWeek(dominos: Domino[], weekStart: Date, today: Date = new Date()): WeekSummary {
        const thisWeek = DateUtils.startOfWeek(today).getTime() === DateUtils.startOfWeek(weekStart).getTime();
        const daysCounted = thisWeek ? DateUtils.daysElapsedInWeek(today) : 7;
        const target = dominos.length || 8;

        const dailyScores: (number | null)[] = [];
        let completed = 0;
        let perfectDays = 0;
        let activeDays = 0;

        for (let i = 0; i < 7; i++) {
            if (i >= daysCounted) {
                dailyScores.push(null); // not reached yet — absent, not zero
                continue;
            }
            const score = this.getScoreForDate(dominos, DateUtils.addDays(weekStart, i));
            dailyScores.push(score);
            completed += score;
            if (score > 0) activeDays++;
            if (score === target && target > 0) perfectDays++;
        }

        const possible = target * daysCounted;
        const pillarCounts = this.getWeeklyPillarCounts(dominos, weekStart, daysCounted);

        return {
            weekStart,
            dateRange: DateUtils.formatWeekRange(weekStart),
            pillars: dominos.map((d, i) => ({ title: d.title, count: pillarCounts[i] })),
            daysCounted,
            partial: daysCounted < 7,
            completed,
            possible,
            percentage: possible > 0 ? Math.round((completed / possible) * 100) : 0,
            perfectDays,
            activeDays,
            missedDays: daysCounted - activeDays,
            dailyScores,
        };
    }

    static getScoreForDate(dominos: Domino[], date: Date): number {
        const weekKey = DateUtils.getWeekKeyForDate(date);
        const dayOfWeek = DateUtils.getDayOfWeek(date);
        return dominos.reduce((score, domino) => {
            return score + (domino.completionStatus[weekKey]?.[dayOfWeek] ? 1 : 0);
        }, 0);
    }
}

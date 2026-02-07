import { Domino } from '@/types/domino';
import { DateUtils } from './dateUtils';

interface UserStats {
    totalDominos: number;
    currentStreak: number;
    perfectDays: number;
    bestWeek: string;
}

export class StatsService {
    static calculateStats(dominos: Domino[]): UserStats {
        let totalDominos = 0;
        let perfectDays = 0;
        let currentStreak = 0;
        let maxWeeklyScore = 0;

        // Helper to extract all unique dates and their scores
        const dateScores = new Map<string, number>();
        const weeksMap = new Map<string, number>();

        dominos.forEach(domino => {
            Object.entries(domino.completionStatus).forEach(([weekKey, weekData]) => {
                // Track weekly perfect days
                if (!weeksMap.has(weekKey)) weeksMap.set(weekKey, 0);

                Object.entries(weekData).forEach(([dayOfWeek, completed]) => {
                    if (completed) {
                        // 1. Total Dominos
                        totalDominos++;

                        // Calculate date for this completion (approximate logic based on weekKey)
                        // We need a way to group completions by exact date to check for perfect days
                        // Since we don't have exact dates in the data structure easily, we reconstruct it
                        // This is a limitation of the current data structure, but we can do a best effort.

                        // Actually, we can just iterate the structure.
                        // Problem: We need to know which "dayOfWeek" corresponds to which Date to count daily totals.
                    }
                });
            });
        });

        // Re-scanning with a date-centric approach
        // We need to find all weeks present in the data
        const allWeeks = new Set<string>();
        dominos.forEach(d => Object.keys(d.completionStatus).forEach(k => allWeeks.add(k)));

        Array.from(allWeeks).forEach(weekKey => {
            const weekStart = DateUtils.getDateFromWeekKey(weekKey);
            let weeklyScore = 0;

            for (let i = 0; i < 7; i++) {
                const date = DateUtils.addDays(weekStart, i);
                const dayOfWeek = DateUtils.getDayOfWeek(date);

                let dailyScore = 0;
                dominos.forEach(d => {
                    if (d.completionStatus[weekKey]?.[dayOfWeek]) {
                        dailyScore++;
                    }
                });

                // 2. Perfect Days
                if (dailyScore === 8) {
                    perfectDays++;
                }

                weeklyScore += dailyScore;
            }

            // 4. Best Week Score
            if (weeklyScore > maxWeeklyScore) {
                maxWeeklyScore = weeklyScore;
            }
        });

        // 3. Current Streak (working backwards from today)
        // We check yesterday, day before, etc.
        let streakActive = true;
        let checkDate = new Date();
        // Start from yesterday to allow for "today in progress"
        // Or include today? Let's include today if completed, otherwise check yesterday.

        // Simple Check: Loop back up to 365 days
        let streakCount = 0;
        for (let i = 0; i < 365; i++) {
            // Check today first
            if (i === 0) {
                const todayScore = this.getScoreForDate(dominos, checkDate);
                if (todayScore === 8) {
                    streakCount++;
                } else {
                    // If today isn't perfect, we don't break streak yet, we just don't count it.
                    // Streak is broken if YESTERDAY was not perfect.
                }
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }

            const score = this.getScoreForDate(dominos, checkDate);
            if (score === 8) {
                streakCount++;
            } else {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }
        currentStreak = streakCount;


        return {
            totalDominos,
            currentStreak,
            perfectDays,
            bestWeek: maxWeeklyScore > 0 ? `${maxWeeklyScore}/56` : '0/56'
        };
    }

    private static getScoreForDate(dominos: Domino[], date: Date): number {
        const weekKey = DateUtils.getWeekKeyForDate(date);
        const dayOfWeek = DateUtils.getDayOfWeek(date);
        return dominos.reduce((score, domino) => {
            return score + (domino.completionStatus[weekKey]?.[dayOfWeek] ? 1 : 0);
        }, 0);
    }
}

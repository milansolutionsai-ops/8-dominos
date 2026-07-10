import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

interface MoodData {
    date: string;
    morning: number | null;
    evening: number | null;
    dayLabel: string;
}

interface MoodTrendChartProps {
    data: MoodData[];
}

export default function MoodTrendChart({ data }: MoodTrendChartProps) {
    const chartHeight = 140;
    const horizontalMargin = 25;
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 32;
    const chartWidth = cardWidth;

    const getX = (index: number) => {
        const availableWidth = chartWidth - (horizontalMargin * 2);
        return horizontalMargin + (index / 6) * availableWidth;
    };

    const getY = (mood: number) => {
        const verticalPadding = 10;
        const availableHeight = chartHeight - (verticalPadding * 2);
        return verticalPadding + (availableHeight - ((mood - 1) / 4) * availableHeight);
    };

    const createPath = () => {
        let path = '';
        let isFirst = true;

        data.forEach((day, index) => {
            const mood = day.evening ?? day.morning;
            if (mood !== null) {
                const x = getX(index);
                const y = getY(mood);
                if (isFirst) {
                    path += `M ${x} ${y}`;
                    isFirst = false;
                } else {
                    path += ` L ${x} ${y}`;
                }
            }
        });
        return path;
    };

    const hasData = data.some(d => d.morning !== null || d.evening !== null);

    if (!hasData) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mood This Week</Text>
                </View>
                <View style={[styles.chartArea, styles.emptyState]}>
                    <Text style={styles.emptyText}>Start checking in to see your mood trend</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mood This Week</Text>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.dot, styles.moodDot]} />
                        <Text style={styles.legendText}>Daily Mood</Text>
                    </View>
                </View>
            </View>

            <View style={styles.chartArea}>
                <Svg width={chartWidth} height={chartHeight} style={{ overflow: 'visible' }}>
                    <Path
                        d={createPath()}
                        stroke={colors.accent}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {data.map((day, index) => {
                        const mood = day.evening ?? day.morning;
                        if (mood === null) return null;

                        const x = getX(index);
                        return (
                            <Circle
                                key={index}
                                cx={x}
                                cy={getY(mood)}
                                r="5"
                                fill={colors.accent}
                                stroke={colors.bg}
                                strokeWidth="2"
                            />
                        );
                    })}
                </Svg>
            </View>

            <View style={[styles.labelsContainer, { width: chartWidth }]}>
                {data.map((day, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.label,
                            {
                                position: 'absolute',
                                left: getX(index) - 15,
                                width: 30
                            }
                        ]}
                    >
                        {day.dayLabel}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        paddingVertical: spacing.xl,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        ...elevation.md,
    },
    header: {
        marginBottom: spacing.lg,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.textPrimary,
    },
    legend: {
        flexDirection: 'row',
        marginTop: 4,
        gap: spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendText: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        color: colors.textSecondary,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    moodDot: {
        backgroundColor: colors.accent,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    chartArea: {
        height: 140,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    labelsContainer: {
        height: 20,
        marginTop: spacing.sm,
    },
    label: {
        fontFamily: fonts.semibold,
        fontSize: 11,
        color: colors.textMuted,
        textAlign: 'center',
    },
});

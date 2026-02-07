import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

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
    const horizontalMargin = 25; // Safer margin for dots at edges
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 32; // marginHorizontal: 16 * 2
    const chartWidth = cardWidth; // Use full card width for SVG

    // Calculate X position for a given index (0-6)
    const getX = (index: number) => {
        const availableWidth = chartWidth - (horizontalMargin * 2);
        return horizontalMargin + (index / 6) * availableWidth;
    };

    // Calculate Y position for a mood (1-5)
    const getY = (mood: number) => {
        const verticalPadding = 10;
        const availableHeight = chartHeight - (verticalPadding * 2);
        // Invert: 5 is top, 1 is bottom
        return verticalPadding + (availableHeight - ((mood - 1) / 4) * availableHeight);
    };

    const createPath = () => {
        let path = '';
        let isFirst = true;

        data.forEach((day, index) => {
            // Use evening mood as primary, fallback to morning if available
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
                    {/* Mood Line */}
                    <Path
                        d={createPath()}
                        stroke="#000000"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Dots */}
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
                                fill="#fedd14"
                                stroke="#000000"
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
                                left: getX(index) - 15, // center label (width 30)
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
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000000',
    },
    legend: {
        flexDirection: 'row',
        marginTop: 4,
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    moodDot: {
        backgroundColor: '#fedd14',
        borderWidth: 1,
        borderColor: '#000000',
    },
    chartArea: {
        height: 140,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    labelsContainer: {
        height: 20,
        marginTop: 8,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.5,
        textAlign: 'center',
    },
});

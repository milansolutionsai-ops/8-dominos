import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

export const DominoIllustration = () => {
    // Brand colors
    const dominoColor = '#fedd14'; // bright yellow
    const dotColor = '#000000';    // black
    const borderColor = '#000000'; // black

    // Domino dimensions
    const width = 30;
    const height = 60;
    const gap = 10;
    const radius = 4;
    const dotSize = 3;

    const renderDots = (num: number, x: number, y: number) => {
        const dots: React.ReactNode[] = [];

        // Grid positions for top and bottom halves (30x30 squares)
        // Horizontal: 7.5, 15, 22.5
        // Vertical Top: 7.5, 15, 22.5
        // Vertical Bottom: 37.5, 45, 52.5
        const positions = {
            // Top Half
            tTL: { cx: x + 7.5, cy: y + 7.5 },
            tTC: { cx: x + 15, cy: y + 7.5 },
            tTR: { cx: x + 22.5, cy: y + 7.5 },
            tCC: { cx: x + 15, cy: y + 15 },
            tBL: { cx: x + 7.5, cy: y + 22.5 },
            tBR: { cx: x + 22.5, cy: y + 22.5 },
            // Bottom Half
            bTL: { cx: x + 7.5, cy: y + 37.5 },
            bTC: { cx: x + 15, cy: y + 37.5 },
            bTR: { cx: x + 22.5, cy: y + 37.5 },
            bCC: { cx: x + 15, cy: y + 45 },
            bBL: { cx: x + 7.5, cy: y + 52.5 },
            bBR: { cx: x + 22.5, cy: y + 52.5 },
        };

        const patterns: Record<number, string[]> = {
            1: ['bCC'],
            2: ['tCC', 'bCC'],
            3: ['tTL', 'tBR', 'bCC'],
            4: ['tTL', 'tBR', 'bTL', 'bBR'],
            5: ['tTL', 'tCC', 'tBR', 'bTL', 'bBR'],
            6: ['tTL', 'tCC', 'tBR', 'bTL', 'bCC', 'bBR'],
            7: ['tTL', 'tTR', 'tBL', 'tBR', 'bTL', 'bCC', 'bBR'],
            8: ['tTL', 'tTR', 'tBL', 'tBR', 'bTL', 'bTR', 'bBL', 'bBR'],
        };

        const activePattern = patterns[num] || [];

        activePattern.forEach((posKey, index) => {
            // @ts-ignore
            const pos = positions[posKey];
            if (pos) {
                dots.push(
                    <Circle
                        key={`dot-${num}-${index}`}
                        cx={pos.cx}
                        cy={pos.cy}
                        r={dotSize}
                        fill={dotColor}
                    />
                );
            }
        });

        return dots;
    };

    return (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Svg width="330" height="80" viewBox="0 0 330 80">
                <G rotation="0" origin="165, 40">
                    {Array.from({ length: 8 }, (_, i) => {
                        const num = i + 1;
                        const x = i * (width + gap) + 10;
                        const y = 10;

                        // Subtle rotation for "messy/real" look
                        const rotation = (i % 2 === 0 ? 2 : -2);

                        return (
                            <G key={i} rotation={rotation} origin={`${x + width / 2}, ${y + height / 2}`}>
                                {/* Domino Body */}
                                <Rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    rx={radius}
                                    ry={radius}
                                    fill={dominoColor}
                                    stroke={borderColor}
                                    strokeWidth="2"
                                />

                                {/* Center Line */}
                                <Rect
                                    x={x + 2}
                                    y={y + height / 2 - 0.5}
                                    width={width - 4}
                                    height={1}
                                    fill={dotColor}
                                    opacity={0.3}
                                />

                                {/* Dots */}
                                {renderDots(num, x, y)}
                            </G>
                        );
                    })}
                </G>
            </Svg>
        </View>
    );
};

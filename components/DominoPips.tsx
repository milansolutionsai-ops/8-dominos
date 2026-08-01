import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Standard domino pip layouts, on a 3x3 grid per half.
 * Grid index (row-major): 0 TL · 1 TC · 2 TR · 3 ML · 4 MC · 5 MR · 6 BL · 7 BC · 8 BR
 */
const HALF_PATTERNS: Record<number, number[]> = {
  0: [],
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

/** Split a pillar number the way a real tile reads it: 8 = 4|4, 7 = 4|3, 2 = 1|1. */
export function halvesFor(count: number): [number, number] {
  const n = Math.min(Math.max(Math.round(count), 0), 12);
  return [Math.ceil(n / 2), Math.floor(n / 2)];
}

interface DominoPipsProps {
  count: number;
  color: string;
  /** Width of the face. Rendered height is 2x (two square halves + the divider). */
  size?: number;
  dividerColor?: string;
}

/**
 * A real domino face: two square halves split by a line.
 *
 * Real dominoes are double-six — one half never shows more than six pips, and
 * an "8 face" doesn't exist. So each pillar's number is split across both
 * halves the way an actual tile reads it: Soul (8) is the double-four,
 * Wealth (6) the double-three, Health (2) the double-one.
 */
export function DominoPips({ count, color, size = 24, dividerColor }: DominoPipsProps) {
  const [top, bottom] = halvesFor(count);
  const dot = Math.max(2, Math.round(size * 0.21));
  const pad = Math.max(1, Math.round(size * 0.07));

  const renderHalf = (value: number) => {
    const active = new Set(HALF_PATTERNS[value] ?? []);
    return (
      <View style={[styles.half, { width: size, height: size, padding: pad }]}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={styles.cell}>
            {active.has(i) && (
              <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ width: size, height: size * 2 + 1 }}>
      {renderHalf(top)}
      <View
        style={{
          height: 1,
          marginHorizontal: Math.round(size * 0.12),
          backgroundColor: dividerColor ?? color,
          opacity: dividerColor ? 1 : 0.55,
        }}
      />
      {renderHalf(bottom)}
    </View>
  );
}

const styles = StyleSheet.create({
  half: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.33%', height: '33.33%', alignItems: 'center', justifyContent: 'center' },
});

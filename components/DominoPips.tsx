import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Renders a domino/dice pip face for a given count (1-8) on a 3x3 grid.
 * Each of the 8 pillars gets a distinct, learnable face (Body = 1 … Soul = 8).
 * Grid index (row-major): 0 TL · 1 TC · 2 TR · 3 ML · 4 MC · 5 MR · 6 BL · 7 BC · 8 BR
 */
const PATTERNS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
  7: [0, 2, 3, 4, 5, 6, 8],
  8: [0, 1, 2, 3, 5, 6, 7, 8],
};

interface DominoPipsProps {
  count: number;
  color: string;
  size?: number;
}

export function DominoPips({ count, color, size = 44 }: DominoPipsProps) {
  const n = Math.min(Math.max(Math.round(count), 1), 8);
  const active = new Set(PATTERNS[n]);
  const dot = Math.max(4, Math.round(size * 0.19));

  return (
    <View style={[styles.grid, { width: size, height: size }]}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={styles.cell}>
          {active.has(i) && (
            <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.33%', height: '33.33%', alignItems: 'center', justifyContent: 'center' },
});

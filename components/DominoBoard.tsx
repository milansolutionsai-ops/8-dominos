import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DominoTile } from './DominoTile';
import { colors, spacing } from '@/constants/theme';

export interface BoardItem {
  id: string;
  title: string;
  activity: string;
  completed: boolean;
}

interface DominoBoardProps {
  items: BoardItem[];
  onToggle: (id: string) => void;
  onSetup?: (id: string) => void;
  justCompletedIndex: number | null;
}

/**
 * The daily game board: the 8 tiles as a zig-zag domino chain with connecting
 * rail segments that light as momentum builds. On a Perfect Day the whole chain
 * topples in sequence.
 */
export function DominoBoard({ items, onToggle, onSetup, justCompletedIndex }: DominoBoardProps) {
  const [waveSignals, setWaveSignals] = useState<number[]>(() => items.map(() => 0));
  const prevPerfect = useRef(false);

  const allComplete = items.length > 0 && items.every((i) => i.completed);

  useEffect(() => {
    if (!allComplete || prevPerfect.current) {
      prevPerfect.current = allComplete;
      return;
    }
    prevPerfect.current = true;

    // Perfect Day: topple the chain tile-by-tile. Timers are tracked so an
    // unmount (or undoing perfection mid-wave) cancels the rest.
    const timers = items.map((_, i) =>
      setTimeout(() => {
        setWaveSignals((prev) => {
          const next = [...prev];
          next[i] = (next[i] || 0) + 1;
          return next;
        });
      }, i * 70)
    );

    return () => timers.forEach(clearTimeout);
  }, [allComplete, items.length]);

  return (
    <View style={styles.board}>
      {items.map((item, index) => {
        const leanLeft = index % 2 === 0;
        const linkActive = item.completed && !!items[index + 1]?.completed;
        return (
          <View key={item.id}>
            <View style={leanLeft ? styles.leanLeft : styles.leanRight}>
              <DominoTile
                title={item.title}
                activity={item.activity}
                completed={item.completed}
                onToggle={() => onToggle(item.id)}
                onSetup={onSetup ? () => onSetup(item.id) : undefined}
                index={index}
                leanLeft={leanLeft}
                bumped={justCompletedIndex === index - 1}
                toppleSignal={waveSignals[index]}
              />
            </View>
            {index < items.length - 1 && (
              <View style={styles.connectorWrap} pointerEvents="none">
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: linkActive ? colors.accentBright : colors.border },
                  ]}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const LEAN = 40;
/** Tiles carry marginVertical: 5, so the gap between two is 10. */
const TILE_GAP = 10;

const styles = StyleSheet.create({
  board: {
    paddingTop: spacing.sm,
  },
  leanLeft: {
    paddingLeft: spacing.lg,
    paddingRight: LEAN,
  },
  leanRight: {
    paddingLeft: LEAN,
    paddingRight: spacing.lg,
  },
  connectorWrap: {
    alignItems: 'center',
    // Pull up over the tiles' own margins so the link actually touches both
    // ends. It used to span 16 across a 22pt gap, leaving a chain with
    // detached links.
    marginTop: -TILE_GAP,
    marginBottom: -TILE_GAP,
    height: TILE_GAP * 2,
    justifyContent: 'center',
  },
  connector: {
    width: 4,
    height: TILE_GAP * 2,
    borderRadius: 2,
  },
});

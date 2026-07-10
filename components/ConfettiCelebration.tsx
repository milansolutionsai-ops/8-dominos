import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { colors, brand, fonts, radius, spacing, elevation } from '@/constants/theme';

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  scale: Animated.Value;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
}

const COLORS = [colors.accent, brand.blueTint, colors.onAccent, colors.success, colors.warning];
const CONFETTI_COUNT = 50;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getShapeStyle = (shape: 'circle' | 'square' | 'triangle') => {
  const baseSize = { width: 12, height: 12 };

  switch (shape) {
    case 'circle':
      return { ...baseSize, borderRadius: 6 };
    case 'square':
      return { ...baseSize, borderRadius: 2 };
    case 'triangle':
      return {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      };
    default:
      return baseSize;
  }
};

export function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const confettiPiecesRef = useRef<ConfettiPiece[]>([]);
  const badgeScale = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      pieces.push({
        id: i,
        x: new Animated.Value(screenWidth / 2),
        y: new Animated.Value(-50),
        rotate: new Animated.Value(0),
        scale: new Animated.Value(1),
        color: COLORS[i % COLORS.length],
        shape: (['circle', 'square', 'triangle'] as const)[i % 3],
      });
    }
    confettiPiecesRef.current = pieces;
  }, []);

  const animateBadge = () => {
    badgeScale.setValue(reduceMotion ? 1 : 0.6);
    badgeOpacity.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(badgeScale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
        Animated.timing(badgeOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]),
      Animated.delay(1600),
      Animated.timing(badgeOpacity, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  };

  const launchConfetti = () => {
    const animations = confettiPiecesRef.current.map((piece, index) => {
      piece.x.setValue(screenWidth / 2);
      piece.y.setValue(-50);
      piece.rotate.setValue(0);
      piece.scale.setValue(1);

      const randomX = ((index * 137) % screenWidth);
      const duration = 2000 + (index % 10) * 100;

      return Animated.sequence([
        Animated.delay(index * 30),
        Animated.parallel([
          Animated.timing(piece.x, { toValue: randomX, duration, useNativeDriver: false }),
          Animated.timing(piece.y, { toValue: screenHeight + 100, duration, useNativeDriver: false }),
          Animated.timing(piece.rotate, { toValue: 10, duration, useNativeDriver: false }),
          Animated.sequence([
            Animated.timing(piece.scale, { toValue: 1, duration: duration * 0.1, useNativeDriver: false }),
            Animated.timing(piece.scale, { toValue: 0, duration: duration * 0.9, useNativeDriver: false }),
          ]),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  };

  useEffect(() => {
    if (trigger) {
      animateBadge();
      if (!reduceMotion) {
        launchConfetti();
      } else {
        // No falling confetti under reduced motion; badge alone, then done.
        const t = setTimeout(() => onComplete?.(), 2200);
        return () => clearTimeout(t);
      }
    }
  }, [trigger]);

  const renderConfettiPiece = (piece: ConfettiPiece) => {
    const rotation = piece.rotate.interpolate({
      inputRange: [0, 10],
      outputRange: ['0deg', '3600deg'],
    });

    const shapeStyle = getShapeStyle(piece.shape);

    return (
      <Animated.View
        key={piece.id}
        style={[
          styles.confettiPiece,
          shapeStyle,
          {
            backgroundColor: piece.shape === 'triangle' ? 'transparent' : piece.color,
            borderBottomColor: piece.shape === 'triangle' ? piece.color : undefined,
            transform: [
              { translateX: piece.x },
              { translateY: piece.y },
              { rotate: rotation },
              { scale: piece.scale },
            ],
          },
        ]}
      />
    );
  };

  if (!trigger) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {!reduceMotion && confettiPiecesRef.current.map(renderConfettiPiece)}
      <View style={styles.badgeWrapper} pointerEvents="none">
        <Animated.View
          style={[
            styles.badge,
            { opacity: badgeOpacity, transform: [{ scale: badgeScale }] },
            elevation.accentGlow,
          ]}
        >
          <Text style={styles.badgeTitle}>Perfect Day</Text>
          <Text style={styles.badgeSubtitle}>All 8 dominos down</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 9999,
  },
  confettiPiece: {
    position: 'absolute',
  },
  badgeWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  badgeTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.onAccent,
    letterSpacing: -0.3,
  },
  badgeSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.onAccent,
    opacity: 0.85,
    marginTop: 2,
  },
});

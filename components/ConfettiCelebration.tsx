import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

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

const COLORS = ['#fedd14', '#000000', '#10b981', '#ef4444', '#3b82f6', '#f59e0b'];
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
  const confettiPiecesRef = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      pieces.push({
        id: i,
        x: new Animated.Value(screenWidth / 2),
        y: new Animated.Value(-50),
        rotate: new Animated.Value(0),
        scale: new Animated.Value(1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
      });
    }
    confettiPiecesRef.current = pieces;
  }, []);

  const launchConfetti = () => {
    const animations = confettiPiecesRef.current.map((piece, index) => {
      piece.x.setValue(screenWidth / 2);
      piece.y.setValue(-50);
      piece.rotate.setValue(0);
      piece.scale.setValue(1);

      const randomX = Math.random() * screenWidth;
      const duration = 2000 + Math.random() * 1000;

      return Animated.sequence([
        Animated.delay(index * 30),
        Animated.parallel([
          Animated.timing(piece.x, {
            toValue: randomX,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(piece.y, {
            toValue: screenHeight + 100,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(piece.rotate, {
            toValue: 10,
            duration,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(piece.scale, {
              toValue: 1,
              duration: duration * 0.1,
              useNativeDriver: false,
            }),
            Animated.timing(piece.scale, {
              toValue: 0,
              duration: duration * 0.9,
              useNativeDriver: false,
            }),
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
      launchConfetti();
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
            backgroundColor: piece.color,
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
      {confettiPiecesRef.current.map(renderConfettiPiece)}
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
});

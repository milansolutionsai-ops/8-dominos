import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { getRandomQuote, Quote } from '../utils/quotes';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { DominoPips } from './DominoPips';

interface QuoteSplashProps {
    onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

/** Tightened from ~3.9s. This is a daily-use app; the splash is a greeting, not a feature. */
const HOLD_MS = 1500;
const FADE_IN_MS = 320;
const FADE_OUT_MS = 260;

export default function QuoteSplash({ onComplete }: QuoteSplashProps) {
    const reduceMotion = useReducedMotion();
    const [quote, setQuote] = useState<Quote | null>(null);
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const done = useRef(false);

    const finish = useCallback(() => {
        if (done.current) return;
        done.current = true;
        if (reduceMotion) {
            onComplete();
            return;
        }
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: FADE_OUT_MS,
            useNativeDriver: true,
        }).start(onComplete);
    }, [onComplete, reduceMotion]);

    useEffect(() => {
        setQuote(getRandomQuote());

        if (reduceMotion) {
            opacityAnim.setValue(1);
        } else {
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: FADE_IN_MS,
                useNativeDriver: true,
            }).start();
        }

        const timeout = setTimeout(finish, HOLD_MS);
        return () => clearTimeout(timeout);
    }, [finish, reduceMotion]);

    if (!quote) return null;

    return (
        // Tappable: nobody should be held on a splash they've already read.
        <Pressable style={styles.container} onPress={finish} accessibilityLabel="Skip">
            <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
                <Text style={styles.headerText}>8 DOMINOS</Text>

                <View style={styles.chain}>
                    {[1, 2, 3, 4, 5].map((n, i) => {
                        const lit = i === 4;
                        return (
                            <View
                                key={n}
                                style={[styles.chainTile, lit && styles.chainTileLit, { transform: [{ rotate: `${i * 6 - 10}deg` }] }]}
                            >
                                <DominoPips count={n} color={lit ? colors.onAccent : colors.textMuted} size={14} />
                            </View>
                        );
                    })}
                </View>

                <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>“{quote.text}”</Text>
                    <Text style={styles.authorText}>— {quote.author}</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: colors.bg,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    headerText: {
        position: 'absolute',
        top: 80,
        fontSize: 14,
        fontFamily: fonts.bold,
        letterSpacing: 3,
        color: colors.accent,
        textTransform: 'uppercase',
    },
    chain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: spacing.xxl,
    },
    chainTile: {
        width: 24,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chainTileLit: {
        backgroundColor: colors.accent,
        borderColor: colors.accentBright,
    },
    quoteContainer: {
        // width is required: with only maxWidth the container shrink-wraps to
        // its text inside a centered parent, so long quotes overflow the screen
        // instead of wrapping.
        width: '100%',
        alignItems: 'center',
        maxWidth: 600,
    },
    quoteText: {
        fontSize: 22,
        fontFamily: fonts.semibold,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: 32,
    },
    authorText: {
        marginTop: 16,
        fontSize: 14,
        fontFamily: fonts.medium,
        color: colors.textMuted,
    },
});

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { getRandomQuote, Quote } from '../utils/quotes';
import { colors, fonts } from '@/constants/theme';

interface QuoteSplashProps {
    onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function QuoteSplash({ onComplete }: QuoteSplashProps) {
    const [quote, setQuote] = useState<Quote | null>(null);
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setQuote(getRandomQuote());

        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                onComplete();
            });
        }, 2600);

        return () => clearTimeout(timeout);
    }, []);

    if (!quote) return null;

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
                <Text style={styles.headerText}>8 DOMINOS</Text>

                <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>"{quote.text}"</Text>
                    <Text style={styles.authorText}>— {quote.author}</Text>
                </View>
            </Animated.View>
        </View>
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
    quoteContainer: {
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

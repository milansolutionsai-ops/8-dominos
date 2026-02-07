import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { getRandomQuote, Quote } from '../utils/quotes';

interface QuoteSplashProps {
    onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function QuoteSplash({ onComplete }: QuoteSplashProps) {
    const [quote, setQuote] = useState<Quote | null>(null);
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Set a random quote properly within useEffect to avoid hydration mismatches or changes on re-renders
        setQuote(getRandomQuote());

        // Fade in
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Wait then fade out
        const timeout = setTimeout(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                // Call onComplete after fade out finishes
                onComplete();
            });
        }, 2600); // 800ms fade in + 1800ms display time

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
        backgroundColor: '#fedd14',
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
        fontWeight: '800',
        letterSpacing: 3,
        color: '#000000',
        opacity: 0.5,
        textTransform: 'uppercase',
    },
    quoteContainer: {
        alignItems: 'center',
        maxWidth: 600,
    },
    quoteText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 32,
    },
    authorText: {
        marginTop: 16,
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        opacity: 0.6,
    },
});

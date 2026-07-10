import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { soundEffects } from '@/utils/soundEffects';
import { colors, fonts, radius, spacing, elevation } from '@/constants/theme';

interface MoodCheckInProps {
    period: 'morning' | 'evening';
    onSave: (mood: number) => void;
    savedMood: number | null;
}

const MOODS = [
    { value: 1, emoji: '😞' },
    { value: 2, emoji: '😐' },
    { value: 3, emoji: '😊' },
    { value: 4, emoji: '😁' },
    { value: 5, emoji: '🔥' },
];

export default function MoodCheckIn({ period, onSave, savedMood }: MoodCheckInProps) {
    const [selectedMood, setSelectedMood] = useState<number | null>(savedMood);
    const [scaleAnims] = useState(() => MOODS.map(() => new Animated.Value(1)));

    React.useEffect(() => {
        setSelectedMood(savedMood);
    }, [savedMood]);

    const handleSelect = (mood: number, index: number) => {
        setSelectedMood(mood);
        onSave(mood);
        soundEffects.playMood();

        Animated.sequence([
            Animated.timing(scaleAnims[index], {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnims[index], {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const isSaved = savedMood !== null;
    const title = period === 'morning' ? 'Morning Mood' : 'Evening Mood';
    const subtitle = period === 'morning' ? 'How are you starting the day?' : 'How was your day?';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                {isSaved && (
                    <View style={styles.savedBadge}>
                        <Check size={12} color={colors.success} />
                        <Text style={styles.savedText}>Saved</Text>
                    </View>
                )}
            </View>

            <View style={styles.emojiContainer}>
                {MOODS.map((mood, index) => {
                    const isSelected = selectedMood === mood.value;
                    return (
                        <TouchableOpacity
                            key={mood.value}
                            onPress={() => handleSelect(mood.value, index)}
                            activeOpacity={0.7}
                            style={[
                                styles.emojiButton,
                                isSelected && styles.emojiButtonSelected,
                            ]}
                        >
                            <Animated.Text
                                style={[
                                    styles.emoji,
                                    { transform: [{ scale: scaleAnims[index] }] },
                                ]}
                            >
                                {mood.emoji}
                            </Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        marginHorizontal: 20,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...elevation.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.textMuted,
    },
    savedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.accentSoft,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.success,
    },
    savedText: {
        fontFamily: fonts.bold,
        fontSize: 12,
        color: colors.success,
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
    },
    emojiButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: 'transparent',
    },
    emojiButtonSelected: {
        backgroundColor: colors.accent,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    emoji: {
        fontSize: 24,
    },
});

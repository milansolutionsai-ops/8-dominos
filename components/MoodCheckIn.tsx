import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { soundEffects } from '@/utils/soundEffects';

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

    // Sync local state if the prop changes (e.g. when changing days)
    React.useEffect(() => {
        setSelectedMood(savedMood);
    }, [savedMood]);

    const handleSelect = (mood: number, index: number) => {
        setSelectedMood(mood);
        onSave(mood);
        soundEffects.playMood(); // Play subtle chime sound

        // Pulse animation
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
    const title = 'Daily Mood';
    const subtitle = 'How was your day?';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                {isSaved && (
                    <View style={styles.savedBadge}>
                        <Check size={12} color="#10b981" />
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
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    savedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#10b981',
    },
    savedText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#10b981',
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
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
        backgroundColor: '#fedd14',
        borderWidth: 2,
        borderColor: '#000000',
    },
    emoji: {
        fontSize: 24,
    },
});

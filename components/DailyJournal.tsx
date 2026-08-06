import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Alert,
    LayoutChangeEvent,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { ChevronDown, ChevronUp, PenLine, Check } from 'lucide-react-native';
import { StorageService } from '../utils/storage';
import { colors, fonts, type, spacing, radius, elevation, motion } from '@/constants/theme';

interface DailyJournalProps {
    currentDate: string;
}

export default function DailyJournal({ currentDate }: DailyJournalProps) {
    const reduceMotion = useReducedMotion();
    const [isExpanded, setIsExpanded] = useState(false);
    const [journalText, setJournalText] = useState('');
    const [savedText, setSavedText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);
    // Measured, not guessed: a fixed max height clipped long entries with no
    // way to scroll to the rest of them.
    const [contentHeight, setContentHeight] = useState(0);

    const animationController = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadJournalEntry();
    }, [currentDate]);

    const loadJournalEntry = async () => {
        try {
            const entry = await StorageService.getJournalEntry(currentDate);
            setJournalText(entry ?? '');
            setSavedText(entry ?? '');
        } catch (error) {
            console.error('Error loading journal entry:', error);
        }
    };

    const toggleExpand = () => {
        const toValue = isExpanded ? 0 : 1;
        setIsExpanded(!isExpanded);

        if (reduceMotion) {
            animationController.setValue(toValue);
            return;
        }

        Animated.timing(animationController, {
            toValue,
            // Closing is quicker than opening: the user already knows what is
            // behind them, they just want it out of the way.
            duration: toValue === 1 ? motion.durationBase : 180,
            useNativeDriver: false,
        }).start();
    };

    const onMeasureContent = useCallback((e: LayoutChangeEvent) => {
        const h = Math.round(e.nativeEvent.layout.height);
        setContentHeight(prev => (Math.abs(prev - h) > 1 ? h : prev));
    }, []);

    const handleSave = async () => {
        if (journalText === savedText) return;

        setIsSaving(true);
        try {
            await StorageService.saveJournalEntry(currentDate, journalText);
            setSavedText(journalText);
            setShowSavedConfirmation(true);
            setTimeout(() => setShowSavedConfirmation(false), 2000);
        } catch {
            Alert.alert('Couldn’t save', 'Your reflection didn’t save. Try again in a moment.');
        } finally {
            setIsSaving(false);
        }
    };

    const bodyHeight = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, contentHeight || 1],
    });

    const hasUnsavedChanges = journalText !== savedText;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggleExpand}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Today’s Reflection"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityHint={isExpanded ? 'Collapses the reflection' : 'Opens the reflection to write in'}
            >
                <View style={styles.headerLeft}>
                    <PenLine size={20} color={colors.accentBright} />
                    <Text style={styles.headerTitle}>Today’s Reflection</Text>
                </View>
                {isExpanded ? (
                    <ChevronUp size={20} color={colors.textSecondary} />
                ) : (
                    <ChevronDown size={20} color={colors.textSecondary} />
                )}
            </TouchableOpacity>

            <Animated.View style={[styles.body, { height: bodyHeight, opacity: animationController }]}>
                {/* Absolutely positioned so its natural height can be measured
                    without the collapsed parent constraining it. */}
                <View style={styles.measure} onLayout={onMeasureContent}>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="What are you grateful for today? A specific moment in your day that stood out that you want to give gratitude towards."
                        placeholderTextColor={colors.textMuted}
                        value={journalText}
                        onChangeText={setJournalText}
                        textAlignVertical="top"
                        accessibilityLabel="Today’s reflection"
                    />

                    <View style={styles.footer}>
                        {hasUnsavedChanges && (
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                                disabled={isSaving}
                                accessibilityRole="button"
                                accessibilityLabel={isSaving ? 'Saving reflection' : 'Save reflection'}
                                accessibilityState={{ disabled: isSaving, busy: isSaving }}
                            >
                                <Check size={16} color={colors.onAccent} />
                                <Text style={styles.saveButtonText}>
                                    {isSaving ? 'Saving…' : 'Save Entry'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {showSavedConfirmation && !hasUnsavedChanges && (
                            <Text style={styles.savedText} accessibilityLiveRegion="polite">Saved</Text>
                        )}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: radius.lg,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...elevation.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // Was a solid accent fill, which put the journal at the same visual
        // weight as the primary CTA and the completed tiles.
        backgroundColor: colors.surfaceAlt,
        padding: spacing.lg,
        minHeight: 56,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    headerTitle: {
        ...type.h4,
        color: colors.textPrimary,
    },
    body: {
        overflow: 'hidden',
    },
    measure: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    input: {
        ...type.body,
        padding: spacing.lg,
        color: colors.textPrimary,
        minHeight: 150,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        minHeight: 44,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        gap: spacing.sm,
        minHeight: 44,
    },
    saveButtonText: {
        ...type.bodySmStrong,
        color: colors.onAccent,
    },
    savedText: {
        ...type.bodySmStrong,
        color: colors.success,
    },
});

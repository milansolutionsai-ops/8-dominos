import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { ChevronDown, ChevronUp, PenLine, Check } from 'lucide-react-native';
import { StorageService } from '../utils/storage';
import { colors, fonts, elevation } from '@/constants/theme';

interface DailyJournalProps {
    currentDate: string;
}

export default function DailyJournal({ currentDate }: DailyJournalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [journalText, setJournalText] = useState('');
    const [savedText, setSavedText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);

    const animationController = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadJournalEntry();
    }, [currentDate]);

    const loadJournalEntry = async () => {
        try {
            const entry = await StorageService.getJournalEntry(currentDate);
            if (entry) {
                setJournalText(entry);
                setSavedText(entry);
            } else {
                setJournalText('');
                setSavedText('');
            }
        } catch (error) {
            console.error('Error loading journal entry:', error);
        }
    };

    const toggleExpand = () => {
        const toValue = isExpanded ? 0 : 1;

        Animated.timing(animationController, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const handleSave = async () => {
        if (journalText === savedText) return;

        setIsSaving(true);
        try {
            await StorageService.saveJournalEntry(currentDate, journalText);
            setSavedText(journalText);
            setShowSavedConfirmation(true);

            setTimeout(() => {
                setShowSavedConfirmation(false);
            }, 2000);
        } catch (error) {
            Alert.alert('Error', 'Failed to save journal entry');
        } finally {
            setIsSaving(false);
        }
    };

    const bodyHeight = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300], // Adjust max height as needed
    });

    const hasUnsavedChanges = journalText !== savedText;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggleExpand}
                activeOpacity={0.8}
            >
                <View style={styles.headerLeft}>
                    <PenLine size={20} color={colors.onAccent} />
                    <Text style={styles.headerTitle}>Today's Journal</Text>
                </View>
                {isExpanded ? (
                    <ChevronUp size={20} color={colors.onAccent} />
                ) : (
                    <ChevronDown size={20} color={colors.onAccent} />
                )}
            </TouchableOpacity>

            <Animated.View style={[styles.body, { height: bodyHeight, opacity: animationController }]}>
                <TextInput
                    style={styles.input}
                    multiline
                    placeholder="How was your day? What did you accomplish? How do you feel?"
                    placeholderTextColor={colors.textMuted}
                    value={journalText}
                    onChangeText={setJournalText}
                    textAlignVertical="top"
                />

                <View style={styles.footer}>
                    {hasUnsavedChanges && (
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            <Check size={16} color={colors.onAccent} />
                            <Text style={styles.saveButtonText}>
                                {isSaving ? 'Saving...' : 'Save Entry'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {showSavedConfirmation && !hasUnsavedChanges && (
                        <Text style={styles.savedText}>Saved ✓</Text>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        ...elevation.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.accent,
        padding: 16,
        borderBottomWidth: 2, // Ideally this only shows when expanded, but keeping it simple
        borderBottomColor: colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: fonts.bold,
        color: colors.onAccent,
    },
    body: {
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 15,
        color: colors.textPrimary,
        fontFamily: fonts.regular,
        minHeight: 150,
    },
    footer: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        minHeight: 60,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fedd14',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000000',
        gap: 8,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
    savedText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#10b981', // Green
    },
});

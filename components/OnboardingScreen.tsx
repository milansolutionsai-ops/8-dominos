import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';
import { ArrowRight, Save } from 'lucide-react-native';
import { DominoSetupForm } from './DominoSetupForm';
import { DominoIllustration } from './DominoIllustration';
import { Domino } from '@/types/domino';
import { StorageService } from '@/utils/storage';
import { colors, fonts, elevation } from '@/constants/theme';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dominos, setDominos] = useState<Domino[]>(StorageService.createDefaultDominos());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef<any>(null);

  const steps = [
    {
      title: 'Welcome to 8 Dominos',
      subtitle: 'Track 8 key habits every day',
      content: (
        <View style={styles.welcomeContent}>
          <DominoIllustration />

          <Text style={styles.welcomeDescription}>
            Build momentum in 8 key areas of life: Body, Health, Happiness, Love, Work, Wealth, Spirituality, and Soul.
          </Text>
          <Text style={styles.welcomeSubtext}>
            Complete each domino daily to create a powerful chain reaction of positive habits.
          </Text>
          <View style={styles.nextStepHint}>
            <Text style={styles.nextStepHintText}>Next: Set up your daily activities →</Text>
          </View>
        </View >
      ),
    },
    {
      title: 'Set Up Your Dominos',
      subtitle: 'Define activities for each day of the week',
      content: (
        <DominoSetupForm
          dominos={dominos}
          onSave={(updatedDominos) => {
            setDominos(updatedDominos);
            setHasUnsavedChanges(true);
          }}
          onReset={() => setDominos(StorageService.createDefaultDominos())}
          liveUpdate={true}
        />
      ),
    },
  ];

  useEffect(() => {
    if (currentStep > 0 && hasUnsavedChanges) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          await StorageService.saveDominos(dominos);
          console.log('✅ Auto-saved dominos');
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Error auto-saving dominos:', error);
        }
      }, 1000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [dominos, currentStep, hasUnsavedChanges]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      try {
        await StorageService.saveDominos(dominos);
        console.log('✅ Saved dominos before next step');
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error('Error saving dominos:', error);
        Alert.alert('Error', 'Failed to save your activities. Please try again.');
      }
    }
  };

  const handleComplete = async () => {
    try {
      await StorageService.saveDominos(dominos);
      await StorageService.setSetupCompleted(true);
      console.log('✅ Setup completed');
      onComplete();
    } catch (error) {
      console.error('Error completing setup:', error);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.stepIndicator}>
              Step {currentStep + 1} of {steps.length}
            </Text>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
          </View>
          {currentStep > 0 && hasUnsavedChanges && (
            <View style={styles.autoSaveIndicator}>
              <Save size={12} color={colors.success} />
              <Text style={styles.autoSaveText}>Auto-saving...</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {currentStepData.content}
      </View>

      <View style={styles.footer}>
        {currentStep === 0 && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Get Started</Text>
            <ArrowRight size={20} color={colors.onAccent} />
          </TouchableOpacity>
        )}

        {isLastStep && (
          <View>
            <Text style={styles.completionHint}>✨ Your activities are being auto-saved</Text>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Setup</Text>
              <ArrowRight size={20} color={colors.onAccent} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48, // Pushed down from top bar
    paddingBottom: 24,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontWeight: '700',
    marginBottom: 8,
    opacity: 0.7,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    fontWeight: '600',
    color: colors.textPrimary,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dominoVisual: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  miniDomino: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 8,
    margin: 4,
    borderWidth: 2,
    borderColor: colors.border,
    transform: [{ rotate: '15deg' }],
    ...elevation.sm,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.onAccent,
    marginBottom: 2,
  },
  welcomeDescription: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.semibold,
    fontWeight: '600',
  },
  welcomeSubtext: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontWeight: '500',
  },
  nextStepHint: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  nextStepHintText: {
    fontSize: 15,
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48, // Lifted up from bottom navigation buttons
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    ...elevation.sm,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.onAccent,
    marginRight: 8,
    letterSpacing: 0.3,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    ...elevation.sm,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    fontWeight: '800',
    color: colors.onAccent,
    marginRight: 8,
    letterSpacing: 0.3,
  },
  completionHint: {
    fontSize: 13,
    color: colors.success,
    fontFamily: fonts.bold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  autoSaveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
  },
  autoSaveText: {
    fontSize: 11,
    color: colors.success,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
});

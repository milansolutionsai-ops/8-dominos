import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native';
import { ArrowRight, Save } from 'lucide-react-native';
import { DominoSetupForm } from './DominoSetupForm';
import { DominoIllustration } from './DominoIllustration';
import { Domino } from '@/types/domino';
import { StorageService } from '@/utils/storage';

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
              <Save size={12} color="#10b981" />
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
            <ArrowRight size={20} color="#030001" />
          </TouchableOpacity>
        )}

        {isLastStep && (
          <View>
            <Text style={styles.completionHint}>✨ Your activities are being auto-saved</Text>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Setup</Text>
              <ArrowRight size={20} color="#030001" />
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
    backgroundColor: '#fffbea',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48, // Pushed down from top bar
    paddingBottom: 24,
    backgroundColor: '#fedd14',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 8,
    opacity: 0.7,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
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
    backgroundColor: '#fedd14',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    borderWidth: 2,
    borderColor: '#000000',
    transform: [{ rotate: '15deg' }],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
    marginBottom: 2,
  },
  welcomeDescription: {
    fontSize: 17,
    lineHeight: 26,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  welcomeSubtext: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666',
    textAlign: 'center',
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
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48, // Lifted up from bottom navigation buttons
    backgroundColor: '#fffbea',
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fedd14',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fedd14',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  completionHint: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  autoSaveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
  },
  autoSaveText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '700',
  },
});
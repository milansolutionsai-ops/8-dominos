import React, { useState, useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { StorageService } from '@/utils/storage';
import QuoteSplash from '@/components/QuoteSplash';

export default function Index() {
  const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const completed = await StorageService.getSetupCompleted();
      setSetupCompleted(completed);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setSetupCompleted(false);
    }
  };

  const handleSetupComplete = () => {
    setSetupCompleted(true);
  };

  if (showSplash) {
    return <QuoteSplash onComplete={() => setShowSplash(false)} />;
  }

  if (setupCompleted === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffbea' }}>
        <ActivityIndicator size="large" color="#fedd14" />
      </View>
    );
  }

  if (setupCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <OnboardingScreen onComplete={handleSetupComplete} />
  );
}
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { soundEffects } from '@/utils/soundEffects';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    try {
      soundEffects.initialize();
      soundEffects.loadAllSounds();
      console.log('✅ Sound effects initialized');
    } catch (error) {
      console.error('Error initializing sound effects:', error);
    }

    return () => {
      try {
        soundEffects.cleanup();
      } catch (error) {
        console.error('Error cleaning up sound effects:', error);
      }
    };
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

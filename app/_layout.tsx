import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { soundEffects } from '@/utils/soundEffects';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

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

  if (!fontsLoaded) {
    return null;
  }

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

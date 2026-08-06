import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { soundEffects } from '@/utils/soundEffects';
import { colors } from '@/constants/theme';

// Hold the native splash until Poppins has resolved, otherwise the splash
// dismisses into an empty frame while the fonts load.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
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

  const onLayout = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Painted under the still-visible native splash, so there is no white flash.
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={onLayout}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* The app is dark-only, so the status bar is always light. "auto" reads
          the device appearance and draws dark glyphs on our navy in Light mode. */}
      <StatusBar style="light" />
    </View>
  );
}

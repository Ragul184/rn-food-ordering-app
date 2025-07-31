import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';

import useAuthStore from '@/store/auth.store';
import * as Sentry from '@sentry/react-native';
import './globals.css';

Sentry.init({
  dsn: 'https://c4101fe514d2b61b0489be963f9b1713@o4509755175075840.ingest.us.sentry.io/4509755234844672',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  // Load custom fonts
  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "Quicksand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
    "SpaceMono-Regular": require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
    console.log("Fonts loaded successfully");
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [fetchAuthenticatedUser]);

  if (!fontsLoaded || isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
});
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AppStoreProvider } from '@/state/app-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStoreProvider>
        <Stack
          screenOptions={{
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}>
          <Stack.Screen name="index" options={{ title: 'Minderly' }} />
          <Stack.Screen name="paste-message" options={{ title: 'Paste Message' }} />
          <Stack.Screen name="scan-letter" options={{ title: 'Scan Letter' }} />
          <Stack.Screen name="result" options={{ title: 'Result' }} />
          <Stack.Screen name="create-reminder" options={{ title: 'Create Reminder' }} />
          <Stack.Screen name="reminders" options={{ title: 'My Reminders' }} />
        </Stack>
      </AppStoreProvider>
    </ThemeProvider>
  );
}

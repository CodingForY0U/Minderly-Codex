import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { InfoCard } from '@/components/info-card';
import { PrimaryButton } from '@/components/primary-button';
import { ReminderCard } from '@/components/reminder-card';
import { ScreenShell } from '@/components/screen-shell';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/state/app-store';

export default function RemindersScreen() {
  const theme = useTheme();
  const { reminders, toggleReminderDone } = useAppStore();

  return (
    <ScreenShell>
      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 28, lineHeight: 36, fontWeight: '800' }}>
          Saved reminders
        </Text>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 19, lineHeight: 28 }}>
          Marking a reminder as done cancels its saved notification.
        </Text>
      </View>

      {reminders.length === 0 ? (
        <>
          <InfoCard label="No reminders yet" value="Create a reminder from a pasted or scanned message." />
          <PrimaryButton onPress={() => router.replace({ pathname: '/' })}>Go Home</PrimaryButton>
        </>
      ) : (
        <View style={{ gap: Spacing.three }}>
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggleDone={() => void toggleReminderDone(reminder.id)}
            />
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

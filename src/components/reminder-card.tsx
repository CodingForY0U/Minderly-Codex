import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Reminder } from '@/types/domain';

function formatReminderTime(value: string | null) {
  if (!value) {
    return 'No date set';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ReminderCard({
  reminder,
  onToggleDone,
}: {
  reminder: Reminder;
  onToggleDone: () => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        gap: Spacing.two,
        padding: Spacing.three,
        borderRadius: 8,
        borderCurve: 'continuous',
        backgroundColor: theme.backgroundElement,
        borderWidth: 1,
        borderColor: theme.border,
        opacity: reminder.isDone ? 0.58 : 1,
      }}>
      <Text selectable style={{ color: theme.text, fontSize: 23, lineHeight: 30, fontWeight: '800' }}>
        {reminder.title}
      </Text>
      <Text selectable style={{ color: theme.textSecondary, fontSize: 18, lineHeight: 25 }}>
        {formatReminderTime(reminder.scheduledAt)}
      </Text>
      {!!reminder.location && (
        <Text selectable style={{ color: theme.text, fontSize: 18, lineHeight: 25 }}>
          {reminder.location}
        </Text>
      )}
      {!!reminder.notes && (
        <Text selectable style={{ color: theme.textSecondary, fontSize: 17, lineHeight: 24 }}>
          {reminder.notes}
        </Text>
      )}
      <PrimaryButton variant={reminder.isDone ? 'secondary' : 'primary'} onPress={onToggleDone}>
        {reminder.isDone ? 'Mark as Not Done' : 'Mark as Done'}
      </PrimaryButton>
    </View>
  );
}

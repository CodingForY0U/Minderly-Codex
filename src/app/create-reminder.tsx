import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { InfoCard } from '@/components/info-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/state/app-store';

function parseSuggestedDate(dateText?: string, timeText?: string) {
  const fallback = new Date(Date.now() + 60 * 60 * 1000);
  fallback.setSeconds(0, 0);

  if (!dateText) {
    return fallback;
  }

  const numericDate = dateText.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (!numericDate) {
    return fallback;
  }

  const day = Number(numericDate[1]);
  const month = Number(numericDate[2]) - 1;
  const year = Number(numericDate[3].length === 2 ? `20${numericDate[3]}` : numericDate[3]);
  const suggested = new Date(year, month, day);

  const time = timeText?.match(/^(\d{1,2})(?::(\d{2}))?\s?(AM|PM|am|pm)?$/);
  if (time) {
    let hour = Number(time[1]);
    const minute = Number(time[2] ?? 0);
    const period = time[3]?.toLowerCase();

    if (period === 'pm' && hour < 12) {
      hour += 12;
    }
    if (period === 'am' && hour === 12) {
      hour = 0;
    }

    suggested.setHours(hour, minute, 0, 0);
  } else {
    suggested.setHours(9, 0, 0, 0);
  }

  return Number.isNaN(suggested.getTime()) ? fallback : suggested;
}

function formatForEditing(value: Date) {
  return value.toISOString().slice(0, 16);
}

export default function CreateReminderScreen() {
  const theme = useTheme();
  const { currentParsedMessage, addReminder } = useAppStore();
  const initialDate = React.useMemo(
    () => parseSuggestedDate(currentParsedMessage?.dateText, currentParsedMessage?.timeText),
    [currentParsedMessage?.dateText, currentParsedMessage?.timeText]
  );
  const [title, setTitle] = React.useState(
    currentParsedMessage?.organisation
      ? `${currentParsedMessage.organisation} reminder`
      : 'Important reminder'
  );
  const [scheduledAt, setScheduledAt] = React.useState(initialDate);
  const [location, setLocation] = React.useState(currentParsedMessage?.location ?? '');
  const [notes, setNotes] = React.useState(
    currentParsedMessage?.actionNeeded ?? currentParsedMessage?.simplifiedExplanation ?? ''
  );
  const [checkedDetails, setCheckedDetails] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  async function saveReminder() {
    if (!title.trim()) {
      Alert.alert('Add a title', 'Please enter a reminder title.');
      return;
    }

    if (!checkedDetails) {
      Alert.alert('Check the reminder first', 'Please review and confirm the details before saving.');
      return;
    }

    setIsSaving(true);
    await addReminder({
      title: title.trim(),
      scheduledAt: scheduledAt.toISOString(),
      location: location.trim() || undefined,
      notes: notes.trim(),
      sourceMessageId: currentParsedMessage?.id,
    });
    setIsSaving(false);
    router.replace({ pathname: '/reminders' });
  }

  return (
    <ScreenShell>
      <InfoCard
        label="Manual check"
        value="Please edit the reminder details before saving. Demo extraction may be wrong."
        tone="important"
      />

      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, lineHeight: 26, fontWeight: '700' }}>
          Reminder title
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Reminder title"
          placeholderTextColor={theme.textSecondary}
          style={{
            minHeight: 58,
            borderRadius: 8,
            borderCurve: 'continuous',
            backgroundColor: theme.backgroundElement,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            fontSize: 21,
            padding: Spacing.three,
          }}
        />
      </View>

      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, lineHeight: 26, fontWeight: '700' }}>
          Date and time
        </Text>
        {process.env.EXPO_OS === 'web' ? (
          <TextInput
            value={formatForEditing(scheduledAt)}
            onChangeText={(value) => {
              const nextDate = new Date(value);
              if (!Number.isNaN(nextDate.getTime())) {
                setScheduledAt(nextDate);
              }
            }}
            placeholder="2026-06-28T09:30"
            placeholderTextColor={theme.textSecondary}
            style={{
              minHeight: 58,
              borderRadius: 8,
              borderCurve: 'continuous',
              backgroundColor: theme.backgroundElement,
              borderWidth: 1,
              borderColor: theme.border,
              color: theme.text,
              fontSize: 21,
              padding: Spacing.three,
            }}
          />
        ) : (
          <View style={{ gap: Spacing.two }}>
            <DateTimePicker
              mode="date"
              value={scheduledAt}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  const nextDate = new Date(scheduledAt);
                  nextDate.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                  );
                  setScheduledAt(nextDate);
                }
              }}
            />
            <DateTimePicker
              mode="time"
              value={scheduledAt}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  const nextDate = new Date(scheduledAt);
                  nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
                  setScheduledAt(nextDate);
                }
              }}
            />
          </View>
        )}
      </View>

      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, lineHeight: 26, fontWeight: '700' }}>
          Location
        </Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Clinic, block, room, or address"
          placeholderTextColor={theme.textSecondary}
          style={{
            minHeight: 58,
            borderRadius: 8,
            borderCurve: 'continuous',
            backgroundColor: theme.backgroundElement,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            fontSize: 21,
            padding: Spacing.three,
          }}
        />
      </View>

      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, lineHeight: 26, fontWeight: '700' }}>
          Notes
        </Text>
        <TextInput
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="What should the user do?"
          placeholderTextColor={theme.textSecondary}
          textAlignVertical="top"
          style={{
            minHeight: 150,
            borderRadius: 8,
            borderCurve: 'continuous',
            backgroundColor: theme.backgroundElement,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            fontSize: 21,
            lineHeight: 30,
            padding: Spacing.three,
          }}
        />
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: checkedDetails }}
        onPress={() => setCheckedDetails((value) => !value)}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.two,
          padding: Spacing.three,
          borderRadius: 8,
          borderCurve: 'continuous',
          backgroundColor: theme.backgroundElement,
          borderWidth: 1,
          borderColor: checkedDetails ? theme.accent : theme.border,
          opacity: pressed ? 0.72 : 1,
        })}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: checkedDetails ? theme.accent : theme.textSecondary,
            backgroundColor: checkedDetails ? theme.accent : 'transparent',
          }}
        />
        <Text selectable style={{ flex: 1, color: theme.text, fontSize: 19, lineHeight: 26 }}>
          I checked and edited the reminder details.
        </Text>
      </Pressable>

      <PrimaryButton disabled={isSaving || !checkedDetails} onPress={() => void saveReminder()}>
        {isSaving ? 'Saving Reminder...' : 'Save Reminder'}
      </PrimaryButton>
    </ScreenShell>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Reminder } from '@/types/domain';

const remindersKey = 'minderly.reminders';

export async function loadStoredReminders() {
  const rawValue = await AsyncStorage.getItem(remindersKey);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Reminder[];
  } catch {
    return [];
  }
}

export async function saveStoredReminders(reminders: Reminder[]) {
  await AsyncStorage.setItem(remindersKey, JSON.stringify(reminders));
}

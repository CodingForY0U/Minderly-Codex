import React from 'react';

import { defaultLanguage, getLanguagePreference } from '@/constants/languages';
import { cancelReminderNotification, scheduleReminderNotification } from '@/services/notifications';
import { loadStoredLanguagePreference, saveStoredLanguagePreference } from '@/storage/preference-storage';
import { loadStoredReminders, saveStoredReminders } from '@/storage/reminder-storage';
import type { LanguageCode, ParsedMessage, Reminder, UserLanguagePreference } from '@/types/domain';

type ReminderInput = Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'isDone' | 'notificationId'>;

interface AppStoreValue {
  currentParsedMessage: ParsedMessage | null;
  languagePreference: UserLanguagePreference;
  reminders: Reminder[];
  setCurrentParsedMessage: (message: ParsedMessage | null) => void;
  setLanguagePreference: (code: LanguageCode) => Promise<void>;
  addReminder: (input: ReminderInput) => Promise<Reminder>;
  toggleReminderDone: (id: string) => Promise<void>;
}

const AppStoreContext = React.createContext<AppStoreValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortReminders(reminders: Reminder[]) {
  return [...reminders].sort((first, second) => {
    if (first.isDone !== second.isDone) {
      return first.isDone ? 1 : -1;
    }

    return (first.scheduledAt ?? first.createdAt).localeCompare(second.scheduledAt ?? second.createdAt);
  });
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentParsedMessage, setCurrentParsedMessage] = React.useState<ParsedMessage | null>(null);
  const [languagePreference, setLanguagePreferenceState] = React.useState(defaultLanguage);
  const [reminders, setReminders] = React.useState<Reminder[]>([]);

  React.useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const [storedReminders, storedLanguage] = await Promise.all([
        loadStoredReminders(),
        loadStoredLanguagePreference(),
      ]);

      if (isMounted) {
        setReminders(sortReminders(storedReminders));
        setLanguagePreferenceState(storedLanguage);
      }
    }

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguagePreference = React.useCallback(async (code: LanguageCode) => {
    setLanguagePreferenceState(getLanguagePreference(code));
    await saveStoredLanguagePreference(code);
  }, []);

  const persistReminders = React.useCallback(async (nextReminders: Reminder[]) => {
    const sorted = sortReminders(nextReminders);
    setReminders(sorted);
    await saveStoredReminders(sorted);
  }, []);

  const addReminder = React.useCallback(
    async (input: ReminderInput) => {
      const now = new Date().toISOString();
      const scheduledDate = input.scheduledAt ? new Date(input.scheduledAt) : null;
      const notificationId = await scheduleReminderNotification({
        title: input.title,
        body: input.location ? `${input.location}. ${input.notes}` : input.notes,
        scheduledAt: scheduledDate,
      });

      const reminder: Reminder = {
        ...input,
        id: createId('reminder'),
        notificationId,
        isDone: false,
        createdAt: now,
        updatedAt: now,
      };

      await persistReminders([...reminders, reminder]);
      return reminder;
    },
    [persistReminders, reminders]
  );

  const toggleReminderDone = React.useCallback(
    async (id: string) => {
      const reminder = reminders.find((item) => item.id === id);
      if (!reminder) {
        return;
      }

      const nextDoneState = !reminder.isDone;
      if (nextDoneState) {
        await cancelReminderNotification(reminder.notificationId);
      }

      await persistReminders(
        reminders.map((item) =>
          item.id === id
            ? {
                ...item,
                isDone: nextDoneState,
                notificationId: nextDoneState ? undefined : item.notificationId,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    },
    [persistReminders, reminders]
  );

  const value = React.useMemo(
    () => ({
      currentParsedMessage,
      languagePreference,
      reminders,
      setCurrentParsedMessage,
      setLanguagePreference,
      addReminder,
      toggleReminderDone,
    }),
    [
      addReminder,
      currentParsedMessage,
      languagePreference,
      reminders,
      setLanguagePreference,
      toggleReminderDone,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const value = React.use(AppStoreContext);
  if (!value) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }

  return value;
}

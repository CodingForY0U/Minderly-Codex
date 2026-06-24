import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleReminderNotification({
  title,
  body,
  scheduledAt,
}: {
  title: string;
  body: string;
  scheduledAt: Date | null;
}) {
  if (!scheduledAt || scheduledAt.getTime() <= Date.now()) {
    return undefined;
  }

  if (process.env.EXPO_OS === 'web') {
    return undefined;
  }

  try {
    const permissions = await Notifications.getPermissionsAsync();
    const finalStatus =
      permissions.status === 'granted' ? permissions.status : (await Notifications.requestPermissionsAsync()).status;

    if (finalStatus !== 'granted') {
      return undefined;
    }

    if (process.env.EXPO_OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledAt,
        channelId: 'reminders',
      },
    });
  } catch {
    return undefined;
  }
}

export async function cancelReminderNotification(notificationId?: string) {
  if (!notificationId) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Local reminder state should still update even if the OS notification cannot be cancelled.
  }
}

import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { InfoCard } from '@/components/info-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { speakExplanation, stopSpeech } from '@/services/speech';
import { useAppStore } from '@/state/app-store';

export default function ResultScreen() {
  const theme = useTheme();
  const { currentParsedMessage } = useAppStore();

  React.useEffect(() => {
    return () => {
      void stopSpeech();
    };
  }, []);

  if (!currentParsedMessage) {
    return (
      <ScreenShell>
        <InfoCard label="No message yet" value="Paste or scan a message first." tone="important" />
        <PrimaryButton onPress={() => router.replace({ pathname: '/' })}>Go Home</PrimaryButton>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 28, lineHeight: 36, fontWeight: '800' }}>
          Simple explanation
        </Text>
        <Text selectable style={{ color: theme.text, fontSize: 23, lineHeight: 34, fontWeight: '600' }}>
          {currentParsedMessage.simplifiedExplanation}
        </Text>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 17, lineHeight: 24 }}>
          Audio uses mock spoken text for the selected language. This MVP does not perform real
          translation.
        </Text>
      </View>

      <PrimaryButton
        onPress={() =>
          void speakExplanation(
            currentParsedMessage.spokenText,
            currentParsedMessage.listeningLanguage
          )
        }>
        Play Explanation
      </PrimaryButton>

      <View style={{ gap: Spacing.two }}>
        <InfoCard label="Date" value={currentParsedMessage.dateText} />
        <InfoCard label="Time" value={currentParsedMessage.timeText} />
        <InfoCard label="Location" value={currentParsedMessage.location} />
        <InfoCard label="Sender or organisation" value={currentParsedMessage.organisation} />
        <InfoCard label="Action needed" value={currentParsedMessage.actionNeeded} tone="important" />
      </View>

      <PrimaryButton onPress={() => router.push({ pathname: '/create-reminder' })}>
        Create Reminder
      </PrimaryButton>
    </ScreenShell>
  );
}

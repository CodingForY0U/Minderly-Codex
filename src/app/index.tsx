import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';

import { InfoCard } from '@/components/info-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { WEB_DEMO_URL, hasWebDemoUrl } from '@/constants/demo-url';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();

  function goTo(pathnameToOpen: '/paste-message' | '/scan-letter' | '/reminders') {
    router.push({ pathname: pathnameToOpen });
  }

  function openWebDemo() {
    void Linking.openURL(WEB_DEMO_URL);
  }

  return (
    <ScreenShell>
      <View style={{ gap: Spacing.two }}>
        <Text
          selectable
          style={{
            color: theme.text,
            fontSize: 34,
            lineHeight: 42,
            fontWeight: '800',
          }}>
          Understand messages with help
        </Text>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 21, lineHeight: 30 }}>
          Paste or demo-scan an important message, then hear a simple explanation and save a
          reminder.
        </Text>
      </View>

      <InfoCard
        label="Privacy"
        value="Your messages are only processed when you paste or scan them."
        tone="important"
      />

      <View style={{ gap: Spacing.three }}>
        <PrimaryButton onPress={() => goTo('/paste-message')}>
          Paste Message
        </PrimaryButton>
        <PrimaryButton variant="secondary" onPress={() => goTo('/scan-letter')}>
          Scan Letter
        </PrimaryButton>
        <PrimaryButton variant="secondary" onPress={() => goTo('/reminders')}>
          My Reminders
        </PrimaryButton>
        {hasWebDemoUrl && (
          <PrimaryButton variant="secondary" onPress={openWebDemo}>
            Try Online Demo
          </PrimaryButton>
        )}
      </View>
    </ScreenShell>
  );
}

import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import { LanguageSelector } from '@/components/language-selector';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseMessageText } from '@/services/mock-message-parser';
import { useAppStore } from '@/state/app-store';
import type { LanguageCode } from '@/types/domain';

export default function PasteMessageScreen() {
  const theme = useTheme();
  const { languagePreference, setCurrentParsedMessage, setLanguagePreference } = useAppStore();
  const [message, setMessage] = React.useState('');
  const [language, setLanguage] = React.useState<LanguageCode>(languagePreference.code);

  function explainMessage() {
    if (!message.trim()) {
      Alert.alert('Add a message first', 'Paste the SMS, WhatsApp text, or copied message.');
      return;
    }

    const parsed = parseMessageText({ text: message, source: 'paste', language });
    setCurrentParsedMessage(parsed);
    void setLanguagePreference(language);
    router.push({ pathname: '/result' });
  }

  return (
    <ScreenShell>
      <Text selectable style={{ color: theme.textSecondary, fontSize: 20, lineHeight: 28 }}>
        Paste the full message here. The demo will make a simple explanation, but it will not
        contact a translation service.
      </Text>

      <LanguageSelector
        value={language}
        onChange={(nextLanguage) => {
          setLanguage(nextLanguage);
          void setLanguagePreference(nextLanguage);
        }}
      />

      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, lineHeight: 26, fontWeight: '700' }}>
          Message text
        </Text>
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder="Example: NUH appointment on 28/06/2026 at 9:30 AM..."
          placeholderTextColor={theme.textSecondary}
          textAlignVertical="top"
          style={{
            minHeight: 220,
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

      <PrimaryButton onPress={explainMessage}>Explain Message</PrimaryButton>
    </ScreenShell>
  );
}

import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import { InfoCard } from '@/components/info-card';
import { LanguageSelector } from '@/components/language-selector';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseMessageText } from '@/services/mock-message-parser';
import { readDemoOcrText } from '@/services/mock-ocr';
import { useAppStore } from '@/state/app-store';
import type { LanguageCode } from '@/types/domain';

export default function ScanLetterScreen() {
  const theme = useTheme();
  const { languagePreference, setCurrentParsedMessage, setLanguagePreference } = useAppStore();
  const [language, setLanguage] = React.useState<LanguageCode>(languagePreference.code);
  const [ocrText, setOcrText] = React.useState('');
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  async function fillDemoOcrText(result: ImagePicker.ImagePickerResult) {
    if (result.canceled) {
      return;
    }

    setImageUri(result.assets[0]?.uri ?? null);
    setOcrText(await readDemoOcrText());
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Please allow camera access to take a photo.');
      return;
    }

    await fillDemoOcrText(await ImagePicker.launchCameraAsync({ quality: 0.8 }));
  }

  async function choosePhoto() {
    await fillDemoOcrText(await ImagePicker.launchImageLibraryAsync({ quality: 0.8 }));
  }

  function explainMessage() {
    if (!ocrText.trim()) {
      Alert.alert('Add demo OCR text first', 'Take or choose a photo, then check the OCR preview.');
      return;
    }

    const parsed = parseMessageText({ text: ocrText, source: 'scan', language });
    setCurrentParsedMessage(parsed);
    void setLanguagePreference(language);
    router.push({ pathname: '/result' });
  }

  return (
    <ScreenShell>
      <InfoCard
        label="Demo OCR"
        value="For this MVP, the app fills sample OCR text after you take or choose a photo. You can edit it before continuing."
        tone="important"
      />

      <LanguageSelector
        value={language}
        onChange={(nextLanguage) => {
          setLanguage(nextLanguage);
          void setLanguagePreference(nextLanguage);
        }}
      />

      <View style={{ gap: Spacing.two }}>
        <PrimaryButton onPress={takePhoto}>Take Photo</PrimaryButton>
        <PrimaryButton variant="secondary" onPress={choosePhoto}>
          Choose Photo
        </PrimaryButton>
      </View>

      {!!imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: '100%',
            aspectRatio: 4 / 3,
            borderRadius: 8,
            backgroundColor: theme.backgroundElement,
          }}
        />
      )}

      <View style={{ gap: Spacing.two }}>
        <Text selectable style={{ color: theme.text, fontSize: 19, lineHeight: 26, fontWeight: '700' }}>
          Demo OCR preview
        </Text>
        <TextInput
          multiline
          value={ocrText}
          onChangeText={setOcrText}
          placeholder="Demo OCR text will appear here."
          placeholderTextColor={theme.textSecondary}
          textAlignVertical="top"
          style={{
            minHeight: 190,
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

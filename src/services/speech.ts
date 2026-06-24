import * as Speech from 'expo-speech';

import { getLanguagePreference } from '@/constants/languages';
import type { LanguageCode } from '@/types/domain';

export async function speakExplanation(text: string, language: LanguageCode) {
  await Speech.stop();
  const preference = getLanguagePreference(language);

  Speech.speak(text, {
    language: preference.speechLanguage,
    pitch: 1,
    rate: 0.86,
  });
}

export async function stopSpeech() {
  await Speech.stop();
}

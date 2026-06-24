import AsyncStorage from '@react-native-async-storage/async-storage';

import { defaultLanguage, getLanguagePreference } from '@/constants/languages';
import type { LanguageCode } from '@/types/domain';

const languageKey = 'minderly.language';

export async function loadStoredLanguagePreference() {
  const rawValue = (await AsyncStorage.getItem(languageKey)) as LanguageCode | null;
  return rawValue ? getLanguagePreference(rawValue) : defaultLanguage;
}

export async function saveStoredLanguagePreference(code: LanguageCode) {
  await AsyncStorage.setItem(languageKey, code);
}

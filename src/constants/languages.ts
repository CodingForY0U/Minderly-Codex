import type { LanguageCode, UserLanguagePreference } from '@/types/domain';

export const languageOptions: UserLanguagePreference[] = [
  { code: 'en-SG', label: 'English', speechLanguage: 'en-SG' },
  { code: 'zh-SG', label: 'Mandarin', speechLanguage: 'zh-SG' },
  { code: 'ms-SG', label: 'Malay', speechLanguage: 'ms-SG' },
  { code: 'ta-SG', label: 'Tamil', speechLanguage: 'ta-SG' },
];

export const defaultLanguage = languageOptions[0];

export function getLanguagePreference(code: LanguageCode) {
  return languageOptions.find((language) => language.code === code) ?? defaultLanguage;
}

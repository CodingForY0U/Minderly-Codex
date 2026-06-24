export type MessageSource = 'paste' | 'scan';

export type LanguageCode = 'en-SG' | 'zh-SG' | 'ms-SG' | 'ta-SG';

export interface UserLanguagePreference {
  code: LanguageCode;
  label: string;
  speechLanguage: string;
}

export interface ParsedMessage {
  id: string;
  source: MessageSource;
  originalText: string;
  listeningLanguage: LanguageCode;
  simplifiedExplanation: string;
  spokenText: string;
  sender?: string;
  organisation?: string;
  dateText?: string;
  timeText?: string;
  location?: string;
  actionNeeded?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  scheduledAt: string | null;
  location?: string;
  notes: string;
  sourceMessageId?: string;
  notificationId?: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

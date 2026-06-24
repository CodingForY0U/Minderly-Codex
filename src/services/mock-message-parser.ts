import type { LanguageCode, MessageSource, ParsedMessage } from '@/types/domain';

const organisationNames = ['NUH', 'SGH', 'SingHealth', 'Polyclinic', 'HDB', 'CPF'];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function findFirstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
    if (match?.[0]) {
      return match[0].trim();
    }
  }
  return undefined;
}

function findOrganisation(text: string) {
  const found = organisationNames.find((name) => text.toLowerCase().includes(name.toLowerCase()));
  if (found) {
    return found;
  }

  const sender = text.match(/^([A-Z][A-Za-z0-9 &-]{1,24}):/);
  return sender?.[1]?.trim();
}

function buildSpokenText(language: LanguageCode, organisation: string, date?: string, time?: string, location?: string) {
  const detailLine = `Organisation: ${organisation}. Date: ${date ?? 'please check the message'}. Time: ${time ?? 'please check the message'}. Place: ${location ?? 'please check the message'}.`;

  if (language === 'zh-SG') {
    return `模拟中文说明。这是一则重要通知。请和家人确认这些资料。${detailLine}`;
  }

  if (language === 'ms-SG') {
    return `Ini penerangan contoh dalam Bahasa Melayu. Ini mungkin mesej penting. Sila semak butiran ini dengan keluarga. ${detailLine}`;
  }

  if (language === 'ta-SG') {
    return `இது தமிழ் மொழியில் மாதிரி விளக்கம். இது முக்கியமான செய்தியாக இருக்கலாம். குடும்பத்துடன் விவரங்களை சரிபார்க்கவும். ${detailLine}`;
  }

  return `This is a simple demo explanation. This may be an important message. Please check these details with someone you trust. ${detailLine}`;
}

export function parseMessageText({
  text,
  source,
  language,
}: {
  text: string;
  source: MessageSource;
  language: LanguageCode;
}): ParsedMessage {
  const cleanText = text.trim();
  const organisation = findOrganisation(cleanText) ?? 'Unknown sender';
  const dateText = findFirstMatch(cleanText, [
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/,
    /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b/i,
  ]);
  const timeText = findFirstMatch(cleanText, [/\b(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)\b/, /\b(\d{1,2}\s?(?:AM|PM|am|pm))\b/]);
  const location = findFirstMatch(cleanText, [
    /(?:at|venue:|location:|go to)\s+([A-Za-z0-9 ,#-]+?)(?:\.|, please| bring|$)/i,
    /(Clinic\s+[A-Za-z0-9 ,#-]+)/i,
  ]);
  const actionNeeded =
    findFirstMatch(cleanText, [/(bring [^.]+)/i, /(please [^.]+)/i, /(call [^.]+)/i]) ??
    'Check the details and ask a trusted person if anything is unclear.';

  const simplifiedExplanation = [
    `This message looks like it is from ${organisation}.`,
    dateText || timeText
      ? `It may be about something happening${dateText ? ` on ${dateText}` : ''}${timeText ? ` at ${timeText}` : ''}.`
      : 'It may contain an important date or instruction.',
    location ? `The place mentioned is ${location}.` : 'Please check the place before going.',
    `Action needed: ${actionNeeded}`,
  ].join(' ');

  return {
    id: createId('message'),
    source,
    originalText: cleanText,
    listeningLanguage: language,
    simplifiedExplanation,
    spokenText: buildSpokenText(language, organisation, dateText, timeText, location),
    sender: organisation,
    organisation,
    dateText,
    timeText,
    location,
    actionNeeded,
    createdAt: new Date().toISOString(),
  };
}

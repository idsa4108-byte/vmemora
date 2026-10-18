export type CategoryId =
  | 'Study'
  | 'Business'
  | 'Environment'
  | 'Travel'
  | 'Health'
  | 'Technology'
  | 'Food'
  | 'Daily Life'
  | 'Emotions'
  | 'Other';

export interface CategoryInfo {
  id: CategoryId;
  labelAr: string;
  labelEn: string;
  emoji: string;
  colorHex: string;
  pastelBg: string;
}

export interface ExampleSentence {
  example: string;
  translation?: string;
  translationAr?: string;
}

export interface MeaningItem {
  partOfSpeech: string;
  partOfSpeechEn?: string;
  meaning?: string;
  meaningAr?: string;
  definition: string;
  examples: ExampleSentence[];
}

export interface WordItem {
  id: string;
  word: string;
  phonetic: string;
  emoji: string;
  category: CategoryId;
  meanings: MeaningItem[];
  isLearned: boolean;
  isImportant: boolean;
  createdAt: number;
  language: string; // e.g. "English", "French", etc.
}

export interface SupportedLanguage {
  code: string;
  nameEn: string;
  nameAr: string;
  flag: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en-US', nameEn: 'American English', nameAr: 'الإنجليزية الأمريكية', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'en-GB', nameEn: 'British English', nameAr: 'الإنجليزية البريطانية', flag: '🇬🇧', speechCode: 'en-GB' },
];

export const CATEGORIES: CategoryInfo[] = [
  { id: 'Study', labelAr: 'دراسة', labelEn: 'Study', emoji: '📚', colorHex: '#3b82f6', pastelBg: '#dbeafe' },
  { id: 'Business', labelAr: 'أعمال', labelEn: 'Business', emoji: '💼', colorHex: '#d97706', pastelBg: '#fef3c7' },
  { id: 'Environment', labelAr: 'بيئة', labelEn: 'Environment', emoji: '🌿', colorHex: '#059669', pastelBg: '#d1fae5' },
  { id: 'Travel', labelAr: 'سفر', labelEn: 'Travel', emoji: '✈️', colorHex: '#0284c7', pastelBg: '#e0f2fe' },
  { id: 'Health', labelAr: 'صحة', labelEn: 'Health', emoji: '🩺', colorHex: '#e11d48', pastelBg: '#ffe4e6' },
  { id: 'Technology', labelAr: 'تقنية', labelEn: 'Technology', emoji: '💻', colorHex: '#7c3aed', pastelBg: '#ede9fe' },
  { id: 'Food', labelAr: 'طعام', labelEn: 'Food', emoji: '🍎', colorHex: '#ea580c', pastelBg: '#ffedd5' },
  { id: 'Daily Life', labelAr: 'حياة يومية', labelEn: 'Daily Life', emoji: '☕', colorHex: '#0d9488', pastelBg: '#ccfbf1' },
  { id: 'Emotions', labelAr: 'مشاعر', labelEn: 'Emotions', emoji: '💡', colorHex: '#db2777', pastelBg: '#fce7f3' },
  { id: 'Other', labelAr: 'أخرى', labelEn: 'Other', emoji: '📦', colorHex: '#64748b', pastelBg: '#f1f5f9' },
];

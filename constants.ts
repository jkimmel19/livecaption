import { LanguageCode, LanguageOption } from './types';

// export const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17'; // Removed Gemini model

export const LANGUAGES: LanguageOption[] = [
  { code: LanguageCode.ENGLISH_US, name: 'English (US)' },
  { code: LanguageCode.HEBREW, name: 'עברית (Hebrew)' },
];

export const LANGUAGE_MAP: Record<string, { name: string, nativeName: string }> = {
  [LanguageCode.ENGLISH_US]: { name: 'English', nativeName: 'English (US)' },
  [LanguageCode.HEBREW]: { name: 'Hebrew', nativeName: 'עברית' },
};

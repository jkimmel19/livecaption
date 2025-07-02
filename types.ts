
export enum LanguageCode {
  ENGLISH_US = 'en-US',
  HEBREW = 'he-IL',
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
}

// This is for SpeechRecognitionEvent, as it might not be globally typed perfectly in all environments.
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface CustomSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onaudiostart: (() => void) | null;
  onaudioend: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null; // Using 'any' for SpeechRecognitionErrorEvent for simplicity
  onnomatch: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onsoundstart: (() => void) | null;
  onsoundend: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: (new () => CustomSpeechRecognition) | undefined;
    webkitSpeechRecognition: (new () => CustomSpeechRecognition) | undefined;
  }
}

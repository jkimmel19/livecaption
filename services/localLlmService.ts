import { LanguageCode } from '../types';
import { LANGUAGE_MAP } from '../constants';
import { 
  LOCAL_LLM_API_BASE_URL, 
  LOCAL_TRANSLATE_MODEL, 
  LOCAL_STT_API_ENDPOINT,
  LOCAL_STT_MODEL 
} from './localLlmConfig';

export interface ServiceStatus {
  llmServiceOk: boolean;
  sttServiceOk: boolean;
  llmServiceError?: string;
  sttServiceError?: string;
}

export const checkServiceAvailability = async (): Promise<ServiceStatus> => {
  const status: ServiceStatus = {
    llmServiceOk: false,
    sttServiceOk: false,
  };

  if (!LOCAL_LLM_API_BASE_URL || LOCAL_LLM_API_BASE_URL === 'http://localhost:11434/v1_example') {
    status.llmServiceOk = false;
    status.llmServiceError = "LLM service URL is not configured in services/localLlmConfig.ts.";
  } else {
    try {
      // For Ollama, /api/tags or similar might be a better health check if /v1 itself doesn't respond to GET easily
      // A simple fetch to the base should at least not throw a network error if the server is up.
      const response = await fetch(LOCAL_LLM_API_BASE_URL.replace('/v1', '/api/tags') || LOCAL_LLM_API_BASE_URL, { method: 'GET', mode: 'cors' });
      // We consider it "ok" if we get any response, even an error, as it means the server is listening.
      // A more specific health check endpoint would be better if available.
      status.llmServiceOk = response.ok || (response.status >= 400 && response.status < 600); 
      if (!status.llmServiceOk) status.llmServiceError = `LLM service at ${LOCAL_LLM_API_BASE_URL} responded with status ${response.status}.`;
    } catch (e) {
      status.llmServiceOk = false;
      status.llmServiceError = `Failed to connect to LLM service at ${LOCAL_LLM_API_BASE_URL}. Is it running? Error: ${(e as Error).message}`;
    }
  }

  if (!LOCAL_STT_API_ENDPOINT || LOCAL_STT_API_ENDPOINT === 'http://localhost:5001/transcribe_example') {
    status.sttServiceOk = false;
    status.sttServiceError = "STT service URL is not configured in services/localLlmConfig.ts.";
  } else {
    try {
      // A simple fetch to the base STT endpoint.
      // Even a 405 (Method Not Allowed) for a GET request means the server is listening.
      const response = await fetch(LOCAL_STT_API_ENDPOINT, { method: 'GET', mode: 'cors' });
      status.sttServiceOk = response.ok || (response.status >= 400 && response.status < 600) ;
      if (!status.sttServiceOk) status.sttServiceError = `STT service at ${LOCAL_STT_API_ENDPOINT} responded with status ${response.status}.`;
    } catch (e) {
      status.sttServiceOk = false;
      status.sttServiceError = `Failed to connect to STT service at ${LOCAL_STT_API_ENDPOINT}. Is it running? Error: ${(e as Error).message}`;
    }
  }
  
  return status;
};

export const translate = async (
  text: string,
  sourceLangCode: LanguageCode,
  targetLangCode: LanguageCode
): Promise<string> => {
  if (!text.trim()) {
    return "";
  }
  if (!LOCAL_LLM_API_BASE_URL || LOCAL_LLM_API_BASE_URL === 'http://localhost:11434/v1_example') {
    throw new Error("Local LLM service URL is not configured. Please update 'services/localLlmConfig.ts'.");
  }

  const sourceLangName = LANGUAGE_MAP[sourceLangCode]?.name || "the source language";
  const targetLangName = LANGUAGE_MAP[targetLangCode]?.name || "the target language";
  
  const prompt = `Translate the following text accurately from ${sourceLangName} to ${targetLangName}. Provide ONLY the translated text, without any additional explanations, introductions, or conversational phrases. If the input is a name or a term that should not be translated, return it as is or provide the common equivalent in the target language. Preserve the original meaning and tone as much as possible.\n\nText to translate: "${text}"`;

  try {
    const response = await fetch(`${LOCAL_LLM_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: LOCAL_TRANSLATE_MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: false, 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Local LLM API error (${response.status}): ${errorData.error?.message || errorData.message || 'Failed to fetch translation'}`);
    }

    const data = await response.json();
    
    const translatedText = data.choices?.[0]?.message?.content?.trim();
    if (typeof translatedText !== 'string') {
        console.error("Unexpected response structure from local LLM:", data);
        throw new Error("Local LLM returned an unexpected format for translation.");
    }
    return translatedText;

  } catch (error) {
    console.error("Local LLM API error during translation:", error);
    if (error instanceof Error) {
        throw new Error(`Local LLM API error: ${error.message}`);
    }
    throw new Error("Local LLM translation request failed with an unknown error.");
  }
};

export const transcribeAudio = async (
  audioBase64: string,
  mimeType: string,
  sourceLanguageHint?: LanguageCode
): Promise<string> => {
  if (!audioBase64) {
    return "";
  }
  if (!LOCAL_STT_API_ENDPOINT || LOCAL_STT_API_ENDPOINT === 'http://localhost:5001/transcribe_example') {
    throw new Error("Local STT service URL is not configured. Please update 'services/localLlmConfig.ts'.");
  }


  const requestBody: {
    audio_base64: string;
    mime_type: string;
    language_hint?: LanguageCode;
    model?: string | null;
  } = {
    audio_base64: audioBase64,
    mime_type: mimeType,
  };

  if (sourceLanguageHint) {
    requestBody.language_hint = sourceLanguageHint;
  }
  if (LOCAL_STT_MODEL) {
    requestBody.model = LOCAL_STT_MODEL;
  }

  try {
    const response = await fetch(LOCAL_STT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Local STT API error (${response.status}): ${errorData.message || 'Failed to fetch transcription'}`);
    }

    const data = await response.json();
    
    const transcribedText = data.transcript?.trim();
    if (typeof transcribedText !== 'string') {
        console.error("Unexpected response structure from local STT service:", data);
        throw new Error("Local STT service returned an unexpected format.");
    }
    return transcribedText;

  } catch (error) {
    console.error("Local STT API error during audio transcription:", error);
     if (error instanceof Error) {
        throw new Error(`Local STT API error: ${error.message}`);
    }
    throw new Error("Local STT API transcription request failed with an unknown error.");
  }
};
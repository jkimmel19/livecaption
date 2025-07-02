// IMPORTANT: Configure these URLs and model names to match your local LLM setup.

/**
 * Base URL for your local text generation LLM service (OpenAI-compatible API).
 * Example for Ollama: 'http://localhost:11434/'
 * Example for LM Studio: 'http://localhost:1234/'
 */
export const LOCAL_LLM_API_BASE_URL: string = 'http://localhost:11434/';

/**
 * Name of the text generation model to use for translation with your local LLM service.
 * Example for Ollama: 'llama3' or 'mistral' (ensure you have the model pulled)
 */
export const LOCAL_TRANSLATE_MODEL = 'llama3';

/**
 * Full API endpoint for your local Speech-To-Text (STT) service.
 * This is a HYPOTHETICAL endpoint. You need to set up a local STT service
 * (e.g., a local Whisper instance wrapped in an API) that accepts POST requests
 * with a JSON body like: { audio_base64: string, mime_type: string, language_hint?: string }
 * and returns JSON like: { transcript: string }
 * Example: 'http://localhost:5001/'
 */
export const LOCAL_STT_API_ENDPOINT: string = 'http://localhost:5001/';

/**
 * Optional: Specify a model name if your local STT service requires it.
 * Example: 'whisper-1' (if using an OpenAI-compatible STT endpoint) or a custom name.
 * If not needed, set to null or an empty string.
 */
export const LOCAL_STT_MODEL = 'base'; // Changed from 'whisper-1'

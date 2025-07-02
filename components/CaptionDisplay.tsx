import React from 'react';

interface CaptionDisplayProps {
  originalText: string;
  translatedText: string;
  isTranslating: boolean;
  isTranscribing?: boolean; // Optional, for desktop audio STT status
  sourceLangName: string;
  targetLangName: string;
}

const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  originalText,
  translatedText,
  isTranslating,
  isTranscribing,
  sourceLangName,
  targetLangName,
}) => {
  let originalTextDisplay;
  if (isTranscribing && !originalText) {
    originalTextDisplay = <span className="text-gray-400 italic">Transcribing audio...</span>;
  } else if (!originalText && !isTranscribing) {
    originalTextDisplay = <span className="text-gray-400">Waiting for speech...</span>;
  } else {
    originalTextDisplay = originalText;
  }

  let translatedTextDisplay;
  if (isTranslating && !translatedText) {
    translatedTextDisplay = <span className="text-gray-400 italic">Translating...</span>;
  } else if (!translatedText && !isTranslating) {
    translatedTextDisplay = <span className="text-gray-400">Waiting for translation...</span>;
  } else {
    translatedTextDisplay = translatedText;
  }


  return (
    <div className="flex-grow flex flex-col md:flex-row gap-4 p-4 bg-gray-800 bg-opacity-80 rounded-lg min-h-[120px] max-h-[300px] overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h3 className="text-sm font-semibold text-sky-400 mb-1">{sourceLangName} (Live Caption)</h3>
        <p className="text-lg text-gray-100 leading-relaxed min-h-[50px] break-words">
          {originalTextDisplay}
        </p>
      </div>
      <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-4">
        <h3 className="text-sm font-semibold text-green-400 mb-1">{targetLangName} (Translation)</h3>
        <p className={`text-xl text-gray-50 leading-relaxed min-h-[50px] break-words`}>
          {translatedTextDisplay}
        </p>
      </div>
    </div>
  );
};

export default CaptionDisplay;

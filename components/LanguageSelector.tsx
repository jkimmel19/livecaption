
import React from 'react';
import { LanguageCode, LanguageOption } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  sourceLang: LanguageCode;
  onSourceLangChange: (lang: LanguageCode) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  onSourceLangChange,
  disabled = false,
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSourceLangChange(event.target.value as LanguageCode);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sourceLang" className="text-sm text-gray-300">
        Speak:
      </label>
      <select
        id="sourceLang"
        value={sourceLang}
        onChange={handleSelectChange}
        disabled={disabled}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 p-2 appearance-none"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;

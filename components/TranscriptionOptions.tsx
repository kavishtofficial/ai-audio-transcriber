
import React from 'react';
import { TranscriptionOptions as TranscriptionOptionsType } from '../types';

interface TranscriptionOptionsProps {
  options: TranscriptionOptionsType;
  setOptions: React.Dispatch<React.SetStateAction<TranscriptionOptionsType>>;
  disabled: boolean;
}

const LANGUAGES = [
  { value: 'ar-SA', label: 'Arabic' },
  { value: 'bn-IN', label: 'Bengali' },
  { value: 'zh-CN', label: 'Chinese (Mandarin)' },
  { value: 'nl-NL', label: 'Dutch' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'pl-PL', label: 'Polish' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'ru-RU', label: 'Russian' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'tr-TR', label: 'Turkish' },
  { value: 'vi-VN', label: 'Vietnamese' },
  { value: 'other', label: 'Other Language' },
];

const Toggle: React.FC<{
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  title: string;
  subtitle: string;
}> = ({ id, name, checked, onChange, disabled, title, subtitle }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
    <span className="flex-grow flex flex-col mr-4">
      <span className="text-sm font-medium text-gray-900">{title}</span>
      <span className="text-sm text-gray-500">{subtitle}</span>
    </span>
    <label htmlFor={id} className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input type="checkbox" name={name} id={id} className="sr-only peer" checked={checked} onChange={onChange} disabled={disabled} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
  </div>
);


export const TranscriptionOptions: React.FC<TranscriptionOptionsProps> = ({ options, setOptions, disabled }) => {

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions(prev => ({ ...prev, language: e.target.value }));
  };

  const handleCustomLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, customLanguage: e.target.value }));
  };

  return (
    <div className="mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-secondary mb-4">Transcription Settings</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Audio Language
          </label>
          <select
            id="language"
            name="language"
            value={options.language}
            onChange={handleLanguageChange}
            disabled={disabled}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        
        {options.language === 'other' && (
          <div>
            <label htmlFor="customLanguage" className="block text-sm font-medium text-gray-700 mb-1">
              Specify Language
            </label>
            <input
              type="text"
              id="customLanguage"
              name="customLanguage"
              value={options.customLanguage || ''}
              onChange={handleCustomLanguageChange}
              disabled={disabled}
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Swahili"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Toggle 
                id="enablePunctuation"
                name="enablePunctuation"
                checked={options.enablePunctuation}
                onChange={handleCheckboxChange}
                disabled={disabled}
                title="Punctuation & Caps"
                subtitle="Add punctuation automatically"
            />
            <Toggle 
                id="enableDiarization"
                name="enableDiarization"
                checked={options.enableDiarization}
                onChange={handleCheckboxChange}
                disabled={disabled}
                title="Speaker Diarization"
                subtitle="Identify and label speakers"
            />
             <Toggle 
                id="enableTimestamps"
                name="enableTimestamps"
                checked={options.enableTimestamps}
                onChange={handleCheckboxChange}
                disabled={disabled || options.enableDiarization}
                title="Sentence Timestamps"
                subtitle="Add a timestamp to each sentence"
            />
        </div>
      </div>
    </div>
  );
};

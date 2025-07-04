
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TranscriptionOptions } from '../types';

/**
 * Converts a File object to a format suitable for the Gemini API.
 * This involves reading the file and converting it to a base64 string.
 */
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error("Failed to read file as a data URL."));
        return;
      }
      // The result includes the data URL prefix (e.g., "data:audio/mpeg;base64,"),
      // which needs to be removed to get the raw base64 data.
      const dataUrl = reader.result;
      const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      mimeType: file.type,
      data: await base64EncodedDataPromise,
    },
  };
};

// This list is needed to construct the prompt with the correct language name.
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
];

// Initialize the GoogleGenAI client.
// The API key is assumed to be available in process.env.API_KEY as per the requirements.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash-preview-04-17";

export const transcribeAudio = async (file: File, options: TranscriptionOptions): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for transcription.");
  }

  // Convert the audio file into a Part object for the API call.
  const audioPart = await fileToGenerativePart(file);

  // Construct a detailed text prompt based on the user's selected options.
  let languageLabel: string;
  if (options.language === 'other') {
    languageLabel = options.customLanguage || 'the user-specified language';
  } else {
    languageLabel = LANGUAGES.find(l => l.value === options.language)?.label || options.language;
  }
  
  const promptParts = [
    "You are an expert audio transcription service. Please transcribe the following audio file with the highest accuracy possible.",
    `The primary language spoken in the audio is ${languageLabel}.`,
  ];

  if (options.enablePunctuation) {
    promptParts.push("Please ensure the transcription includes accurate punctuation and capitalization.");
  } else {
    promptParts.push("The transcription should not include any punctuation or capitalization. Output everything in lowercase and without punctuation marks.");
  }

  if (options.enableDiarization) {
    promptParts.push("Please perform speaker diarization. Identify and label each speaker clearly (e.g., 'Speaker 1:', 'Speaker 2:').");
  }
  
  // Timestamps are handled as a separate option, usually exclusive of diarization.
  if (options.enableTimestamps && !options.enableDiarization) {
    promptParts.push("Please include a timestamp at the beginning of each sentence in the format [MM:SS].");
  }

  const textPart = { text: promptParts.join('\n') };

  try {
    // Call the Gemini API with both the audio and the detailed text prompt.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [audioPart, textPart] },
    });
    
    // As per guidelines, directly access the .text property for the result.
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`The AI model failed to transcribe the audio: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the transcription service.");
  }
};

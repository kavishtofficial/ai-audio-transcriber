export enum ProcessingState {
  IDLE,
  PROCESSING,
  SUCCESS,
  ERROR,
}

export interface TranscriptionOptions {
  language: string;
  customLanguage?: string;
  enablePunctuation: boolean;
  enableTimestamps: boolean;
  enableDiarization: boolean;
}

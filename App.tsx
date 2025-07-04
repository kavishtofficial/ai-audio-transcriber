
import React, { useState, useCallback } from 'react';
import { ProcessingState, TranscriptionOptions as TranscriptionOptionsType } from './types';
import { transcribeAudio } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { Icon } from '@/components/Icon';
import { TranscriptionOptions } from './components/TranscriptionOptions';

const features = [
  {
    title: "Ultra-Fast & Precise",
    description: "Transcribe audio in real-time with lightning-fast processing powered by advanced AI models. Zero delays, maximum precision."
  },
  {
    title: "100% Free Forever",
    description: "Use the tool without cost barriers. Unlimited usage. No subscriptions. No credit card. Just pure functionality."
  },
  {
    title: "120+ Languages Supported",
    description: "From English and Spanish to Japanese and Swahili — our engine handles multilingual inputs with ease."
  },
  {
    title: "Sentence Timestamps",
    description: "Pinpoint key moments with timestamps at the start of each sentence, perfect for quick navigation and referencing."
  },
  {
    title: "Speaker Diarization",
    description: "Detects and tags who said what. Ideal for interviews, podcasts, and meeting logs — no manual tracking needed."
  }
];

const App: React.FC = () => {
  const [processingState, setProcessingState] = useState<ProcessingState>(ProcessingState.IDLE);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [options, setOptions] = useState<TranscriptionOptionsType>({
    language: 'en-US',
    customLanguage: '',
    enablePunctuation: true,
    enableTimestamps: false,
    enableDiarization: false,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setAudioFile(file);
    setError('');
    setProcessingState(ProcessingState.PROCESSING);
    
    try {
      const result = await transcribeAudio(file, options);
      setTranscript(result);
      setProcessingState(ProcessingState.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setProcessingState(ProcessingState.ERROR);
      setAudioFile(null);
    }
  }, [options]);

  const handleReset = () => {
    setProcessingState(ProcessingState.IDLE);
    setAudioFile(null);
    setTranscript('');
    setError('');
  };

  const renderContent = () => {
    const disabled = processingState === ProcessingState.PROCESSING;
    switch (processingState) {
      case ProcessingState.PROCESSING:
        return <ProcessingIndicator />;
      case ProcessingState.SUCCESS:
        return audioFile && <TranscriptDisplay transcript={transcript} fileName={audioFile.name} onReset={handleReset} />;
      case ProcessingState.ERROR:
      case ProcessingState.IDLE:
      default:
        return <FileUpload onFileSelect={handleFileSelect} disabled={disabled} />;
    }
  };
  
  const disabled = processingState === ProcessingState.PROCESSING;

  return (
    <div className="min-h-screen bg-light text-secondary flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-secondary tracking-tight">
                AI Audio Transcriber
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-lg text-medium whitespace-pre-line">
              {"Upload your audio file.\nOur AI will generate a transcript for you to copy or download."}
            </p>
        </div>

        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-secondary text-center mb-6">Key Features</h2>
            <div className="space-y-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                            <Icon name="check" className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-semibold text-secondary">{feature.title}</h3>
                          <p className="mt-1 text-sm text-medium">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        { (processingState === ProcessingState.IDLE || processingState === ProcessingState.ERROR) && (
            <TranscriptionOptions 
                options={options} 
                setOptions={setOptions} 
                disabled={disabled}
            />
        )}

        <div className="bg-white rounded-xl shadow-lg p-2">
            {renderContent()}
        </div>

        {processingState === ProcessingState.ERROR && error && (
          <div className="mt-4 w-full max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </main>
      
      <footer className="text-center mt-12 text-medium text-sm">
        <p>&copy; 2025 AI Transcriber. Powered by Kavisht.</p>
        <p>
          <a href="https://www.kavisht.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Visit Our Website
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;

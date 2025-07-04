
import React, { useState, useCallback } from 'react';
import { Icon } from '@/components/Icon';

interface TranscriptDisplayProps {
  transcript: string;
  fileName: string;
  onReset: () => void;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, fileName, onReset }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(transcript).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  }, [transcript]);
  
  const handleDownload = useCallback(() => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, "")}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcript, fileName]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-secondary mb-4">Transcription Result</h3>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-medium">
            <Icon name="file-audio" className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm truncate">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary bg-primary-light rounded-md hover:bg-primary/20 transition-colors"
          >
            <Icon name="copy" className="w-4 h-4" />
            <span>{copyStatus === 'copied' ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover transition-colors"
          >
            <Icon name="download" className="w-4 h-4" />
            <span>Download (.txt)</span>
          </button>
        </div>
      </div>

      <div className="prose prose-sm max-w-none w-full p-4 bg-light rounded-md border border-gray-200">
        <p style={{ whiteSpace: 'pre-wrap' }}>{transcript}</p>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          Transcribe another file
        </button>
      </div>
    </div>
  );
};

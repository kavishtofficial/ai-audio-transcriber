
import React from 'react';

export const ProcessingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-primary-light rounded-lg text-primary-dark">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-semibold text-primary">Transcribing your audio...</p>
      <p className="text-sm text-primary/80">This may take a moment.</p>
    </div>
  );
};

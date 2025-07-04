
import React, { useState, useRef, useCallback } from 'react';
import { Icon } from '@/components/Icon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const ACCEPTED_FORMATS = "audio/mpeg, audio/wav, audio/mp4, audio/x-m4a";

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined) => {
    if (file && ACCEPTED_FORMATS.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert("Invalid file type. Please upload an MP3, WAV, or M4A file.");
    }
  }, [onFileSelect]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
       handleFile(e.target.files[0]);
       e.target.value = ''; // Reset for re-uploading same file
     }
  };

  const dropzoneClasses = `
    flex flex-col items-center justify-center w-full p-8 text-center border-2 border-dashed rounded-lg transition-colors duration-300
    ${disabled ? 'bg-gray-200 cursor-not-allowed' : 
      isDragging ? 'bg-primary-light border-primary' : 'bg-white border-gray-300 hover:border-primary cursor-pointer'
    }
  `;

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPTED_FORMATS}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div className={`text-medium transition-colors duration-300 ${isDragging ? 'text-primary' : ''}`}>
        <Icon name="upload" className="w-12 h-12 mx-auto" />
      </div>
      <p className="mt-4 text-lg font-semibold text-secondary">
        {isDragging ? 'Drop it like it\'s hot!' : 'Drag & drop audio file here'}
      </p>
      <p className="mt-1 text-sm text-medium">or click to browse</p>
      <p className="mt-4 text-xs text-gray-400">Supports: MP3, WAV, M4A</p>
    </div>
  );
};
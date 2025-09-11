import React, { useRef } from 'react';
import { UploadIcon, PaperclipIcon, TrashIcon } from './icons';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onClearFiles: () => void;
  isParsing: boolean;
  predefinedSetNames: string[];
  onLoadPredefinedSet: (setName: string) => void;
  isLoadingManifest: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  files, 
  onFilesChange, 
  onClearFiles, 
  isParsing,
  predefinedSetNames,
  onLoadPredefinedSet,
  isLoadingManifest
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesChange(Array.from(event.target.files));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isDisabled = isParsing || isLoadingManifest;

  return (
    <div className="w-1/3 max-w-sm h-full bg-gray-800 p-6 flex flex-col border-r border-gray-700 shadow-lg">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Sehested AI</h1>
        <p className="text-sm text-gray-400 mt-1">Your personal document expert.</p>
      </header>
      
      <input
        type="file"
        multiple
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isDisabled}
      />
      
      <button
        onClick={handleUploadClick}
        disabled={isDisabled}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait"
      >
        <UploadIcon />
        <span>{isParsing ? 'Processing...' : 'Upload Documents'}</span>
      </button>

      <div className="my-4 text-center">
        <span className="text-xs text-gray-500 tracking-wider">OR SELECT A DOCUMENT SET</span>
      </div>

      <div className="space-y-2 mb-4">
        {isLoadingManifest ? (
            <div className="text-center text-sm text-gray-400">Loading sets...</div>
        ) : predefinedSetNames.length > 0 ? (
            predefinedSetNames.map(name => (
            <button
                key={name}
                onClick={() => onLoadPredefinedSet(name)}
                disabled={isDisabled}
                className="w-full text-left text-sm bg-gray-700 text-gray-300 font-medium py-2 px-3 rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait"
            >
                {name}
            </button>
            ))
        ) : (
            <div className="text-center text-sm text-gray-400 p-2 bg-gray-700 rounded-md">No document sets found in metadata.json.</div>
        )}
      </div>

      <div className="mt-2 flex-grow overflow-y-auto pr-2">
        {isParsing ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-600 h-12 w-12 mb-4"></div>
            <h2 className="text-lg font-semibold">Analyzing Documents</h2>
            <p className="text-sm">Please wait while we extract the content...</p>
          </div>
        ) : files.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-300">Active Files</h2>
              <button 
                onClick={onClearFiles} 
                className="text-sm text-red-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                title="Clear all files"
              >
                <TrashIcon />
                Clear
              </button>
            </div>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="bg-gray-700 p-3 rounded-md flex items-center gap-3 text-sm animate-fade-in">
                  <PaperclipIcon className="text-gray-400 flex-shrink-0" />
                  <span className="truncate text-gray-200" title={file.name}>
                    {file.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-600 rounded-lg p-4">
            <p>No documents selected.</p>
            <p className="text-xs mt-1">Upload documents or select a set to begin.</p>
          </div>
        )}
      </div>

      <footer className="text-xs text-center text-gray-500 mt-4">
        <p>&copy; 2024 Sehested AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import type { Message } from './types';
import { startChat } from './services/geminiService';
import { extractTextFromPdf } from './utils/pdfUtils';
import { FileUpload } from './components/FileUpload';
import { ChatWindow } from './components/ChatWindow';

// Type definition for the structure of document sets in metadata.json
type DocumentSets = Record<string, { name: string; files: string[] }>;

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [documentSets, setDocumentSets] = useState<DocumentSets>({});
  const [isManifestLoading, setIsManifestLoading] = useState<boolean>(true);


  // Effect to fetch the document manifest from metadata.json on startup
  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const response = await fetch('/metadata.json');
        if (!response.ok) {
          throw new Error('Failed to load document configuration.');
        }
        const data = await response.json();
        if (!data.documentSets) {
            throw new Error('Document configuration is missing from metadata.json.');
        }
        setDocumentSets(data.documentSets);
      } catch (err) {
        console.error("Error fetching manifest:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(`Could not load document sets: ${errorMessage}`);
      } finally {
        setIsManifestLoading(false);
      }
    };
    fetchManifest();
  }, []);

  // Effect to process files whenever the 'files' state changes
  useEffect(() => {
    if (files.length > 0) {
      const processFiles = async () => {
        setIsParsing(true);
        setError(null);
        setMessages([]);
        setChatSession(null);

        try {
          const fileContents = await Promise.all(
            files.map(file => extractTextFromPdf(file))
          );
          const combinedContent = fileContents.join('\n\n---\n\n');

          const fileNames = files.map(f => f.name);
          const newChat = startChat(fileNames, combinedContent);
          setChatSession(newChat);
          setMessages([
              {
                  role: 'model',
                  text: `I've finished reading **${fileNames.join(', ')}**. What would you like to know?`
              }
          ]);
        } catch (err) {
          console.error("Error parsing PDF files:", err);
          setError("There was an error processing your documents. Please ensure they are valid PDFs and try again.");
          setFiles([]);
        } finally {
          setIsParsing(false);
        }
      };
      processFiles();
    } else {
      setChatSession(null);
      setMessages([]);
    }
  }, [files]);

  const handleFilesChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleClearFiles = () => {
    setFiles([]);
  };

  // This function now loads documents from the dynamically loaded configuration.
  const handleLoadPredefinedSet = useCallback(async (setName: string) => {
    const setInfo = documentSets[setName];
    if (!setInfo) {
      setError(`Document set "${setName}" not found.`);
      return;
    }

    if (!setInfo.files || setInfo.files.length === 0) {
      setError(`No files are listed for the "${setName}" set in metadata.json.`);
      return;
    }

    setIsParsing(true);
    setError(null);
    setMessages([]);
    setChatSession(null);

    try {
      // Fetch each PDF file from the public directory.
      const downloadedFiles = await Promise.all(
        setInfo.files.map(async (filePath) => {
          const encodedPath = encodeURI(filePath);
          const response = await fetch(encodedPath);
          if (!response.ok) {
            throw new Error(`Failed to load file: "${filePath}". The server returned a 404 (Not Found) error. This means the file path in 'metadata.json' does not match the actual file in the 'public' directory.\n\n**To fix this:**\n1. **Check the path:** Ensure the file exists at 'public${filePath}'.\n2. **Check for typos:** Spelling and capitalization must be identical.\n3. **Use simple names:** The best solution is to rename your files to use only lowercase letters and hyphens (e.g., 'my-doc.pdf'), and update 'metadata.json' to match.`);
          }
          const blob = await response.blob();
          const fileName = filePath.split('/').pop() || 'document.pdf';
          return new File([blob], fileName, { type: 'application/pdf' });
        })
      );
      setFiles(downloadedFiles);
    } catch (err) {
      console.error("Error loading predefined files:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while loading the document set.";
      setError(errorMessage);
      setIsParsing(false);
      setFiles([]);
    }
  }, [documentSets]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!chatSession) {
      setError("Please upload and process documents to start a chat session.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);

    try {
      const stream = await chatSession.sendMessageStream({ message: messageText });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunkText;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = "An error occurred while communicating with the AI. Please try again.";
      setError(errorMessage);
      setMessages(prev => {
          const newMessages = [...prev];
          if(newMessages[newMessages.length - 1].text === ''){
              newMessages.pop();
          }
          newMessages.push({ role: 'model', text: errorMessage });
          return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [chatSession]);

  return (
    <div className="flex h-screen font-sans text-gray-200 bg-gray-900">
      <FileUpload
        files={files}
        onFilesChange={handleFilesChange}
        onClearFiles={handleClearFiles}
        isParsing={isParsing}
        predefinedSetNames={Object.keys(documentSets)}
        onLoadPredefinedSet={handleLoadPredefinedSet}
        isLoadingManifest={isManifestLoading}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isChatReady={!!chatSession && !isParsing}
        error={error}
      />
    </div>
  );
};

export default App;
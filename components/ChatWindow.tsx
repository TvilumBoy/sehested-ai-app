import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { SendIcon } from './icons';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isChatReady: boolean;
  error: string | null;
}

const WelcomeMessage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
    <div className="bg-gray-800 p-8 rounded-2xl max-w-md">
        <h2 className="text-2xl font-bold text-gray-300">Welcome to Sehested AI</h2>
        <p className="mt-2">Please upload one or more PDF documents using the panel on the left to begin your chat session.</p>
    </div>
  </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading, isChatReady, error }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading && isChatReady) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-900 h-full">
      <div className="flex-grow p-6 overflow-y-auto">
        {isChatReady ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && messages[messages.length-1]?.role === 'user' && (
              <ChatMessage message={{ role: 'model', text: ''}} isLoading={true} />
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <WelcomeMessage />
        )}
      </div>

      <div className="p-6 bg-gray-900 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isChatReady ? "Ask about your documents..." : "Upload documents to start..."}
              disabled={!isChatReady || isLoading}
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200 disabled:opacity-50"
              rows={1}
            />
            <button
              type="submit"
              disabled={!isChatReady || isLoading || !inputText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
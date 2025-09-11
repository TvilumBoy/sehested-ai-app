
import React from 'react';
import type { Message } from '../types';
import { UserIcon, BotIcon } from './icons';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></div>
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isModel = message.role === 'model';
  const textWithLineBreaks = message.text.split('**').map((part, index) => 
    index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
  );

  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center">
          <BotIcon />
        </div>
      )}

      <div className={`max-w-2xl px-5 py-3 rounded-2xl ${
          isModel 
            ? 'bg-gray-700 rounded-tl-none' 
            : 'bg-indigo-600 text-white rounded-br-none'
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
            {isLoading ? <TypingIndicator /> : textWithLineBreaks}
        </div>
      </div>

      {!isModel && (
        <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

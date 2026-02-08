import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Start a conversation with your AI assistant...</p>
        </div>
      )}
      
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start w-full mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-none flex space-x-2 items-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;

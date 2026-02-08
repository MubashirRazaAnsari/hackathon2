import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn exists, else I'll use template literals

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';
  const isSystem = message.role === 'system';

  if (isSystem || isTool) return null; // Hide system/tool messages for cleaner UI

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    // Auto-resize logic
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center bg-gray-50 dark:bg-gray-900 rounded-3xl p-2 border border-gray-200 dark:border-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-purple-500 transition-all">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask to add a task, check tasks, or update..."
        disabled={disabled}
        rows={1}
        className="w-full bg-transparent border-none focus:ring-0 resize-none px-4 py-3 min-h-[48px] max-h-[120px] text-gray-800 dark:text-gray-100 placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={cn(
          "ml-2 p-3 rounded-full text-white transition-colors duration-200 flex-shrink-0",
          !message.trim() || disabled
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 shadow-md transform hover:scale-105"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;

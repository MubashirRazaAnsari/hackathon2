'use client';

import React, { useState } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import axios from 'axios';
import apiClient from '@/lib/api'; // Assuming this exports the configured axios instance

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

import { useSession } from '@/lib/auth-client';

export default function ChatPage() {
  const { data: sessionData, isPending } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await apiClient.get('/api/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const loadConversation = async (id: string) => {
    setIsHistoryLoading(true);
    setConversationId(id);
    try {
      const response = await apiClient.get(`/api/chat/conversations/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  React.useEffect(() => {
    if (!isPending) {
      if (!sessionData) {
        window.location.href = '/auth/signin';
      } else {
        fetchConversations();
      }
    }
  }, [sessionData, isPending]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/chat', {
        message: text,
        conversation_id: conversationId
      });

      const { response: aiResponse, conversation_id } = response.data;
      
      if (!conversationId && conversation_id) {
        setConversationId(conversation_id);
        fetchConversations(); // Refresh list on new conversation
      }

      const aiMsg: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = { role: 'assistant', content: "Sorry, I encountered an error processing your request." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">Loading session...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-0px)] bg-gray-50 overflow-hidden">
      {/* Sidebar: Conversation History */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-gray-100">
          <button 
            onClick={startNewChat}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            New Mission
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Past Protocols</p>
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-xs italic">No history found.</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all group ${
                  conversationId === conv.id 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="truncate">{conv.title || 'Mission Intel'}</div>
                <div className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(conv.created_at).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
           <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600 text-xs flex items-center gap-2 transition-colors">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Return to Dashboard
           </Link>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white md:bg-gray-50">
        <header className="bg-white border-b border-gray-100 md:bg-transparent md:border-none p-4 md:p-6 flex flex-col items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI TACTICAL ADVISOR
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Strategy & Operations Interface</p>
        </header>

        <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto md:mb-8 px-4">
          <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 flex flex-col overflow-hidden relative">
            {isHistoryLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <ChatWindow messages={messages} isLoading={isLoading} />
            )}
            <div className="p-4 bg-white border-t border-gray-50">
              <ChatInput onSend={handleSend} disabled={isLoading} />
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 py-4 italic">
            Secure connection established. All mission data is encrypted.
          </p>
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';

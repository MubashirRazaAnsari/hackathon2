'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import apiClient from '@/lib/api';
import { useSession } from '@/lib/auth-client';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

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

  useEffect(() => {
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
        fetchConversations();
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
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Decrypting Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      
      {/* Premium Sidebar */}
      <aside className="w-80 bg-black/40 backdrop-blur-2xl border-r border-white/5 hidden md:flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-white/5">
           <button 
             onClick={startNewChat}
             className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
             Start New Protocol
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <h3 className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Temporal Records</h3>
           {conversations.length === 0 ? (
             <div className="p-10 text-center text-slate-700 text-xs italic">No records detected.</div>
           ) : (
             conversations.map((conv) => (
               <button
                 key={conv.id}
                 onClick={() => loadConversation(conv.id)}
                 className={`w-full text-left p-4 rounded-xl transition-all group ${
                   conversationId === conv.id 
                     ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300' 
                     : 'text-slate-500 hover:bg-white/5'
                 }`}
               >
                 <div className="font-bold truncate text-sm">{conv.title || 'Strategic Intel'}</div>
                 <div className="text-[10px] opacity-40 mt-1">{new Date(conv.created_at).toLocaleTimeString()}</div>
               </button>
             ))
           )}
        </div>

        <div className="p-6 border-t border-white/5">
           <Link href="/dashboard" className="text-slate-600 hover:text-indigo-400 text-xs flex items-center gap-2 transition-all font-bold group">
             <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             EXIT TO MISSION CONTROL
           </Link>
        </div>
      </aside>

      {/* Main Tactical Interface */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        
        <header className="p-6 pt-8 flex flex-col items-center gap-1">
           <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 tracking-[0.3em] mb-2">
              QUANTUM ENCRYPTED
           </div>
           <h1 className="text-3xl font-black gradient-text">SIERRA TACTICAL ASSISTANT</h1>
        </header>

        <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-6 pb-6 overflow-hidden">
           <div className="flex-1 glass-card flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                 {isHistoryLoading ? (
                    <div className="flex items-center justify-center h-full">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                          <p className="text-[10px] font-bold text-slate-600 tracking-widest">LOADING INTEL</p>
                       </div>
                    </div>
                 ) : (
                    <ChatWindow messages={messages} isLoading={isLoading} />
                 )}
              </div>
              <div className="p-6 bg-white/5 border-t border-white/5">
                 <ChatInput onSend={handleSend} disabled={isLoading} />
              </div>
           </div>
           
           <div className="flex items-center justify-center py-4 gap-6 opacity-40">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">AI READY</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">SECURE LINK</span>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

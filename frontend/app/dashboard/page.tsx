'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import apiClient from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags?: string;
  due_date?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  created_at: string;
  completed_at?: string;
  user_id: string;
}

export default function DashboardPage() {
  const { data: sessionData, isPending } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/tasks', {
        params: { status: statusFilter, sort: sortBy }
      });
      setTasks(response.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;
    if (!sessionData) {
      window.location.href = '/auth/signin';
      return;
    }
    fetchTasks();
  }, [sessionData, isPending, statusFilter, sortBy]);

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the task');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.tags && task.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Establishing Mission Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Navigation / Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black gradient-text">Mission Control</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Active &bull; {sessionData?.user?.email}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/tasks/create">
              <button className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                Deploy Objective
              </button>
            </Link>
            <Link href="/chat">
              <button className="btn-outline py-2.5 px-5 text-sm flex items-center gap-2 bg-white/5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                AI Terminal
              </button>
            </Link>
          </div>
        </div>

        {/* Action Bar */}
        <div className="max-w-7xl mx-auto px-6 pb-6 mt-2">
           <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                 <input 
                    type="text" 
                    placeholder="Search archives..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-white placeholder:text-slate-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <select 
                   className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full"
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                 >
                   <option value="all">Total Intel</option>
                   <option value="pending">Active Ops</option>
                   <option value="completed">Archived</option>
                 </select>
                 <select 
                   className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full"
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                 >
                   <option value="created_at">Temporal</option>
                   <option value="priority">Criticality</option>
                   <option value="due_date">Deadline</option>
                 </select>
              </div>
           </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="glass-card h-64 animate-pulse opacity-50" />
              ))}
           </div>
        ) : filteredTasks.length === 0 ? (
           <div className="glass-card py-32 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-500 border border-white/10">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">No active objectives</h3>
                 <p className="text-slate-500 max-w-sm">The archive is currently silent. Use the command console to deploy new objectives.</p>
              </div>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`group relative glass-card p-6 flex flex-col gap-4 hover:border-indigo-500/50 transition-all duration-500 ${task.status === 'completed' ? 'opacity-40 grayscale-[0.5]' : ''}`}>
                   
                   {/* Priority Indicator */}
                   <div className="flex justify-between items-center">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        task.priority === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                        task.priority === 'medium' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' :
                        'bg-slate-500/10 border-slate-500/30 text-slate-500'
                      }`}>
                         {task.priority || 'medium'}
                      </div>
                      {task.is_recurring && (
                         <div className="text-blue-400" title="Recurring Event">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                         </div>
                      )}
                   </div>

                   <h3 className={`text-xl font-bold ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                   </h3>
                   
                   <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {task.description || 'System briefing unavailable.'}
                   </p>

                   {task.tags && (
                      <div className="flex flex-wrap gap-2 mt-auto pt-4">
                         {task.tags.split(',').map((tag, i) => (
                           <span key={i} className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">#{tag.trim()}</span>
                         ))}
                      </div>
                   )}

                   {/* Footer */}
                   <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <div className="text-[10px] text-slate-600 font-medium">
                         CREATED {new Date(task.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/tasks/${task.id}`}>
                           <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           </button>
                        </Link>
                        <button 
                           onClick={() => handleDelete(task.id)}
                           className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg text-red-500/50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                   </div>

                   {/* Subtle border glow on hover */}
                   <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>
              ))}
           </div>
        )}
      </main>
    </div>
  );
}
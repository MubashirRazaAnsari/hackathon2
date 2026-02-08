'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

import { useSession } from '@/lib/auth-client';
import apiClient from '@/lib/api';

export default function DashboardPage() {
  const { data: sessionData, isPending } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Phase 5 State
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 box-decoration-clone">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mission Control</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your objectives with precision.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/tasks/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  New Objective
                </Button>
              </Link>
              <Link href="/chat">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all active:scale-95">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  AI Advisor
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtering/Search Bar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <input 
                type="text" 
                placeholder="Search objectives or tags..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select 
              className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none h-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select 
              className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none h-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Latest First</option>
              <option value="priority">By Priority</option>
              <option value="due_date">By Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 mt-8">
        {loading ? (
           <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
           </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">No objectives found</h3>
            <p className="text-gray-500 mt-2">Adjust your filters or create a new mission objective.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  task.status === 'completed' ? 'opacity-75' : ''
                }`}
              >
                {/* Priority Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider ${
                    task.priority === 'high' ? 'bg-red-50 text-red-600' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {task.priority || 'medium'}
                  </span>
                  {task.due_date && (
                    <span className="text-[11px] text-gray-500 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-bold text-gray-900 mb-2 truncate ${task.status === 'completed' ? 'line-through decoration-gray-400' : ''}`}>
                  {task.title}
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                  {task.description || 'No detailed briefing available.'}
                </p>

                {/* Tags */}
                {task.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {task.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-md font-medium">#{tag.trim()}</span>
                    ))}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <Link href={`/tasks/${task.id}`}>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600 h-8 px-2">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-600 h-8 px-2 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => handleDelete(task.id)}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Terminate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
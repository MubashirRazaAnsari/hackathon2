'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useSession } from '@/lib/auth-client';
import apiClient from '@/lib/api';

export default function CreateTaskPage() {
  const { data: sessionData, isPending } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Phase 5 State
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!sessionData) {
        router.push('/auth/signin');
        return;
      }

      await apiClient.post('/api/tasks', { 
        title, 
        description,
        priority,
        tags,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : null
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold">New Mission Objective</h1>
            <p className="text-indigo-100 mt-2">Define the parameters for your next accomplishment.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-bold text-gray-700 mb-2 block">Objective Title *</Label>
                  <Input
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500/20"
                    placeholder="e.g., Deploy Phase 5 to Production"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700 mb-2 block">Briefing (Optional)</Label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border-gray-200 border p-3 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    placeholder="Provide additional context..."
                  />
                </div>
              </div>

              {/* Categorization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-bold text-gray-700 mb-2 block">Priority Level</Label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          priority === p 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-bold text-gray-700 mb-2 block">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="h-10 rounded-xl border-gray-200"
                    placeholder="work, feature, critical"
                  />
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <Label htmlFor="due_date" className="text-sm font-bold text-gray-700 mb-2 block">Target Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-10 rounded-xl border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm font-bold text-gray-700 mb-2 block">Automation</Label>
                  <div className="flex items-center gap-3 h-10">
                    <input 
                      type="checkbox" 
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="recurring" className="text-sm text-gray-600 cursor-pointer">Set as Recurring Mission</Label>
                  </div>
                </div>
              </div>

              {isRecurring && (
                <div className="bg-indigo-50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-bold text-indigo-700 mb-2 block uppercase">Recurrence Frequency</Label>
                  <div className="flex gap-2">
                    {['daily', 'weekly', 'monthly'].map((pattern) => (
                      <button
                        key={pattern}
                        type="button"
                        onClick={() => setRecurrencePattern(pattern)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          recurrencePattern === pattern 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-white text-indigo-400 hover:bg-indigo-100'
                        }`}
                      >
                        {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-10">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-gray-600"
              >
                Abort Mission
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white/30 border-t-white rounded-full" />
                    Initializing...
                  </div>
                ) : 'Confirm Mission Objective'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at?: string;
  user_id: string;
}

import { useSession } from '@/lib/auth-client';
import apiClient from '@/lib/api';

export default function EditTaskPage() {
  const { data: sessionData, isPending } = useSession();
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Omit<Task, 'created_at' | 'completed_at'> | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    
    if (!sessionData) {
      router.push('/auth/signin');
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await apiClient.get(`/api/tasks/${params.id}`);
        const data = response.data;
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || '');
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Task not found');
        } else {
          setError(err.message || 'An error occurred while fetching the task');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [params.id, router, sessionData, isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);

    try {
      await apiClient.put(`/api/tasks/${params.id}`, { title, description });
      router.push(`/tasks/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the task');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-xl">Task not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Task</h1>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full"
            placeholder="Task title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full"
            placeholder="Task description (optional)"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saveLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
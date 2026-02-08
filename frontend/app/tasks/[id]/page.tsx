'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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

export default function TaskDetailPage() {
  const { data: sessionData, isPending } = useSession();
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
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
        setTask(response.data);
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

  const handleComplete = async () => {
    try {
      const response = await apiClient.patch(`/api/tasks/${params.id}/complete`);
      // Refresh the task data
      const data = response.data;
      setTask(prev => prev ? { ...prev, status: 'completed', completed_at: data.task.completed_at } : null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while completing the task');
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
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {task.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Task details and information
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.title}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {task.description || 'No description provided'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(task.created_at).toLocaleString()}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Completed At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {task.completed_at ? new Date(task.completed_at).toLocaleString() : 'Not completed'}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/tasks/${task.id}/edit`)}
            >
              Edit
            </Button>

            {task.status === 'pending' && (
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
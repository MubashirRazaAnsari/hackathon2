'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import router from 'next/router';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at?: string;
  user_id: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/auth/signin';
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - redirect to login
            window.location.href = '/auth/signin';
            return;
          }
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

 const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/auth/signin';
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/auth/signin';
          return;
        }
        throw new Error('Failed to delete task');
      }

      // Remove the task from the local state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the task');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <Link href="/tasks/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Create New Task
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-6 shadow-sm ${
                task.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 mt-2">{task.description}</p>
              )}
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <Link href={`/tasks/${task.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
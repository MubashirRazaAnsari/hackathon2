import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Welcome to Todo App
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage your tasks efficiently with our secure multi-user platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors">
                Sign Up
              </Button>
            </Link>

            <Link href="/auth/signin">
              <Button variant="outline" className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
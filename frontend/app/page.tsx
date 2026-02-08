'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Side: Branding */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-indigo-300 mb-2">
            ✨ Next Generation Task Management
          </div>
          <h1 className="text-6xl md:text-8xl font-black">
            Master your <br />
            <span className="gradient-text">Productivity.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
            Experience the world's most beautiful and intelligent todo application. 
            Built for those who demand excellence in their daily workflow.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <Link href="/auth/signin">
              <button className="btn-primary flex items-center gap-2 group">
                Sign In
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="btn-outline">
                Join Now
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Visual Element */}
        <div className="flex-1 w-full max-w-md hidden md:block">
          <div className="glass-card p-1 relative floating">
            <div className="bg-slate-900/50 rounded-xl overflow-hidden aspect-video flex items-center justify-center p-8">
               <div className="space-y-4 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-12 w-full rounded-lg bg-white/${i*5} border border-white/5 flex items-center px-4 gap-3`}>
                      <div className="w-5 h-5 rounded-full border border-white/20" />
                      <div className={`h-2 rounded bg-white/20`} style={{ width: `${100 - i*20}%` }} />
                    </div>
                  ))}
               </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl blur opacity-20 -z-10 group-hover:opacity-40 transition duration-1000"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

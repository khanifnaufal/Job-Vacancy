'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Vacancy } from '@/types';
import JobCard from '@/components/JobCard';
import { Heart, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const fetchBookmarks = async (): Promise<Vacancy[]> => {
  const { data } = await api.get('/bookmarks');
  return data;
};

export default function SavedJobsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user) {
      router.push('/login');
    } else if (user.role !== 'seeker') {
      router.push('/');
    }
  }, [user, router, hasHydrated]);

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    enabled: hasHydrated && !!user && user.role === 'seeker',
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
          <Heart className="w-4 h-4 text-rose-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading your saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-xl shadow-rose-500/5">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground dark:text-white tracking-tight">Saved Jobs</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Vacancies you've bookmarked for careful review.</p>
          </div>
        </div>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="bg-card dark:bg-slate-900/20 border-2 border-dashed border-border dark:border-slate-800 rounded-[3.5rem] p-32 text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-background dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-700 group-hover:text-rose-500/50 transition-colors duration-500 border border-border dark:border-slate-800">
              <Heart className="w-12 h-12" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground dark:text-white mb-3">Your list is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed italic">
            You haven't saved any jobs yet. Browse the latest vacancies and save the ones that catch your eye!
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-500 transition-all hover:-translate-y-1 shadow-xl shadow-indigo-600/20"
          >
            Explore Vacancies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarks?.map((job, index) => (
            <div 
              key={job.id} 
              className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

export default function BookmarksPage() {
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

  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: fetchBookmarks,
    enabled: !!user && user.role === 'seeker',
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading your saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Saved Jobs</h1>
            <p className="text-slate-500 font-medium">Vacancies you've bookmarked for later review.</p>
          </div>
        </div>
      </div>

      {bookmarks?.length === 0 ? (
        <div className="text-center py-24 px-6 border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/20 backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
              <Heart className="w-10 h-10" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-300 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium italic">
            Start exploring vacancies and click the heart icon to save them here for quick access.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20"
          >
            Explore Vacancies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks?.map((job, index) => (
            <div key={job.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { Vacancy } from '@/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { useBookmarkStore } from '@/lib/bookmarkStore';
import { toast } from 'sonner';
import ApplyModal from '@/components/ApplyModal';
import { Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const fetchVacancy = async (id: string): Promise<Vacancy> => {
  const { data } = await api.get(`/vacancies/${id}`);
  return data;
};

export default function VacancyDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuthStore();
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  const bookmarked = isBookmarked(Number(id));

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => fetchVacancy(id),
  });

  const handleApplyClick = () => {
    if (!user) {
      toast.error('Please login to apply for this job');
      router.push('/login');
      return;
    }

    if (user.role === 'recruiter') {
      toast.error('Recruiters cannot apply for jobs');
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to save jobs');
      router.push('/login');
      return;
    }

    if (user.role !== 'seeker') {
      toast.error('Only seekers can bookmark jobs');
      return;
    }

    try {
      const isNowBookmarked = await toggleBookmark(Number(id));
      toast.success(isNowBookmarked ? 'Job saved!' : 'Job removed from saved');
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-300">
        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-lg shadow-indigo-500/10">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-200 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">Vacancy Not Found</h2>
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors gap-2 hover:bg-slate-900 px-6 py-3 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 mb-8 transition-colors group">
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg mr-3 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </div>
        Back to all jobs
      </Link>

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="mb-10 pb-10 border-b border-slate-800/80">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight">
                {job.title}
              </h1>
              <span className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold tracking-widest uppercase border backdrop-blur-sm ${job.status ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_20px_rgb(99,102,241,0.2)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                {job.status ? 'Active' : 'Closed'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-6 text-slate-300">
              <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="font-semibold text-slate-200">
                  {typeof job.company === 'object' ? job.company?.name : job.company}
                </span>
              </div>
              <div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {job.location}
              </div>
              {job.salary && (
                 <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 font-medium shadow-[0_0_15px_rgb(16,185,129,0.1)]">
                   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {job.salary}
                 </div>
              )}
            </div>
          </div>
          
          <div className="prose max-w-none prose-invert prose-slate">
            <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
              </span>
              Job Description
            </h3>
            <div className="markdown-content text-slate-300 bg-slate-800/30 p-6 md:p-8 rounded-2xl border border-slate-700/30 font-medium leading-relaxed text-lg">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-white mt-8 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-slate-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300" {...props} />,
                  li: ({node, ...props}) => <li className="ml-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  code: ({node, ...props}) => <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-400 font-mono text-sm" {...props} />,
                }}
              >
                {job.description}
              </ReactMarkdown>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-end items-center gap-4">
            {user?.role === 'seeker' && (
              <button
                onClick={handleBookmark}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border ${
                  bookmarked 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_20px_rgb(244,63,94,0.1)]' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5'
                }`}
              >
                <Heart className={`w-6 h-6 ${bookmarked ? 'fill-current' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Save for Later'}</span>
              </button>
            )}

            <button 
              onClick={handleApplyClick}
              className={`w-full sm:w-auto px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${job.status ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgb(79,70,229,0.3)] hover:shadow-[0_0_40px_rgb(79,70,229,0.5)] hover:-translate-y-1' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`} 
              disabled={!job.status}
            >
              {job.status && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              )}
              <span className="relative z-10">{job.status ? 'Apply for this Job' : 'Applications Closed'}</span>
            </button>
          </div>
        </div>
      </div>

      <ApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        vacancyId={job.id} 
        jobTitle={job.title} 
      />
    </div>
  );
}

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
import { Heart, Share2, Link2, Users, Clock, Rocket, MessageSquare } from 'lucide-react';
import { LinkedinIcon } from '@/components/common/BrandIcons';
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

  const getUrgencyData = () => {
    if (!job?.deadline) return null;
    const deadline = new Date(job.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Expired', style: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    if (diffDays === 0) return { label: 'CLOSING TODAY', style: 'text-white bg-rose-500 border-rose-600 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.3)]', isUrgent: true };
    if (diffDays <= 3) return { label: `CLOSING IN ${diffDays} DAYS`, style: 'text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.1)]', isUrgent: true };
    return { label: `APPLY BY ${new Date(job.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`, style: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
  };

  const urgency = getUrgencyData();

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

  const shareJob = (platform: 'link' | 'linkedin' | 'whatsapp') => {
    const url = window.location.href;
    const text = `Check out this job opening: ${job?.title} at ${typeof job?.company === 'object' ? job?.company?.name : job?.company}`;

    switch (platform) {
      case 'link':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
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
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <Link href="/" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-500 hover:text-indigo-500 mb-8 transition-colors group">
        <div className="bg-card border border-border p-2 rounded-lg mr-3 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </div>
        Back to all jobs
      </Link>

      <div className="bg-card/90 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="p-8 md:p-12 relative z-10">
          {/* Header Info */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
              <div className="space-y-4">
                 <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-slate-500 dark:from-white dark:to-slate-400 leading-tight tracking-tight">
                   {job.title}
                 </h1>
                 
                 {/* Social Proof Banner */}
                 {job.applications_count !== undefined && job.applications_count > 0 && (
                   <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-xs animate-in slide-in-from-left-4 duration-500">
                     <div className="flex -space-x-2">
                       {[...Array(3)].map((_, i) => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-indigo-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                           <div className="w-full h-full bg-gradient-to-br from-indigo-500/40 to-purple-500/40" />
                         </div>
                       ))}
                     </div>
                     <span className="flex items-center gap-2">
                       <Rocket className="w-3.5 h-3.5 fill-current" />
                       Join {job.applications_count} professionals who already applied
                     </span>
                   </div>
                 )}
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase border backdrop-blur-sm ${job.status ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`}>
                  {job.status ? 'Active' : 'Closed'}
                </span>
                
                {urgency && (
                   <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase border transition-all ${urgency.style}`}>
                     <div className="flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" />
                       {urgency.label}
                     </div>
                   </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] pb-10 border-b border-border/60">
              {typeof job.company === 'object' ? (
                <Link 
                  href={`/company/${job.company.id}`}
                  className="flex items-center bg-background border border-border px-5 py-2.5 rounded-xl shadow-sm hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group/link"
                >
                  <svg className="w-4 h-4 mr-2.5 text-indigo-500 group-hover/link:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <span className="text-foreground group-hover/link:text-indigo-500 transition-colors">
                    {job.company?.name}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center bg-background border border-border px-5 py-2.5 rounded-xl shadow-sm">
                  <svg className="w-4 h-4 mr-2.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <span className="text-foreground">
                    {job.company}
                  </span>
                </div>
              )}
              <div className="flex items-center bg-background border border-border px-5 py-2.5 rounded-xl shadow-sm">
                <svg className="w-4 h-4 mr-2.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-foreground">{job.location}</span>
              </div>
              {job.salary && (
                 <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-xl text-emerald-500 shadow-sm">
                   <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {job.salary}
                 </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-2xl font-black text-foreground flex items-center tracking-tight">
                <span className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mr-4 text-indigo-500 border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                </span>
                Detailed Description
              </h3>
              <div className="markdown-content text-slate-600 dark:text-slate-400 bg-background/50 p-8 md:p-10 rounded-3xl border border-border font-medium leading-relaxed text-lg shadow-inner">
                <ReactMarkdown 
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-black text-foreground mt-8 mb-4 tracking-tight" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-foreground mt-6 mb-3 tracking-tight" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-foreground mt-4 mb-2 tracking-tight" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="ml-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-black text-foreground" {...props} />,
                    code: ({node, ...props}) => <code className="bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded text-indigo-500 font-mono text-sm" {...props} />,
                  }}
                >
                  {job.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-8">
              <div className="p-8 rounded-[2rem] bg-background border border-border shadow-lg space-y-6 lg:sticky lg:top-32">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Spread the word</h4>
                <div className="grid grid-cols-1 gap-3">
                   <button 
                     onClick={() => shareJob('linkedin')}
                     className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent hover:border-indigo-500/30 transition-all font-bold group"
                   >
                     <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <LinkedinIcon className="w-5 h-5 fill-current" />
                     </div>
                     <span className="text-sm">LinkedIn</span>
                   </button>
                   
                   <button 
                     onClick={() => shareJob('whatsapp')}
                     className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent hover:border-emerald-500/30 transition-all font-bold group"
                   >
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <MessageSquare className="w-5 h-5" />
                     </div>
                     <span className="text-sm">WhatsApp</span>
                   </button>

                   <button 
                     onClick={() => shareJob('link')}
                     className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent hover:border-slate-500/30 transition-all font-bold group"
                   >
                     <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Link2 className="w-5 h-5" />
                     </div>
                     <span className="text-sm">Copy Link</span>
                   </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-end items-center gap-4">
            {user?.role === 'seeker' && (
              <button
                onClick={handleBookmark}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border ${
                  bookmarked 
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-lg shadow-rose-500/5' 
                    : 'bg-background border-border text-slate-500 hover:text-rose-500 hover:border-rose-500/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Save Session'}</span>
              </button>
            )}

            <button 
              onClick={handleApplyClick}
              className={`w-full sm:w-auto px-16 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden group shadow-xl ${job.status ? 'bg-indigo-600 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-border'}`} 
              disabled={!job.status}
            >
              {job.status && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              )}
              <span className="relative z-10">{job.status ? 'Apply Now' : 'Expired'}</span>
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

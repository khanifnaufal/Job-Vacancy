import Link from 'next/link';
import { Vacancy } from '@/types';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useBookmarkStore } from '@/lib/bookmarkStore';
import { toast } from 'sonner';

export default function JobCard({ job }: { job: Vacancy }) {
  const { user } = useAuthStore();
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  
  const bookmarked = isBookmarked(job.id);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to save jobs');
      return;
    }

    if (user.role !== 'seeker') {
      toast.error('Only seekers can bookmark jobs');
      return;
    }

    try {
      const isNowBookmarked = await toggleBookmark(job.id);
      toast.success(isNowBookmarked ? 'Job saved!' : 'Job removed from saved');
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <Link href={`/vacancy/${job.id}`} className="block h-full group">
      <div className="relative h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] group-hover:border-indigo-500/50 overflow-hidden">
        {/* Subtle background glow effect on hover */}
        <div className="absolute -inset-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h2 className="text-xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300 line-clamp-2">
              {job.title}
            </h2>
            <div className="flex flex-col items-end gap-2 shrink-0">
               <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${job.status ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'}`}>
                 {job.status ? 'Active' : 'Closed'}
               </span>
               
               {user?.role === 'seeker' && (
                 <button
                   onClick={handleBookmark}
                   className={`p-2 rounded-xl border transition-all duration-300 ${
                     bookmarked 
                       ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                       : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/30'
                   }`}
                 >
                   <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                 </button>
               )}
            </div>
          </div>
          
          <div className="text-slate-400 text-sm mb-4 flex-grow space-y-2 font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span className="text-slate-300 truncate">
                {typeof job.company === 'object' ? job.company?.name : job.company}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="truncate">{job.location}</span>
            </div>
          </div>
          
          {job.salary && (
            <div className="pt-4 mt-auto border-t border-slate-800">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-medium text-sm bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {job.salary}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import { Vacancy } from '@/types';
import { Heart, Building2, MapPin, CircleDollarSign, Users, Hourglass, Clock } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useBookmarkStore } from '@/lib/bookmarkStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function JobCard({ job }: { job: Vacancy }) {
  const { user } = useAuthStore();
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const router = useRouter();
  
  const bookmarked = isBookmarked(job.id);

  const getUrgencyInfo = () => {
    if (!job.deadline) return null;
    const deadline = new Date(job.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Expired', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    if (diffDays === 0) return { label: 'Closing Today', color: 'bg-rose-500 text-white border-rose-600 animate-pulse', isUrgent: true };
    if (diffDays <= 3) return { label: `Closing in ${diffDays}d`, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20 animate-pulse', isUrgent: true };
    return { label: `Ends ${new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`, color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-border' };
  };

  const urgency = getUrgencyInfo();

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

  const handleCardClick = () => {
    router.push(`/vacancy/${job.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="block h-full group cursor-pointer"
    >
      <div className="relative h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] group-hover:border-indigo-500/50 overflow-hidden">
        {/* Subtle background glow effect on hover */}
        <div className="absolute -inset-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="space-y-3 flex-grow">
               <h2 className="text-xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300 line-clamp-2">
                 {job.title}
               </h2>
               {urgency && (
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${urgency.color}`}>
                   <Clock className="w-3 h-3" />
                   {urgency.label}
                 </div>
               )}
            </div>
            
            <div className="flex flex-col items-end gap-2 shrink-0">
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${job.status ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                 {job.status ? 'Active' : 'Closed'}
               </span>
               
               {user?.role === 'seeker' && (
                 <button
                   onClick={handleBookmark}
                   className={`p-2 rounded-xl border transition-all duration-300 ${
                     bookmarked 
                       ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                       : 'bg-background/50 border-border text-slate-400 dark:text-slate-500 hover:text-rose-500 hover:border-rose-500/30'
                   }`}
                 >
                   <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                 </button>
               )}
            </div>
          </div>
          
          <div className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex-grow space-y-2 font-medium">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <Link 
                href={`/company/${typeof job.company === 'object' ? job.company?.id : job.company_id}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-foreground hover:text-indigo-500 transition-colors truncate font-bold relative z-20"
              >
                {typeof job.company === 'object' ? job.company?.name : (job as any).company}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
          
          <div className="pt-4 mt-auto border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              {job.salary && (
                <div className="inline-flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                  <CircleDollarSign className="w-3.5 h-3.5" />
                  {job.salary}
                </div>
              )}
              {job.applications_count !== undefined && job.applications_count > 0 && (
                <div className="inline-flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10">
                  <Users className="w-3.5 h-3.5" />
                  {job.applications_count} {job.applications_count === 1 ? 'Applicant' : 'Applicants'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


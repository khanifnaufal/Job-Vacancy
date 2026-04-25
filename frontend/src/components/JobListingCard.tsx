'use client';

import { Vacancy } from '@/types';
import { Heart, Building2, MapPin, DollarSign, Clock, Zap, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useBookmarkStore } from '@/lib/bookmarkStore';
import { toast } from 'sonner';
import { useState } from 'react';

interface JobListingCardProps {
  job: Vacancy;
  onClick: (job: Vacancy) => void;
  isSelected?: boolean;
}

export default function JobListingCard({ job, onClick, isSelected }: JobListingCardProps) {
  const { user } = useAuthStore();
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const [showSalary, setShowSalary] = useState(false);
  
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

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('full')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (t.includes('part')) return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    if (t.includes('remote')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  // Extract skills from description if possible, or use placeholders
  const skills = job.description.match(/[A-Z][a-zA-Z]{1,}/g)?.slice(0, 3) || ['React', 'Node.js', 'Next.js'];

  return (
    <div 
      onClick={() => onClick(job)}
      className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected 
          ? 'bg-indigo-500/5 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)] translate-x-2' 
          : 'bg-card/50 border-border hover:border-slate-400 hover:bg-card/80'
      }`}
    >
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="relative z-10 flex gap-5">
        {/* Company Logo Placeholder */}
        <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-border flex items-center justify-center font-black text-slate-400 text-xl group-hover:scale-105 transition-transform">
          {typeof job.company === 'object' ? job.company?.name.charAt(0) : (job.company_name?.charAt(0) || 'H')}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4 mb-1">
            <h3 className="text-lg font-black tracking-tight text-foreground truncate group-hover:text-indigo-500 transition-colors">
              {job.title}
            </h3>
            
            <div className="flex items-center gap-2">
              {job.created_at && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                   <Clock className="w-3 h-3" />
                   {new Date(job.created_at) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                     <span className="text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded mr-1">NEW</span>
                   )}
                   {Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24))}d
                </div>
              )}
              {user?.role === 'seeker' && (
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg border transition-all ${
                    bookmarked 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                      : 'bg-background/50 border-border text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mb-4">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{typeof job.company === 'object' ? job.company?.name : job.company_name}</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{job.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getTypeColor(job.job_type)}`}>
              {job.job_type}
            </span>
            {job.experience_level && (
              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-500/20 bg-purple-500/10 text-purple-400">
                {job.experience_level}
              </span>
            )}
            
            {skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 rounded-lg text-[9px] font-bold text-slate-500 border border-border bg-slate-500/5">
                {skill}
              </span>
            ))}

            <div className="ml-auto flex items-center gap-2">
               {job.salary && (
                 <div className="flex items-center gap-1.5">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setShowSalary(!showSalary); }}
                     className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                   >
                     {showSalary ? job.salary : 'View Salary'}
                   </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

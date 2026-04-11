'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Search,
  Loader2,
  AlertCircle,
  FileText,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Filter,
  Calendar
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyApplicationsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'seeker') {
      router.push('/login');
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await api.get('/seeker/applications');
        setApplications(response.data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
        toast.error('Failed to load your applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user, router]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5';
      case 'interview': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/5';
      case 'reviewed': return 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-sky-500/5';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Link href="/seeker/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>My Applications</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Hiring Journey</h1>
          <p className="text-slate-500 mt-2">Monitor the status of your applications and recruiter feedback.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2 text-slate-400">
             <Filter className="w-4 h-4" />
             <span className="text-sm font-medium">All Status</span>
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[3rem] p-20 text-center space-y-8 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center mx-auto text-slate-700 border border-slate-800">
            <Search className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">No applications found</h3>
            <p className="text-slate-400 max-w-sm mx-auto text-lg leading-relaxed">
              You haven't applied for any jobs yet. Your next career move is just a click away!
            </p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
          >
            <Briefcase className="w-5 h-5" />
            <span>Discover Opportunities</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="group bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  {/* Job Details */}
                  <div className="flex items-start gap-6 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl font-black text-slate-600 border border-slate-800 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all shrink-0">
                      {app.vacancy?.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                        {app.vacancy?.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-400" />
                          {app.vacancy?.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          {app.vacancy?.salary || 'Salary Undisclosed'}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          Applied on {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-wrap items-center gap-6 shrink-0">
                    <div className={`px-5 py-2.5 rounded-xl border text-xs font-black uppercase tracking-widest shadow-lg ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </div>
                    
                    <Link 
                      href={`/vacancy/${app.vacancy_id}`}
                      className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                      title="View Job Details"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Feedback / Notes Section */}
                {(app.notes || app.cover_letter) && (
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800/80">
                    {app.cover_letter && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Your Cover Letter</p>
                        <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800 text-sm text-slate-400 leading-relaxed italic line-clamp-3">
                          "{app.cover_letter}"
                        </div>
                      </div>
                    )}
                    
                    {app.notes ? (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Recruiter Feedback
                        </p>
                        <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10 text-sm text-slate-300 leading-relaxed">
                          {app.notes}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full p-6 text-center text-slate-600 space-y-2 opacity-50">
                        <Clock className="w-5 h-5" />
                        <p className="text-xs font-bold uppercase tracking-widest">Waiting for feedback</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-8 flex items-start gap-5">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-amber-200 font-bold">About Expired Vacancies</p>
          <p className="text-amber-200/60 text-sm leading-relaxed">
            Applications for jobs that have passed their deadline are automatically removed from your active dashboard after 30 days to keep your workspace clean. You can still see "Accepted" or "Interview" status jobs regardless of their deadline.
          </p>
        </div>
      </div>
    </div>
  );
}

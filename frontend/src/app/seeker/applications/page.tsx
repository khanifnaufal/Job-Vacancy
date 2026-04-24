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
  Calendar,
  ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from 'sonner';
import StatusTimeline from '@/components/StatusTimeline';
import InterviewBookingModal from '@/components/InterviewBookingModal';

export default function MyApplicationsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; vacancyId: number; jobTitle: string }>({
    isOpen: false,
    vacancyId: 0,
    jobTitle: '',
  });

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'pending', label: 'Pending' },
    { id: 'reviewed', label: 'Reviewed' },
    { id: 'interview', label: 'Interview' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' },
  ];

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

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
  }, [user, router, hasHydrated]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-emerald-500/5';
      case 'rejected': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-rose-500/5';
      case 'interview': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shadow-indigo-500/5';
      case 'reviewed': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 shadow-sky-500/5';
      default: return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-amber-500/5';
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

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
          <h1 className="text-3xl font-bold text-foreground dark:text-white tracking-tight">Your Hiring Journey</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor the status of your applications and recruiter feedback.</p>
        </div>
        
        <div className="relative group">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-card dark:bg-slate-900 border transition-all duration-300 ${
                isFilterOpen ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-border dark:border-slate-800 hover:border-primary/30'
              }`}
            >
              <Filter className={`w-4 h-4 transition-colors ${statusFilter !== 'all' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {statuses.find(s => s.id === statusFilter)?.label || 'Filter Status'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

           {isFilterOpen && (
             <>
               <div 
                 className="fixed inset-0 z-40" 
                 onClick={() => setIsFilterOpen(false)}
               ></div>
                <div className="absolute right-0 mt-3 w-56 bg-card/90 dark:bg-slate-900/90 backdrop-blur-xl border border-border dark:border-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-2">
                    {statuses.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setStatusFilter(s.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          statusFilter === s.id 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-background dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{s.label}</span>
                        {statusFilter === s.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
             </>
           )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-card dark:bg-slate-900/40 border-2 border-dashed border-border dark:border-slate-800 rounded-[3rem] p-20 text-center space-y-8 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-background dark:bg-slate-950 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-700 border border-border dark:border-slate-800">
            <Search className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-foreground dark:text-white">No applications found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-lg leading-relaxed font-medium">
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
      ) : filteredApplications.length === 0 ? (
        <div className="bg-card dark:bg-slate-900/40 border-2 border-dashed border-border dark:border-slate-800 rounded-3xl p-20 text-center space-y-4">
           <div className="w-16 h-16 rounded-full bg-background dark:bg-slate-950 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-700 border border-border dark:border-slate-800">
             <AlertCircle className="w-8 h-8" />
           </div>
           <h3 className="text-xl font-bold text-foreground dark:text-white">No applications match this filter</h3>
           <p className="text-slate-500 max-w-xs mx-auto text-sm">
             Try selecting a different status or explore more jobs to apply.
           </p>
           <button 
             onClick={() => setStatusFilter('all')}
             className="text-indigo-400 font-bold text-sm hover:underline"
           >
             Show all applications
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredApplications.map((app) => (
            <div 
              key={app.id} 
              className="group bg-card dark:bg-slate-900/40 border border-border dark:border-slate-800 rounded-3xl overflow-hidden hover:border-primary/30 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-xl"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  {/* Job Details */}
                  <div className="flex items-start gap-6 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-background dark:bg-slate-950 flex items-center justify-center text-2xl font-black text-slate-400 dark:text-slate-600 border border-border dark:border-slate-800 group-hover:border-primary/20 dark:group-hover:border-indigo-500/20 group-hover:text-primary dark:group-hover:text-indigo-400 transition-all shrink-0">
                      {app.vacancy?.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors mb-2">
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
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-border dark:border-transparent"
                      title="View Job Details"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>

                    {app.status === 'interview' && !app.interview_slot && (
                      <button
                        onClick={() => setBookingModal({ isOpen: true, vacancyId: app.vacancy_id, jobTitle: app.vacancy?.title || '' })}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 animate-pulse"
                      >
                        Book Interview
                      </button>
                    )}
                  </div>
                </div>

                {/* Booked Interview Info */}
                {app.interview_slot && (
                  <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Booked Interview</p>
                        <p className="text-sm font-bold text-foreground">
                          {new Date(app.interview_slot.start_time).toLocaleString(undefined, { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {app.interview_slot.location && (
                      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-background border border-border">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {app.interview_slot.location.startsWith('http') ? (
                            <a href={app.interview_slot.location} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
                              Join Meeting
                            </a>
                          ) : app.interview_slot.location}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline Section */}
                {app.status_logs && (
                  <StatusTimeline logs={app.status_logs} currentStatus={app.status} />
                )}
                
                 {/* Legacy Notes Section - Keep if no logs or for backward compatibility */}
                 {!app.status_logs && (app.notes || app.cover_letter) && (
                   <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border dark:border-slate-800/80">
                     {app.cover_letter && (
                       <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-600">Your Cover Letter</p>
                         <div className="bg-background dark:bg-slate-950/50 rounded-2xl p-5 border border-border dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-3">
                           "{app.cover_letter}"
                         </div>
                       </div>
                     )}
                     
                     {app.notes ? (
                       <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary dark:text-indigo-500 flex items-center gap-2">
                           <MessageSquare className="w-3.5 h-3.5" />
                           Recruiter Feedback
                         </p>
                         <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                           {app.notes}
                         </div>
                       </div>
                     ) : (
                       <div className="flex flex-col justify-center items-center h-full p-6 text-center text-slate-500 dark:text-slate-600 space-y-2 opacity-50">
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
      <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 rounded-3xl p-8 flex items-start gap-5">
        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-amber-700 dark:text-amber-200 font-bold">About Expired Vacancies</p>
          <p className="text-amber-600/80 dark:text-amber-200/60 text-sm leading-relaxed font-medium">
            Applications for jobs that have passed their deadline are automatically removed from your active dashboard after 30 days to keep your workspace clean. You can still see "Accepted" or "Interview" status jobs regardless of their deadline.
          </p>
        </div>
      </div>

      <InterviewBookingModal 
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
        vacancyId={bookingModal.vacancyId}
        jobTitle={bookingModal.jobTitle}
      />
    </div>
  );
}

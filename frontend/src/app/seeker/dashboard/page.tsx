'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Search,
  ChevronRight,
  Loader2,
  Calendar
} from 'lucide-react';
import api from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SeekerDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'seeker') {
      router.push('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/seeker/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10 animate-pulse">
        <div className="h-12 w-64 bg-slate-800 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Hi, <span className="text-indigo-400">{user?.name}!</span> 👋
          </h1>
          <p className="text-slate-400 flex items-center gap-2">
            Track your progress and find your next big opportunity.
          </p>
        </div>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
        >
          <Search className="w-5 h-5" />
          <span>Browse All Jobs</span>
        </Link>
      </div>

      {/* Quick Navigation */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
        {[
          { name: 'Dashboard', href: '/seeker/dashboard', active: true },
          { name: 'My Applications', href: '/seeker/applications', active: false },
          { name: 'My Profile', href: '/seeker/profile', active: false },
        ].map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
              link.active 
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                : 'bg-slate-900/50 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Sent" 
          value={stats?.total_applications || 0} 
          icon={Briefcase} 
          color="from-blue-500 to-indigo-500"
          description="Applications submitted"
        />
        <StatCard 
          title="Active Reviews" 
          value={stats?.active_applications || 0} 
          icon={TrendingUp} 
          color="from-amber-500 to-orange-500"
          description="In-review or Scheduled"
        />
        <StatCard 
          title="Interviews" 
          value={stats?.interviews_scheduled || 0} 
          icon={Calendar} 
          color="from-emerald-500 to-teal-500"
          description="Upcoming meetings"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock className="w-6 h-6 text-indigo-500" />
              Recent Activity
            </h2>
            <Link href="/seeker/applications" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors">
              View all applications <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.recent_activity?.length > 0 ? (
              stats.recent_activity.map((app: any) => (
                <div key={app.id} className="group bg-slate-950/40 border border-slate-800/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 font-bold border border-slate-800 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                      {app.vacancy?.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{app.vacancy?.title}</h4>
                      <p className="text-slate-400 text-sm flex items-center gap-2 mt-0.5">
                        {app.vacancy?.company?.name} • <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.vacancy?.location}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Status</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        app.status === 'interview' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-700 hidden md:block group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto text-slate-700">
                  <Briefcase className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-200 font-bold text-lg">No application activity yet</p>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">Start your journey by applying for your dream job today.</p>
                </div>
                <Link href="/" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all">
                  Find Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium CTA Box */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="space-y-4 relative z-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Land your dream job <br/><span className="text-indigo-200 leading-relaxed italic">faster than ever.</span></h2>
          <p className="text-indigo-100/70 max-w-md">Our advanced AI matches your profile with the top companies in the industry. Complete your profile now.</p>
        </div>
        
        <Link 
          href="/seeker/profile" 
          className="group px-10 py-5 rounded-2xl bg-white text-indigo-600 font-extrabold text-lg shadow-xl shadow-black/10 hover:shadow-2xl hover:bg-indigo-50 transition-all hover:-translate-y-1 flex items-center gap-3 shrink-0 relative z-10"
        >
          <span>Complete My Profile</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

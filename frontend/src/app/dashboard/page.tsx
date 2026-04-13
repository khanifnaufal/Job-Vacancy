'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Building2,
  Plus,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { RecruiterStats } from '@/types';
import StatCard from '@/components/dashboard/StatCard';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'recruiter') {
      // For now, only recruiter dashboard is implemented
      toast.error('Dashboard is currently only for recruiters');
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/recruiter/stats');
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
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Incomplete Profile Alert */}
      {(user?.company?.name === 'My Company' || user?.company?.location === 'Update Location') && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Your company profile is incomplete</h3>
              <p className="text-slate-400 text-sm max-w-md">
                A complete profile helps build trust with candidates. Update your company details now to improve your hiring efficiency.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/company"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Profile</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-indigo-400">{user?.name}</span>
          </h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            Managing <span className="text-slate-200 font-medium">{user?.company?.name || 'your company'}</span>
          </p>
        </div>
        
        <Link 
          href="/dashboard/jobs" 
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Quick Navigation - Horizontal List for Top-Nav style dashboard */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
        {[
          { name: 'Overview', href: '/dashboard', active: true },
          { name: 'My Job Postings', href: '/dashboard/jobs', active: false },
          { name: 'Applicants', href: '/dashboard/applications', active: false },
          { name: 'Company Profile', href: '/dashboard/company', active: false },
        ].map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              link.active 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Vacancies" 
          value={stats?.total_vacancies || 0} 
          icon={Briefcase} 
          color="from-blue-500 to-cyan-500"
          description="Posted jobs"
        />
        <StatCard 
          title="Total Applications" 
          value={stats?.total_applications || 0} 
          icon={Users} 
          color="from-purple-500 to-pink-500"
          description="Received across all jobs"
        />
        <StatCard 
          title="Pending Review" 
          value={stats?.pending_applications || 0} 
          icon={Clock} 
          color="from-amber-500 to-orange-500"
          description="Waiting for action"
        />
        <StatCard 
          title="Reviewed" 
          value={stats?.reviewed_applications || 0} 
          icon={CheckCircle2} 
          color="from-emerald-500 to-teal-500"
          description="Processed applicants"
        />
      </div>

      {/* Recent Activity / CTA Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Vacancies</h2>
            <Link href="/dashboard/jobs" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
              View all <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {stats?.recent_vacancies && stats.recent_vacancies.length > 0 ? (
              stats.recent_vacancies.map((vacancy) => (
                <div key={vacancy.id} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      {vacancy.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{vacancy.title}</h4>
                      <p className="text-xs text-slate-500">{(vacancy as any).applications_count || 0} applicants</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/jobs/${vacancy.id}`} className="p-2 rounded-lg bg-slate-900 text-slate-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                 <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-slate-700">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <p className="text-slate-500 max-w-xs text-xs">
                    No active vacancies yet. Post your first job!
                 </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Pending Applicants</h2>
            <Link href="/dashboard/applications" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
              Review now <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.recent_applications && stats.recent_applications.length > 0 ? (
              stats.recent_applications.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs uppercase">
                      {app.user?.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{app.user?.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">Applied for {app.vacancy?.title}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/applications" className="p-2 rounded-lg bg-slate-900 text-slate-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                 <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-slate-700">
                    <Users className="w-6 h-6" />
                 </div>
                 <p className="text-slate-500 max-w-xs text-xs">
                    {stats?.pending_applications ? `You have ${stats.pending_applications} applicants waiting for feedback.` : 'All caught up on reviews!'}
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

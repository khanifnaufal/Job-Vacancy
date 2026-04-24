'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Loader2,
  Filter,
  Inbox
} from 'lucide-react';
import api from '@/lib/api';
import { Application } from '@/types';
import ApplicationRow from '@/components/dashboard/ApplicationRow';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ApplicationManagementPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/recruiter/applications');
      setApplications(response.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || user.role !== 'recruiter') {
      router.push('/login');
      return;
    }
    fetchApplications();
  }, [user, router, hasHydrated]);

  const handleUpdateStatus = async (id: number, status: string, data: any) => {
    try {
      const payload = typeof data === 'string' ? { status, notes: data } : { status, ...data };
      await api.patch(`/applications/${id}/status`, payload);
      toast.success('Application updated');
      // Update local state
      setApplications(applications.map(app => 
        app.id === id ? { ...app, ...payload } as Application : app
      ));
    } catch (err) {
      toast.error('Failed to update application');
      throw err;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = 
      app.user?.name.toLowerCase().includes(search.toLowerCase()) || 
      app.vacancy?.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Applicants</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Review job applications</h1>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by candidate name or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-5 h-5 text-slate-500 hidden sm:block" />
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'reviewed', label: 'Reviewed' },
            { id: 'interview', label: 'Interview' },
            { id: 'accepted', label: 'Accepted' },
            { id: 'rejected', label: 'Rejected' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                filter === f.id 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center mx-auto text-slate-700">
            <Inbox className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No applications found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {search || filter !== 'all' 
                ? "We couldn't find any applications matching your current filters." 
                : "You haven't received any applications for your job postings yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Showing {filteredApplications.length} candidates
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {filteredApplications.map((app) => (
              <ApplicationRow 
                key={app.id} 
                application={app} 
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

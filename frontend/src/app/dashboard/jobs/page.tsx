'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Loader2,
  X,
  Building2,
  AlertCircle,
  ChevronDown,
  Briefcase,
  Zap
} from 'lucide-react';
import api from '@/lib/api';
import { Vacancy } from '@/types';
import JobManagementCard from '@/components/dashboard/JobManagementCard';
import { toast } from 'sonner';
import Link from 'next/link';

export default function JobManagementPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Vacancy | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    job_type: 'full-time',
    experience_level: 'junior',
    status: true,
  });

  const fetchVacancies = async () => {
    try {
      const response = await api.get('/recruiter/vacancies');
      setVacancies(response.data);
    } catch (err) {
      console.error('Failed to fetch vacancies', err);
      toast.error('Failed to load your job postings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      router.push('/login');
      return;
    }
    fetchVacancies();
  }, [user, router]);

  const handleOpenModal = (job: Vacancy | null = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary || '',
        job_type: job.job_type,
        experience_level: job.experience_level || '',
        status: job.status,
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: '',
        job_type: 'full-time',
        experience_level: 'junior',
        status: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingJob) {
        await api.put(`/vacancies/${editingJob.id}`, formData);
        toast.success('Job posting updated successfully');
      } else {
        await api.post('/vacancies', formData);
        toast.success('New job posted successfully');
      }
      fetchVacancies();
      handleCloseModal();
    } catch (err: any) {
      console.error('Submit failed', err);
      toast.error(err.response?.data?.message || 'Failed to save job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job posting? This will also remove all associated applications.')) return;
    
    try {
      await api.delete(`/vacancies/${id}`);
      toast.success('Job posting deleted');
      setVacancies(vacancies.filter(v => v.id !== id));
    } catch (err) {
      toast.error('Failed to delete job posting');
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Job Postings</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage your job openings</h1>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Vacancy</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your vacancies...</p>
        </div>
      ) : vacancies.length === 0 ? (
        <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl p-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center mx-auto text-slate-700">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No job postings found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              You haven't posted any job vacancies yet. Start by creating your first job opening to find great talent.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Vacancy</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <JobManagementCard 
              key={vacancy.id} 
              vacancy={vacancy} 
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white">
                {editingJob ? 'Update Vacancy' : 'Post New Vacancy'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Job Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Product Designer"
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Location</label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Jakarta, Remote"
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Job Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                      className={`w-full flex items-center justify-between px-5 py-3 rounded-xl bg-slate-950 border transition-all ${
                        openDropdown === 'type' ? 'border-indigo-500/60 ring-2 ring-indigo-500/20' : 'border-slate-800'
                      }`}
                    >
                      <span className="text-sm font-medium text-white ring-0">
                        {formData.job_type.charAt(0).toUpperCase() + formData.job_type.slice(1)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
                    </button>

                    {openDropdown === 'type' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-200">
                        {['full-time', 'part-time', 'contract', 'remote', 'internship'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, job_type: type});
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                              formData.job_type === type 
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Salary (Optional)</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g. IDR 10M - 15M"
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Experience Level</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                      className={`w-full flex items-center justify-between px-5 py-3 rounded-xl bg-slate-950 border transition-all ${
                        openDropdown === 'level' ? 'border-purple-500/60 ring-2 ring-purple-500/20' : 'border-slate-800'
                      }`}
                    >
                      <span className="text-sm font-medium text-white">
                        {formData.experience_level === 'mid' ? 'Mid-Level' : 
                         formData.experience_level === 'lead' ? 'Lead/Manager' :
                         formData.experience_level.charAt(0).toUpperCase() + formData.experience_level.slice(1)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} />
                    </button>

                    {openDropdown === 'level' && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-200">
                        {[
                          {val: 'junior', lab: 'Junior'},
                          {val: 'mid', lab: 'Mid-Level'},
                          {val: 'senior', lab: 'Senior'},
                          {val: 'lead', lab: 'Lead/Manager'},
                        ].map((level) => (
                          <button
                            key={level.val}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, experience_level: level.val});
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                              formData.experience_level === level.val 
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {level.lab}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-slate-950"
                  />
                  <label htmlFor="status" className="text-sm font-medium text-slate-300">
                    Publish immediately (Set to active)
                  </label>
                </div>
              </div>

              <div className="pt-4 flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingJob ? 'Update Job Posting' : 'Post Vacancy')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-8 py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import { Company } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CompanyProfilePage() {
  const { user, setAuth } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    location: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      router.push('/login');
      return;
    }

    const fetchCompany = async () => {
      try {
        const response = await api.get('/company/my');
        const company = response.data;
        setFormData({
          name: company.name,
          email: company.email,
          website: company.website || '',
          location: company.location,
          description: company.description || '',
        });
      } catch (err) {
        console.error('Failed to fetch company', err);
        toast.error('Failed to load company profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.put('/company/my', formData);
      toast.success('Company profile updated successfully');
      
      // Update local user state if necessary
      if (user) {
        const updatedUser = { ...user, company: response.data };
        const token = localStorage.getItem('token') || '';
        setAuth(updatedUser, token);
      }
    } catch (err: any) {
      console.error('Update failed', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Company Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Company Presence</h1>
          <p className="text-slate-400 mt-2">
            Update your company information to attract the right candidates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Preview/Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-xl shadow-indigo-500/20">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{formData.name}</h2>
              <p className="text-slate-400 text-sm flex items-center justify-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {formData.location}
              </p>
            </div>
            
            <div className="pt-4 flex flex-col gap-2">
               {formData.website && (
                 <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 text-xs flex items-center justify-center gap-2 transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                    {formData.website.replace(/^https?:\/\//, '')}
                 </a>
               )}
               <div className="text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  {formData.email}
               </div>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl space-y-3">
             <div className="flex items-center gap-2 text-indigo-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Hiring Mode</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
                Your company profile is public. Make sure your description highlights why candidates should join your team.
             </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Acme Inc."
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@company.com"
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://company.com"
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Office Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Jakarta, Indonesia"
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Company Description</label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell potential candidates about your company..."
                  className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

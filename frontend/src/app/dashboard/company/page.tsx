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
  CheckCircle2,
  Upload
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
    logo: null as Blob | null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
          logo: null
        });
        if (company.logo_path) {
          setPreviewImage(`http://127.0.0.1:8000/storage/${company.logo_path}`);
        }
      } catch (err) {
        console.error('Failed to fetch company', err);
        toast.error('Failed to load company profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [user, router]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreviewImage(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('website', formData.website);
      data.append('location', formData.location);
      data.append('description', formData.description);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      // Use POST with _method=PUT for multipart updates in Laravel
      const response = await api.post('/company/my?_method=PUT', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Company profile updated successfully');
      
      // Update local user state
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
          <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-1">
            <Link href="/dashboard" className="hover:text-indigo-300 transition-colors">Dashboard</Link>
            <span className="text-slate-700">/</span>
            <span>Settings</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Company Profile</h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage your public identity and brand presence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Preview/Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card/90 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] text-center space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Building2 className="w-24 h-24" />
            </div>

            <div className="relative group/avatar inline-block">
              <input type="file" id="logo-input" className="hidden" accept="image/*" onChange={onSelectFile} />
              <label htmlFor="logo-input" className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-2 border-dashed border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-500 text-4xl font-black shadow-inner cursor-pointer hover:scale-105 transition-transform duration-500 overflow-hidden group/label relative">
                {previewImage ? (
                  <img src={previewImage} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  formData.name ? formData.name.charAt(0) : 'C'
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/label:opacity-100 flex items-center justify-center transition-opacity">
                   <Upload className="w-8 h-8 text-white" />
                </div>
              </label>
              {formData.logo && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in duration-300">
                   <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="space-y-1 relative z-10">
              <h2 className="text-2xl font-black text-foreground tracking-tight">{formData.name || 'Company Name'}</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {formData.location || 'Location'}
              </p>
            </div>
            
            <div className="pt-4 flex flex-col gap-2 relative z-10">
               {formData.website && (
                 <a href={formData.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-background border border-border text-slate-500 hover:text-indigo-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900">
                    <Globe className="w-4 h-4" />
                    Visit Website
                 </a>
               )}
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-8 rounded-[2rem] space-y-4 shadow-lg shadow-indigo-500/5">
             <div className="flex items-center gap-3 text-indigo-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Verified Presence</span>
             </div>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Your company profile is public. Optimized branding helps attract 40% more high-quality candidates.
             </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card/90 backdrop-blur-xl border border-border p-8 md:p-10 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Acme Tech Solutions"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-background border border-border text-foreground placeholder:text-slate-700/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Corporate Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@company.com"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-background border border-border text-foreground placeholder:text-slate-700/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Website URL</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <Globe className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://company.com"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-background border border-border text-foreground placeholder:text-slate-700/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Main Office Location</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Silicon Valley, CA"
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-background border border-border text-foreground placeholder:text-slate-700/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company Pitch / Description</label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell potential candidates about your culture, mission, and why they should join you..."
                  className="w-full px-6 py-5 rounded-3xl bg-background border border-border text-foreground placeholder:text-slate-700/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all resize-none font-medium leading-relaxed"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-4 py-5 rounded-3xl bg-indigo-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 active:scale-95 text-xs"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Push Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

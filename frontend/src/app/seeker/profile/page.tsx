'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Upload, 
  Plus, 
  X, 
  Loader2, 
  Save, 
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SeekerProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    summary: '',
    skills: '',
    resume: null as File | null
  });

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        const data = response.data;
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.profile?.phone || '',
          summary: data.profile?.summary || '',
          skills: data.profile?.skills || '',
          resume: null
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('summary', formData.summary);
      data.append('skills', formData.skills);
      if (formData.resume) {
        data.append('resume', formData.resume);
      }

      const response = await api.post('/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUser(response.data); // Update global auth store
      setProfile(response.data);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Update failed', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing your profile...</p>
      </div>
    );
  }

  const skillArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s !== '') : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Profile Header Hero */}
      <div className="relative mb-12 rounded-[3.5rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-5xl md:text-7xl font-black shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500 cursor-pointer overflow-hidden border-4 border-slate-900">
               {profile?.name?.charAt(0) || 'U'}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <Upload className="w-10 h-10" />
               </div>
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tight leading-none">{profile?.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-400 text-sm">
                 <Mail className="w-4 h-4 text-indigo-400" />
                 {profile?.email}
               </span>
               <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-400 text-sm">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
                 Verified Seeker
               </span>
               <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold uppercase tracking-widest">
                 {user?.role}
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
           {[
             { id: 'profile', name: 'General Information', icon: User },
             { id: 'skills', name: 'Professional Skills', icon: Zap },
             { id: 'resume', name: 'Resume & Documents', icon: FileText },
             { id: 'settings', name: 'Account Settings', icon: Settings },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm border ${
                 activeTab === tab.id 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' 
                  : 'bg-slate-900 shadow-sm text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
               }`}
             >
               <tab.icon className="w-5 h-5 shrink-0" />
               <span>{tab.name}</span>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 md:p-14 space-y-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>

            {/* General Info */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">General Information</h3>
                  <p className="text-slate-500 text-sm">Update your public name and contact details.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                      placeholder="+62 ..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Professional Summary</label>
                  <textarea
                    rows={6}
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium resize-none leading-relaxed"
                    placeholder="Briefly describe your career goals and expertise..."
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Your Professional Skills</h3>
                  <p className="text-slate-500 text-sm">List technologies or competencies you excel at.</p>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Manage Skills (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                      placeholder="React, Laravel, UI/UX Design..."
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    {skillArray.length > 0 ? skillArray.map((skill, i) => (
                      <span key={i} className="px-5 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold flex items-center gap-2 animate-in zoom-in-75">
                        {skill}
                        <X className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
                      </span>
                    )) : (
                      <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl w-full text-center text-slate-600">
                         No skills listed yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Master Resume</h3>
                  <p className="text-slate-500 text-sm">Upload a default PDF resume to apply for jobs faster.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf"
                      id="resume-up"
                      className="hidden"
                      onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})}
                    />
                    <label 
                      htmlFor="resume-up" 
                      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 cursor-pointer ${
                        formData.resume || profile?.profile?.resume_path 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : 'border-slate-800 bg-slate-950/50 hover:border-indigo-500/40 hover:bg-slate-900'
                      }`}
                    >
                      {(formData.resume || profile?.profile?.resume_path) ? (
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                             <FileText className="w-10 h-10" />
                           </div>
                           <div className="text-center">
                             <p className="text-xl font-black text-white">{formData.resume?.name || 'Resume Uploaded'}</p>
                             <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2 justify-center">
                               <CheckCircle2 className="w-4 h-4" /> Valid PDF Profiled
                             </p>
                           </div>
                           <span className="mt-4 px-6 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700">Change Document</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                            <Upload className="w-10 h-10" />
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-white">Upload your resume</p>
                            <p className="text-slate-500 text-sm mt-1">Microsoft Word / PDF (max. 2MB)</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-10 flex flex-col md:flex-row gap-5 border-t border-slate-800/80">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-10 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                  <span>Save Profile Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-10 py-5 rounded-[2rem] bg-slate-800 text-white font-black hover:bg-slate-700 transition-all"
                >
                  Discard
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

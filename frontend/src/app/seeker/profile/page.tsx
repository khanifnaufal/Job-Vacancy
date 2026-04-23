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
  CheckCircle2,
  ExternalLink,
  Code,
  Globe,
  Briefcase,
  GraduationCap,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Layout,
  Award,
  AlertTriangle
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/common/BrandIcons';
import api from '@/lib/api';
import { toast } from 'sonner';
import ImageCropperModal from '@/components/profile/ImageCropperModal';
import HistoryItemForm from '@/components/profile/HistoryItemForm';
import { User as UserType, WorkExperience, Education, Certificate } from '@/types';

export default function SeekerProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cropping State
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyType, setHistoryType] = useState<'experience' | 'education' | 'certificate'>('experience');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: string, id: number} | null>(null);
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    summary: '',
    skills: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    resume: null as File | null,
    avatar: null as Blob | null
  });

  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  // Handle Hydration
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return; // Wait for store to hydrate
    
    if (!user) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [user, router, hasHydrated]);

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
        linkedin_url: data.profile?.linkedin_url || '',
        github_url: data.profile?.github_url || '',
        portfolio_url: data.profile?.portfolio_url || '',
        resume: null,
        avatar: null
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('summary', formData.summary);
      data.append('skills', formData.skills);
      data.append('linkedin_url', formData.linkedin_url);
      data.append('github_url', formData.github_url);
      data.append('portfolio_url', formData.portfolio_url);
      
      if (formData.resume) {
        data.append('resume', formData.resume);
      }
      
      if (formData.avatar) {
        data.append('avatar', formData.avatar, 'avatar.jpg');
      }

      const response = await api.post('/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUser(response.data); // Update global auth store
      setProfile(response.data);
      toast.success('Profile updated successfully!');
      
      // Clear blobs/files after success
      setFormData(prev => ({ ...prev, resume: null, avatar: null }));
    } catch (err: any) {
      console.error('Update failed', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/change-password', passwordData);
      toast.success('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (err: any) {
      console.error('Password change failed', err);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || 'Failed to update password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    try {
      await api.delete('/delete-account');
      // Clear state immediately on success
      useAuthStore.getState().logout();
      toast.success('Account permanently deleted');
      router.push('/register');
    } catch (err: any) {
      console.error('Account deletion failed', err);
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsSubmitting(false);
      setShowAccountDeleteModal(false);
    }
  };

  const calculateCompleteness = () => {
    if (!profile) return { score: 0, missing: [] };
    let score = 0;
    const missing = [];
    
    // Phone: 10%
    if (profile.profile?.phone) {
      score += 10;
    } else {
      missing.push('Phone Number');
    }

    // Summary/Bio: 10%
    if (profile.profile?.summary && profile.profile.summary.length > 20) {
      score += 10;
    } else {
      missing.push('Professional Summary');
    }

    // Skills: 10%
    if (profile.profile?.skills) {
      score += 10;
    } else {
      missing.push('Skills');
    }

    // Resume: 20%
    if (profile.profile?.resume_path) {
      score += 20;
    } else {
      missing.push('Resume File');
    }

    // Avatar: 10%
    if (profile.profile?.avatar_path) {
      score += 10;
    } else {
      missing.push('Profile Picture');
    }

    // Work Experience: 15% (at least one)
    if ((profile.work_experiences?.length || 0) > 0) {
      score += 15;
    } else {
      missing.push('Work Experience');
    }

    // Education: 15% (at least one)
    if ((profile.educations?.length || 0) > 0) {
      score += 15;
    } else {
      missing.push('Education History');
    }

    // Certificates: 10% (at least one)
    if ((profile.certificates?.length || 0) > 0) {
      score += 10;
    } else {
      missing.push('Certifications');
    }
    
    return { score, missing };
  };

  // History Management
  const handleSaveHistory = async (data: any) => {
    try {
      if (historyType === 'certificate') {
        const formData = new FormData();
        ['name', 'issuing_organization', 'issue_date', 'expiration_date', 'credential_url'].forEach(field => {
          if (data[field]) formData.append(field, data[field]);
        });
        
        if (data.certificate_file) {
          formData.append('certificate_file', data.certificate_file);
        }

        if (editingItem) {
          formData.append('_method', 'PUT');
          await api.post(`/profile/certificate/${editingItem.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Certificate updated!');
        } else {
          await api.post('/profile/certificate', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Certificate added!');
        }
      } else {
        const sanitizedData: any = {};
        const fields = historyType === 'experience' 
          ? ['company', 'title', 'location', 'start_date', 'end_date', 'is_current', 'description']
          : ['institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'description'];
          
        fields.forEach(field => {
          sanitizedData[field] = data[field] === '' ? null : data[field];
        });

        if (editingItem) {
          await api.put(`/profile/${historyType}/${editingItem.id}`, sanitizedData);
          toast.success(`${historyType === 'experience' ? 'Experience' : 'Education'} updated!`);
        } else {
          await api.post(`/profile/${historyType}`, sanitizedData);
          toast.success(`${historyType === 'experience' ? 'Experience' : 'Education'} added!`);
        }
      }

      fetchProfile();
    } catch (err: any) {
      console.error('History save failed', err);
      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
        Object.values(err.response.data.errors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || 'Failed to save history item');
      }
      throw err;
    }
  };

  const initiateDelete = (type: string, id: number) => {
    setDeleteTarget({ type, id });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      await api.delete(`/profile/${type}/${id}`);
      toast.success('Entry deleted');
      fetchProfile();
    } catch (err: any) {
      console.error('Delete failed', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to delete entry');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result?.toString() || null);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
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
      <div className="relative mb-12 rounded-[3.5rem] overflow-hidden bg-card dark:bg-slate-900 border border-border shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <input type="file" id="avatar-input" className="hidden" accept="image/*" onChange={onSelectFile} />
            <label htmlFor="avatar-input" className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-5xl md:text-7xl font-black shadow-2xl shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-500 cursor-pointer overflow-hidden border-4 border-card dark:border-slate-900">
               {profile?.profile?.avatar_path ? (
                 <img src={`http://127.0.0.1:8000/storage/${profile.profile.avatar_path}`} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 profile?.name?.charAt(0) || 'U'
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <Upload className="w-10 h-10" />
               </div>
            </label>
            {formData.avatar && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left space-y-2 flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-foreground dark:text-white tracking-tight leading-none">{profile?.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card dark:bg-slate-950/50 border border-border dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-xs">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  {profile?.email}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card dark:bg-slate-950/50 border border-border dark:border-slate-800/80 text-slate-500 dark:text-slate-400 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Seeker
                </span>
               <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                 {user?.role}
               </span>
             </div>
             
             {/* Integrated Hero Social Links */}
             <div className="flex items-center gap-2 pt-1 justify-center md:justify-start">
                 {profile?.profile?.linkedin_url && (
                   <a href={profile.profile.linkedin_url} target="_blank" className="p-2 rounded-lg bg-background dark:bg-slate-950/40 text-blue-500 dark:text-blue-400 border border-border dark:border-slate-800/50 hover:bg-blue-400/10 hover:border-blue-500/30 transition-all">
                      <LinkedinIcon className="w-4 h-4" />
                   </a>
                 )}
                 {profile?.profile?.github_url && (
                   <a href={profile.profile.github_url} target="_blank" className="p-2 rounded-lg bg-background dark:bg-slate-950/40 text-foreground dark:text-white border border-border dark:border-slate-800/50 hover:bg-white/10 hover:border-white/30 transition-all">
                      <GithubIcon className="w-4 h-4" />
                   </a>
                 )}
                 {profile?.profile?.portfolio_url && (
                   <a href={profile.profile.portfolio_url} target="_blank" className="p-2 rounded-lg bg-background dark:bg-slate-950/40 text-emerald-600 dark:text-emerald-400 border border-border dark:border-slate-800/50 hover:bg-emerald-400/10 hover:border-emerald-500/30 transition-all">
                      <Globe className="w-4 h-4" />
                   </a>
                 )}
             </div>
          </div>

          {/* Completeness Score */}
          {(() => {
            const { score, missing } = calculateCompleteness();
            return (
              <div className="md:w-72 w-full space-y-4 bg-background dark:bg-slate-950/60 p-6 rounded-[2rem] border border-border dark:border-slate-800/50 backdrop-blur-md shadow-2xl relative group">
                 <div className="flex items-center gap-3 justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Profile Strength</span>
                    <span className={`text-sm font-black ${
                      score >= 100 ? 'text-emerald-500' : 
                      score >= 70 ? 'text-indigo-600' : 'text-amber-600'
                    }`}>
                      {score}%
                    </span>
                 </div>
                 <div className="h-3 w-full bg-background dark:bg-slate-901 rounded-full overflow-hidden border border-border dark:border-slate-800/50 p-0.5">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out rounded-full ${
                        score >= 100 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
                        score >= 70 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                 </div>
                 
                 {score < 100 && missing.length > 0 && (
                   <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        Missing Information:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {missing.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-card border border-border dark:border-slate-800 text-slate-500 dark:text-slate-400">
                            {item}
                          </span>
                        ))}
                        {missing.length > 3 && (
                          <span key="more" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-card border border-border dark:border-slate-800 text-slate-500">
                            +{missing.length - 3} more
                          </span>
                        )}
                      </div>
                   </div>
                 )}

                 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-center pt-2 border-t border-border dark:border-slate-800/30">
                    {score < 100 ? 'Complete these to stand out' : 'Your profile is fully optimized!'}
                 </p>
              </div>
            );
          })()}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
           {[
             { id: 'overview', name: 'Profile Overview', icon: Layout },
             { id: 'profile', name: 'General Information', icon: User },
             { id: 'experience', name: 'Work Experience', icon: Briefcase },
             { id: 'education', name: 'Education History', icon: GraduationCap },
             { id: 'certificates', name: 'Certifications', icon: Award },
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
                  : 'bg-card dark:bg-slate-900 shadow-sm text-slate-500 dark:text-slate-400 border-border dark:border-slate-800 hover:border-primary/30 hover:text-primary dark:hover:text-white'
               }`}
             >
               <tab.icon className="w-5 h-5 shrink-0" />
               <span>{tab.name}</span>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-card dark:bg-slate-900 border border-border dark:border-slate-800 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>

            {/* Profile Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-10">
                  {/* Main Profile Column */}
                  <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-foreground dark:text-white">Profile Overview</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">A consolidated summary of your career assets.</p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-background dark:bg-slate-950/50 border border-border dark:border-slate-800/50 relative overflow-hidden group shadow-xl">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                          <User className="w-32 h-32 text-indigo-500" />
                       </div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                          <Edit2 className="w-3 h-3" /> Professional Bio
                       </h4>
                       <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                         "{profile?.profile?.summary || "Add a professional summary to tell recruiters about your goals and expertise."}"
                       </p>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border dark:border-slate-800/50">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Key Achievements & History</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 rounded-[2rem] bg-background dark:bg-slate-950/30 border border-border dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all">
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">Latest Experience</h5>
                             {profile?.work_experiences?.[0] ? (
                               <div className="space-y-2">
                                  <p className="text-base font-bold text-foreground dark:text-white leading-tight">{profile.work_experiences[0].title}</p>
                                  <p className="text-xs text-slate-500 font-bold uppercase">{profile.work_experiences[0].company}</p>
                               </div>
                             ) : (
                               <p className="text-xs text-slate-400 italic">No experience listed.</p>
                             )}
                          </div>
                          <div className="p-6 rounded-[2rem] bg-background dark:bg-slate-950/30 border border-border dark:border-slate-800/50 group hover:border-emerald-500/30 transition-all">
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">Highest Education</h5>
                             {profile?.educations?.[0] ? (
                               <div className="space-y-2">
                                  <p className="text-base font-bold text-foreground dark:text-white leading-tight">{profile.educations[0].degree}</p>
                                  <p className="text-xs text-slate-500 font-bold uppercase truncate">{profile.educations[0].institution}</p>
                               </div>
                             ) : (
                                 <p className="text-xs text-slate-400 italic">No education listed.</p>
                               )}
                           </div>
                           <div className="p-6 rounded-[2rem] bg-background dark:bg-slate-950/30 border border-border dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all md:col-span-2">
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">Latest Certification</h5>
                              {profile?.certificates?.[0] ? (
                                <div className="flex items-center justify-between">
                                  <div className="space-y-2">
                                     <p className="text-base font-bold text-foreground dark:text-white leading-tight">{profile.certificates[0].name}</p>
                                     <p className="text-xs text-slate-500 font-bold uppercase">{profile.certificates[0].issuing_organization}</p>
                                  </div>
                                  <Award className="w-8 h-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-all" />
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">No certifications listed.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Sidebar Profile Column */}
                  <div className="lg:col-span-1 space-y-8">
                     <div className="p-8 rounded-[2.5rem] bg-slate-950/80 border border-slate-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-2">
                           <Layout className="w-3 h-3 text-indigo-500" /> Career Metrics
                        </h4>
                        <div className="space-y-6">
                           <div className="flex items-center justify-between group/stat">
                              <span className="text-xs font-bold text-slate-500 group-hover/stat:text-slate-700 dark:group-hover/stat:text-slate-300 transition-colors">Work History</span>
                              <span className="text-[10px] font-black text-foreground dark:text-white bg-background dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-border dark:border-slate-700">
                                 {profile?.work_experiences?.length || 0} Positions
                              </span>
                           </div>
                           <div className="flex items-center justify-between group/stat">
                              <span className="text-xs font-bold text-slate-500 group-hover/stat:text-slate-700 dark:group-hover/stat:text-slate-300 transition-colors">Academic History</span>
                              <span className="text-[10px] font-black text-foreground dark:text-white bg-background dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-border dark:border-slate-700">
                                 {profile?.educations?.length || 0} Degrees
                              </span>
                           </div>
                           <div className="flex items-center justify-between group/stat">
                              <span className="text-xs font-bold text-slate-500 group-hover/stat:text-slate-700 dark:group-hover/stat:text-slate-300 transition-colors">Certifications</span>
                              <span className="text-[10px] font-black text-foreground dark:text-white bg-background dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-border dark:border-slate-700">
                                 {profile?.certificates?.length || 0} Earned
                              </span>
                           </div>
                           <div className="pt-6 border-t border-slate-800/50">
                              <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10">
                                 <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Master Resume</span>
                                 <CheckCircle2 className={`w-5 h-5 ${profile?.profile?.resume_path ? 'text-emerald-500' : 'text-slate-700'}`} />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 shadow-lg">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                           <Zap className="w-3 h-3" /> Professional Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {skillArray.length > 0 ? skillArray.map((s, i) => (
                             <span key={i} className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-black text-indigo-300 uppercase tracking-widest hover:border-indigo-500/40 transition-all cursor-default">
                               {s}
                             </span>
                           )) : <span className="text-xs text-slate-600 italic">No skills added yet.</span>}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Info */}
            {activeTab === 'profile' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground dark:text-white">General Information</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Update your public name and contact details.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
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
                      className="w-full px-6 py-4 rounded-2xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium resize-none leading-relaxed"
                      placeholder="Briefly describe your career goals and expertise..."
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-8 pt-8 border-t border-slate-800/50">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground dark:text-white">Social Presence</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Link your professional profiles for recruiters to see.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-blue-400" /> LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                        <Code className="w-4 h-4 text-white" /> GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={formData.github_url}
                        onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-400" /> Portfolio Website
                      </label>
                      <input
                        type="url"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience & Education Tabs */}
            {(activeTab === 'experience' || activeTab === 'education') && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-foreground dark:text-white">
                      {activeTab === 'experience' ? 'Work Experience' : 'Education History'}
                    </h3>
                    <p className="text-slate-500 text-sm">
                      {activeTab === 'experience' 
                        ? 'Highlight your professional journey and key achievements.' 
                        : 'List your degrees and institutional backgrounds.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setHistoryType(activeTab as any);
                      setEditingItem(null);
                      setShowHistoryModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add {activeTab === 'experience' ? 'Position' : 'Education'}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {((activeTab === 'experience' ? profile?.work_experiences : profile?.educations) || []).length > 0 ? (
                    (activeTab === 'experience' ? profile?.work_experiences : profile?.educations)?.map((item: any) => (
                      <div key={item.id} className="group bg-slate-950/40 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all relative">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-background dark:bg-slate-900 border border-border dark:border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                              {activeTab === 'experience' ? <Briefcase className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xl font-bold text-foreground dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {activeTab === 'experience' ? item.title : item.degree}
                              </h4>
                              <p className="text-slate-300 font-medium flex items-center gap-2">
                                {activeTab === 'experience' ? item.company : item.institution}
                                {activeTab === 'experience' && item.location && (
                                  <span className="text-slate-500 font-normal flex items-center gap-1.5 ml-2">
                                     <MapPin className="w-3.5 h-3.5" /> {item.location}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-2 uppercase tracking-widest font-bold">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(item.start_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} — 
                                {item.is_current ? ' PRESENT' : item.end_date ? new Date(item.end_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ' N/A'}
                              </p>
                              {item.description && <p className="text-slate-400 text-sm leading-relaxed mt-4 line-clamp-3">{item.description}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                               onClick={() => {
                                 setHistoryType(activeTab as any);
                                 setEditingItem(item);
                                 setShowHistoryModal(true);
                               }}
                               className="p-3 rounded-xl bg-background dark:bg-slate-900 text-slate-400 hover:text-indigo-600 dark:hover:text-white border border-border dark:border-transparent transition-all"
                            >
                               <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button 
                              onClick={() => initiateDelete(activeTab, item.id)}
                              className="p-3 rounded-xl bg-slate-900 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                      <p className="text-slate-500">No entries yet. Click the button above to add one.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white">Professional Certifications</h3>
                    <p className="text-slate-500 text-sm">Showcase your verified skills and credentials.</p>
                  </div>
                  <button
                    onClick={() => {
                      setHistoryType('certificate');
                      setEditingItem(null);
                      setShowHistoryModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Certificate</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {(profile?.certificates || []).length > 0 ? (
                    profile?.certificates?.map((item: any) => (
                      <div key={item.id} className="group bg-slate-950/40 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all relative">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                              <Award className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-slate-300 font-medium">{item.issuing_organization}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-2 uppercase tracking-widest font-bold">
                                <Calendar className="w-3.5 h-3.5" />
                                Issued: {new Date(item.issue_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} 
                                {item.expiration_date && ` — Exp: ${new Date(item.expiration_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-4">
                                {item.credential_url && (
                                  <a 
                                    href={item.credential_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition-all"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" /> Verify Credential
                                  </a>
                                )}
                                {item.file_path && (
                                  <a 
                                    href={`http://127.0.0.1:8000/storage/${item.file_path}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> View PDF
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setHistoryType('certificate');
                                setEditingItem(item);
                                setShowHistoryModal(true);
                              }}
                              className="p-3 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                            >
                              <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button 
                              onClick={() => initiateDelete('certificate', item.id)}
                              className="p-3 rounded-xl bg-slate-900 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                      <p className="text-slate-500">No certifications added yet. Click the button above to add one!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills Content */}
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

            {/* Resume Content */}
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
            {/* Account Settings Content */}
            {activeTab === 'settings' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-foreground dark:text-white">Account Settings</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your security and account preferences.</p>
                </div>
                
                <div className="p-8 md:p-10 rounded-[2.5rem] bg-background dark:bg-slate-950/40 border border-border dark:border-slate-800/80 shadow-inner">
                  <form onSubmit={handlePasswordChange} className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground dark:text-white">Change Password</h4>
                        <p className="text-xs text-slate-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-card dark:bg-slate-900 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">New Password</label>
                          <input
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-card dark:bg-slate-900 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                            placeholder="Min. 8 characters"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.new_password_confirmation}
                            onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                            className="w-full px-6 py-4 rounded-2xl bg-card dark:bg-slate-900 border border-border dark:border-slate-800 text-foreground dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-500/10 hover:bg-slate-800 dark:hover:bg-indigo-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div className="p-10 rounded-[3rem] bg-rose-500/5 border border-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-lg font-bold text-rose-500 flex items-center gap-2 justify-center md:justify-start">
                      <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h4>
                    <p className="text-xs text-rose-500/60 font-medium">Permanently delete your account and all associated data.</p>
                  </div>
                  <button 
                    onClick={() => setShowAccountDeleteModal(true)}
                    className="px-8 py-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-10 flex flex-col md:flex-row gap-5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleSubmit}
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
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onCropComplete={(blob) => {
            setFormData({ ...formData, avatar: blob });
            setShowCropper(false);
          }}
          onClose={() => setShowCropper(false)}
        />
      )}

      {showHistoryModal && (
        <HistoryItemForm
          type={historyType}
          item={editingItem}
          onSave={handleSaveHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Confirm Deletion</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Are you sure you want to remove this entry? This action is permanent and cannot be undone.
                </p>
              </div>
              <div className="w-full flex flex-col gap-3 pt-4">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black hover:bg-rose-600 transition-all hover:scale-[1.02]"
                >
                  Yes, Delete Item
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Account Delete Confirmation Modal */}
      {showAccountDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setShowAccountDeleteModal(false)} />
          <div className="relative w-full max-w-md bg-card dark:bg-slate-900 border border-border dark:border-slate-800 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="w-24 h-24 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 animate-pulse">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-foreground dark:text-white">Is this goodbye? 🥺</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Deleting your account will remove all your data, applications, and profile history. This action <span className="text-rose-500 font-black uppercase">cannot be undone</span>.
                </p>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                <button
                  disabled={isSubmitting}
                  onClick={handleDeleteAccount}
                  className="w-full py-5 rounded-2xl bg-rose-600 text-white font-black text-lg hover:bg-rose-500 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Delete Everything"}
                </button>
                <button
                  onClick={() => setShowAccountDeleteModal(false)}
                  className="w-full py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-border dark:border-transparent"
                >
                  I want to stay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

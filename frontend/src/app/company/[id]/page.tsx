'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Company, Vacancy } from '@/types';
import JobCard from '@/components/JobCard';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Briefcase, 
  Calendar,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function CompanyProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company & { vacancies: Vacancy[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get(`/companies/${id}`);
        setCompany(response.data);
      } catch (err) {
        console.error('Failed to fetch company', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-foreground">Company not found</h2>
        <Link href="/" className="text-indigo-500 hover:underline mt-4 inline-block">Back to Job Board</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors font-semibold group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Company Header Card */}
      <div className="relative bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            {/* Logo container */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {company.logo_path ? (
                <img 
                  src={`http://127.0.0.1:8000/storage/${company.logo_path}`} 
                  alt={company.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-700" />
              )}
            </div>

            <div className="space-y-4 flex-grow">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {company.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(company.created_at!).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener" 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all font-bold text-xs"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                <a 
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold text-xs"
                >
                  <Mail className="w-4 h-4" />
                  Contact Email
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-950/50 rounded-3xl border border-border shrink-0">
               <span className="text-3xl font-black text-indigo-500">{company.vacancies?.length || 0}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Open Positions</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-indigo-500" />
              About the Company
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {company.description}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 ml-2">
              <Briefcase className="w-6 h-6 text-sky-400" />
              Open Vacancies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {company.vacancies && company.vacancies.length > 0 ? (
                company.vacancies.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-card border border-border border-dashed rounded-[2rem]">
                  <p className="text-slate-500 font-medium italic">No active vacancies at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-500/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
              <div className="relative z-10 space-y-4">
                 <h3 className="text-xl font-bold">Interested in joining?</h3>
                 <p className="text-indigo-100/70 text-sm leading-relaxed">
                   Check out our active listings and apply directly. We're always looking for great talent to join our team.
                 </p>
                 <button className="w-full py-3 bg-white text-indigo-600 font-black rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                   Follow Company
                 </button>
              </div>
           </div>
           
           <div className="bg-card border border-border rounded-[2rem] p-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Company Location</h4>
              <div className="space-y-4">
                 <div className="aspect-video w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border flex items-center justify-center text-slate-400">
                    <MapPin className="w-8 h-8 opacity-20" />
                 </div>
                 <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                   {company.location}
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

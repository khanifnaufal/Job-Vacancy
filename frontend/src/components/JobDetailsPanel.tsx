'use client';

import { Vacancy } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, DollarSign, Clock, Briefcase, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface JobDetailsPanelProps {
  job: Vacancy | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailsPanel({ job, isOpen, onClose }: JobDetailsPanelProps) {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[110]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-card border-l border-border shadow-2xl z-[120] overflow-y-auto"
          >
            <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-500">
                   {typeof job.company === 'object' ? job.company?.name.charAt(0) : (job.company_name?.charAt(0) || 'H')}
                </div>
                <div>
                   <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Job Details</h2>
                   <p className="text-xs font-bold text-indigo-500 truncate max-w-[200px]">{job.title}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8 pb-24">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                   </span>
                   <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> {job.job_type}
                   </span>
                </div>
                
                <h1 className="text-4xl font-black tracking-tighter text-foreground leading-tight">
                  {job.title}
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Company</span>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      {typeof job.company === 'object' ? job.company?.name : job.company_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</span>
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {job.location}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Salary</span>
                    <p className="font-bold text-emerald-500 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {job.salary || 'Undisclosed'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black tracking-tight text-foreground">About the position</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:font-medium prose-p:text-slate-400 prose-li:text-slate-400">
                  <ReactMarkdown>{job.description}</ReactMarkdown>
                </div>
              </div>

              {job.experience_level && (
                <div className="space-y-4">
                  <h3 className="text-xl font-black tracking-tight text-foreground">Requirements</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                       <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 block mb-0.5">Level</span>
                       <span className="text-sm font-bold text-foreground">{job.experience_level}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="fixed bottom-0 right-0 w-full max-w-2xl bg-card/80 backdrop-blur-xl border-t border-border p-6 flex items-center gap-4 z-30">
               <Link 
                 href={`/vacancy/${job.id}`}
                 className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
               >
                 Apply Now <ExternalLink className="w-4 h-4" />
               </Link>
               <button className="p-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-all">
                  <Heart className="w-6 h-6" />
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

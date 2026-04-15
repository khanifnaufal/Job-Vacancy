import React, { useState } from 'react';
import { Application } from '@/types';
import { 
  FileText, 
  User, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  ExternalLink,
  ChevronDown,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '@/components/common/BrandIcons';
import StatusTimeline from '@/components/StatusTimeline';

interface ApplicationRowProps {
  application: Application;
  onUpdateStatus: (id: number, status: string, notes: string) => Promise<void>;
}

export default function ApplicationRow({ application, onUpdateStatus }: ApplicationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'accepted': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'interview': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'reviewed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await onUpdateStatus(application.id, status, notes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-indigo-500/30' : ''}`}>
      <div 
        className="p-6 cursor-pointer hover:bg-slate-900/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{application.user?.name}</h3>
              <p className="text-sm text-slate-400 flex items-center gap-1.5">
                Applied for <span className="text-slate-200 font-medium">{application.vacancy?.title}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(application.applied_at!).toLocaleDateString()}
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(application.status)}`}>
              {application.status}
            </div>

            <div className={`p-2 rounded-lg text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-900/40 animate-in slide-in-from-top-4 duration-300">
          {/* Detailed Candidate Profile Section */}
          <div className="p-8 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Profile Intro & Contacts */}
              <div className="lg:col-span-1 space-y-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contact & Socials</h4>
                    <div className="flex flex-col gap-3">
                       {application.user?.profile?.phone && (
                         <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                            <Phone className="w-4 h-4 text-indigo-400" />
                            <span>{application.user.profile.phone}</span>
                         </div>
                       )}
                       <div className="flex flex-wrap gap-2">
                          {application.user?.profile?.linkedin_url && (
                            <a href={application.user.profile.linkedin_url} target="_blank" rel="noopener" className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                               <LinkedinIcon className="w-4.5 h-4.5" />
                            </a>
                          )}
                          {application.user?.profile?.github_url && (
                            <a href={application.user.profile.github_url} target="_blank" rel="noopener" className="p-3 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all">
                               <GithubIcon className="w-4.5 h-4.5" />
                            </a>
                          )}
                          {application.user?.profile?.portfolio_url && (
                            <a href={application.user.profile.portfolio_url} target="_blank" rel="noopener" className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                               <Globe className="w-4.5 h-4.5" />
                            </a>
                          )}
                          <a 
                             href={`http://127.0.0.1:8000/storage/${application.resume_path}`} 
                             target="_blank" 
                             rel="noopener"
                             className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all"
                          >
                             <FileText className="w-4 h-4" />
                             Resume
                          </a>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                       {application.user?.profile?.skills ? application.user.profile.skills.split(',').map((skill, i) => (
                         <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {skill.trim()}
                         </span>
                       )) : <span className="text-xs text-slate-600 italic">No skills listed</span>}
                    </div>
                 </div>
              </div>

              {/* Bio & Professional Background */}
              <div className="lg:col-span-2 space-y-8">
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">About Candidate</h4>
                    <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 text-sm text-slate-300 leading-relaxed italic">
                       {application.user?.profile?.summary || "No professional summary provided."}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Professional History</h4>
                    
                    {/* Experience List */}
                    <div className="space-y-4">
                       {(application.user?.work_experiences || []).length > 0 ? application.user?.work_experiences?.map((exp, i) => (
                         <div key={i} className="flex gap-4 items-start relative pb-6 border-l-2 border-slate-800 pl-6 ml-2 last:border-0 last:pb-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-950 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <div className="space-y-1 -mt-1">
                               <h5 className="text-sm font-bold text-white">{exp.title} <span className="text-slate-500 font-medium">@ {exp.company}</span></h5>
                               <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : '?'}</span>
                                  {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>}
                               </div>
                            </div>
                         </div>
                       )) : (
                         <div className="text-xs text-slate-600 italic pl-2">No work experience listed</div>
                       )}

                       {/* Education List */}
                       {(application.user?.educations || []).length > 0 && (
                         <div className="mt-8 pt-6 border-t border-slate-800/50 space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Education</h5>
                            {application.user?.educations?.map((edu, i) => (
                              <div key={i} className="flex gap-4 items-start pl-2">
                                 <GraduationCap className="w-5 h-5 text-indigo-400/50 shrink-0" />
                                 <div className="space-y-0.5">
                                    <h6 className="text-xs font-bold text-slate-200">{edu.degree} in {edu.field_of_study}</h6>
                                    <p className="text-[10px] text-slate-500 font-medium">{edu.institution} • {new Date(edu.start_date).getFullYear()}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>

            {/* Timeline & Update Form Area */}
            <div className="pt-10 border-t border-slate-800/80 space-y-10">
              {application.status_logs && (
                <div className="bg-slate-950/20 rounded-[2.5rem] p-8 border border-slate-800/50">
                   <StatusTimeline logs={application.status_logs} currentStatus={application.status} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Internal Review Notes</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add private notes about this candidate..."
                    className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    rows={4}
                  ></textarea>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Applicant Review & Final Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'reviewed', label: 'Reviewed', icon: Clock, color: 'hover:border-blue-500/30' },
                        { id: 'interview', label: 'Interview', icon: MessageSquare, color: 'hover:border-amber-500/30' },
                        { id: 'accepted', label: 'Accept', icon: CheckCircle2, color: 'hover:border-emerald-500/30' },
                        { id: 'rejected', label: 'Reject', icon: XCircle, color: 'hover:border-rose-500/30' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStatus(s.id as any)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                            status === s.id 
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                              : `bg-slate-950 border-slate-800 text-slate-500 ${s.color}`
                          }`}
                        >
                          <s.icon className="w-4 h-4" />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting || (status === application.status && notes === (application.notes || ''))}
                    onClick={handleUpdate}
                    className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {isSubmitting ? 'Processing...' : 'Update Review Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

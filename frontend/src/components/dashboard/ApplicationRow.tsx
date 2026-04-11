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
  ChevronDown
} from 'lucide-react';

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
        <div className="p-8 border-t border-slate-800 bg-slate-900/40 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Applicant Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Cover Letter</h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {application.cover_letter || 'No cover letter provided.'}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a 
                  href={`http://127.0.0.1:8000/storage/${application.resume_path}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all border border-slate-700"
                >
                  <FileText className="w-4.5 h-4.5 text-indigo-400" />
                  <span>View Resume</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Review Section */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Applicant Review</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'reviewed', label: 'Reviewed', icon: Clock },
                    { id: 'interview', label: 'Interview', icon: MessageSquare },
                    { id: 'accepted', label: 'Accept', icon: CheckCircle2 },
                    { id: 'rejected', label: 'Reject', icon: XCircle },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id as any)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                        status === s.id 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <s.icon className="w-4 h-4" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Internal Notes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes about this candidate..."
                  className="w-full px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  rows={4}
                ></textarea>
              </div>

              <button
                disabled={isSubmitting || (status === application.status && notes === (application.notes || ''))}
                onClick={handleUpdate}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Update Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, FileText, Upload, Loader2, CheckCircle2, Zap } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ApplyModalProps {
  vacancyId: number;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const COVER_LETTER_STARTERS = [
  {
    label: "Enthusiastic",
    text: "I am extremely excited to apply for this position! With my strong background in React and modern web development, I believe I can bring immediate value to your engineering team. I have a passion for building user-centric products and would love to discuss how I can contribute."
  },
  {
    label: "Professional",
    text: "I am writing to express my strong interest in the [Job Title] position. My 5+ years of industry experience have equipped me with the technical skills and leadership qualities necessary to excel in this role. I look forward to the possibility of discussing my qualifications with you."
  },
  {
    label: "Skill-focused",
    text: "My expertise in Next.js, TypeScript, and Tailwind CSS aligns perfectly with the requirements for this role. In my previous position at [Company], I successfully led the development of several high-traffic applications, resulting in a 30% improvement in performance."
  }
];

export default function ApplyModal({ vacancyId, jobTitle, isOpen, onClose }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      toast.error('Please upload your resume (PDF)');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('vacancy_id', vacancyId.toString());
      formData.append('cover_letter', coverLetter);
      formData.append('resume', resume);

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSuccess(true);
      toast.success('Application submitted successfully!');
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setCoverLetter('');
        setResume(null);
      }, 2000);
    } catch (err: any) {
      console.error('Application failed', err);
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {isSuccess ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Application Sent!</h2>
              <p className="text-slate-400">Your application for <span className="text-indigo-400 font-semibold">{jobTitle}</span> has been received.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-bold text-white">Apply for Job</h2>
                <p className="text-sm text-slate-400 mt-1 line-clamp-1">{jobTitle}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Cover Letter */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Cover Letter (Optional)
                </label>
                  <textarea
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you are a great fit for this role..."
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none leading-relaxed"
                  ></textarea>

                  {/* Starters Section */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-500" />
                      Cover Letter Starters
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {COVER_LETTER_STARTERS.map((starter, i) => (
                         <button
                           key={i}
                           type="button"
                           onClick={() => setCoverLetter(starter.text)}
                           className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                         >
                           {starter.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

              {/* Resume Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Resume / CV (PDF)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label 
                    htmlFor="resume-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all duration-300 ${
                      resume 
                        ? 'border-emerald-500/30 bg-emerald-500/5' 
                        : 'border-slate-800 bg-slate-950/30 hover:border-indigo-500/40 hover:bg-indigo-500/5'
                    }`}
                  >
                    {resume ? (
                      <div className="flex items-center gap-4 text-emerald-400">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold truncate max-w-[200px]">{resume.name}</p>
                          <p className="text-xs opacity-70">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                          <Upload className="w-7 h-7" />
                        </div>
                        <p className="font-bold text-slate-300">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-500 mt-1">PDF files only (max. 2MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       <span>Sending Application...</span>
                    </div>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

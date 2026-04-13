'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Building2, GraduationCap } from 'lucide-react';

interface HistoryItemFormProps {
  type: 'experience' | 'education';
  item?: any;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function HistoryItemForm({ type, item, onSave, onClose }: HistoryItemFormProps) {
  const [formData, setFormData] = useState<any>({
    title: '',
    company: '',
    institution: '',
    degree: '',
    field_of_study: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        is_current: !!item.is_current,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
              {type === 'experience' ? <Building2 className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">
                {item ? 'Edit' : 'Add'} {type === 'experience' ? 'Experience' : 'Education'}
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">Fill in the details of your professional journey.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form id="history-form" onSubmit={handleSubmit} className="p-8 space-y-8 relative z-10 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {type === 'experience' ? (
              <>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Job Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Company Name</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. Google"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Remote / Jakarta"
                      className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Institution / University</label>
                  <input
                    required
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    placeholder="e.g. Stanford University"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Degree</label>
                  <input
                    required
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    placeholder="e.g. Bachelor's Degree"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Field of Study</label>
                  <input
                    type="text"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({...formData, field_of_study: e.target.value})}
                    placeholder="e.g. Computer Science"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </>
            )}

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  required
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  disabled={formData.is_current}
                  type="date"
                  value={formData.is_current ? '' : formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {type === 'experience' && (
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({...formData, is_current: e.target.checked})}
                  className="w-5 h-5 rounded-lg border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0"
                />
                <label htmlFor="is_current" className="text-sm font-bold text-slate-400 cursor-pointer">I am currently working here</label>
              </div>
            )}

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Description / Key Achievements</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What did you accomplish here?"
                className="w-full px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="p-8 border-t border-slate-800 bg-slate-950/30 flex gap-4 relative z-10">
          <button
            type="submit"
            form="history-form"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save {type === 'experience' ? 'Experience' : 'Education'}</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-10 py-5 rounded-[2rem] bg-slate-800 text-white font-black hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

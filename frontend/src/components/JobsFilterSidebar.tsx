'use client';

import React from 'react';
import { Briefcase, Zap, DollarSign, X, Filter } from 'lucide-react';

interface JobsFilterSidebarProps {
  filters: {
    location: string;
    job_type: string;
    experience: string;
  };
  setFilters: (filters: any) => void;
  onClear: () => void;
}

const JOB_TYPES = [
  { label: 'All Types', value: 'all' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Remote', value: 'remote' },
  { label: 'Internship', value: 'internship' },
];

const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid-Level', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead/Manager', value: 'lead' },
];

export default function JobsFilterSidebar({ filters, setFilters, onClear }: JobsFilterSidebarProps) {
  const hasActiveFilters = filters.location || filters.job_type !== 'all' || filters.experience !== 'all';

  return (
    <aside className="w-full space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Filter className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-lg font-black uppercase tracking-tighter text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={onClear}
            className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Job Type Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5" />
          Job Type
        </h4>
        <div className="flex flex-col gap-2">
          {JOB_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilters({ ...filters, job_type: type.value })}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                filters.job_type === type.value
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                  : 'bg-card/50 border-border text-slate-500 hover:border-slate-400'
              }`}
            >
              {type.label}
              {filters.job_type === type.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          Experience
        </h4>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => setFilters({ ...filters, experience: level.value })}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                filters.experience === level.value
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-500'
                  : 'bg-card/50 border-border text-slate-500 hover:border-slate-400'
              }`}
            >
              {level.label}
              {filters.experience === level.value && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Location Input (Simplified) */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Location</h4>
        <input
          type="text"
          placeholder="Remote, Jakarta..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-xs font-bold focus:border-indigo-500/50 outline-none transition-all"
        />
      </div>

      <div className="pt-6 border-t border-border/50">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20">
           <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Pro Tip</h5>
           <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
             Save jobs to get notifications when applications are closing soon.
           </p>
        </div>
      </div>
    </aside>
  );
}

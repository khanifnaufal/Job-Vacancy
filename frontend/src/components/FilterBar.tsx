'use client';

import React from 'react';
import { MapPin, Briefcase, Zap, X } from 'lucide-react';

interface FilterBarProps {
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
];

const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid-Level', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead/Manager', value: 'lead' },
];

export default function FilterBar({ filters, setFilters, onClear }: FilterBarProps) {
  const hasActiveFilters = filters.location || filters.job_type !== 'all' || filters.experience !== 'all';

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 space-y-4">
      <div className="p-2 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 shadow-2xl flex flex-wrap items-center gap-2">
        
        {/* Location Filter */}
        <div className="flex-1 min-w-[200px] relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full bg-slate-950/40 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Job Type Filter */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
            <Briefcase className="w-4 h-4" />
          </div>
          <select
            value={filters.job_type}
            onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
            className="bg-slate-950/40 border-none rounded-2xl py-3.5 pl-11 pr-10 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="bg-slate-900">
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Experience Level Filter */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
            <Zap className="w-4 h-4" />
          </div>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="bg-slate-950/40 border-none rounded-2xl py-3.5 pl-11 pr-10 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value} className="bg-slate-900">
                {level.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="px-6 py-3.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2 text-sm font-bold active:scale-95"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Active Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 px-2">
          {filters.job_type !== 'all' && (
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center gap-1.5 animate-in zoom-in-50 duration-200">
              <Briefcase className="w-3 h-3" /> {filters.job_type}
            </span>
          )}
          {filters.experience !== 'all' && (
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center gap-1.5 animate-in zoom-in-50 duration-200">
              <Zap className="w-3 h-3" /> {filters.experience}
            </span>
          )}
          {filters.location && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in zoom-in-50 duration-200">
              <MapPin className="w-3 h-3" /> {filters.location}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

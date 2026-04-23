'use client';

import React from 'react';
import { MapPin, Briefcase, Zap, X, ChevronDown } from 'lucide-react';

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
  { label: 'Internship', value: 'internship' },
];

const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid-Level', value: 'mid' },
  { label: 'Senior', value: 'senior' },
  { label: 'Lead/Manager', value: 'lead' },
];

export default function FilterBar({ filters, setFilters, onClear }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const hasActiveFilters = filters.location || filters.job_type !== 'all' || filters.experience !== 'all';

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('full')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (t.includes('part')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (t.includes('contract')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (t.includes('remote')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (t.includes('internship')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const getLevelColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('junior')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (l.includes('mid')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (l.includes('senior') || l.includes('lead') || l.includes('manager')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  const closeAll = () => setOpenDropdown(null);

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 space-y-4 relative z-[60]">
      <div className="p-2 rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border border-border/50 shadow-2xl flex flex-wrap items-center gap-2">
        
        {/* Location Filter */}
        <div className="flex-1 min-w-[200px] relative group h-14">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search location..."
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full h-full bg-background/50 border border-border/50 rounded-[1.5rem] pl-14 pr-6 text-sm text-foreground placeholder-slate-500 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-bold tracking-tight"
          />
        </div>

        {/* Job Type Custom Dropdown */}
        <div className="relative min-w-[180px] h-14">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            className={`w-full h-full flex items-center justify-between px-6 rounded-[1.5rem] bg-background/50 border transition-all group ${
              openDropdown === 'type' ? 'border-indigo-500/60 ring-4 ring-indigo-500/10 shadow-lg' : 'border-border/50 hover:border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase className={`w-4.5 h-4.5 transition-colors ${openDropdown === 'type' ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-sm font-bold text-foreground">
                {JOB_TYPES.find(t => t.value === filters.job_type)?.label || 'Job Type'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-500 ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'type' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300 origin-top overflow-hidden">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setFilters({ ...filters, job_type: type.value });
                      closeAll();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${
                      filters.job_type === type.value 
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Experience Level Custom Dropdown */}
        <div className="relative min-w-[180px] h-14">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'experience' ? null : 'experience')}
            className={`w-full h-full flex items-center justify-between px-6 rounded-[1.5rem] bg-background/50 border transition-all group ${
              openDropdown === 'experience' ? 'border-indigo-500/60 ring-4 ring-indigo-500/10 shadow-lg' : 'border-border/50 hover:border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap className={`w-4.5 h-4.5 transition-colors ${openDropdown === 'experience' ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-sm font-bold text-foreground">
                {EXPERIENCE_LEVELS.find(l => l.value === filters.experience)?.label || 'Level'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-500 ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
          </button>

          {openDropdown === 'experience' && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeAll} />
              <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300 origin-top overflow-hidden">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => {
                      setFilters({ ...filters, experience: level.value });
                      closeAll();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${
                      filters.experience === level.value 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="px-8 h-14 rounded-[1.5rem] bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest active:scale-95 shadow-xl shadow-indigo-500/20"
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
            <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 animate-in zoom-in-75 duration-300 ${getTypeColor(filters.job_type)}`}>
              <Briefcase className="w-3 h-3" /> {filters.job_type}
            </span>
          )}
          {filters.experience !== 'all' && (
            <span className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 animate-in zoom-in-75 duration-300 ${getLevelColor(filters.experience)}`}>
              <Zap className="w-3 h-3" /> {filters.experience}
            </span>
          )}
          {filters.location && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in zoom-in-75 duration-300">
              <MapPin className="w-3 h-3" /> {filters.location}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

interface JobsHeaderProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

export default function JobsHeader({ onSearch, searchTerm: initialSearchTerm }: JobsHeaderProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <header className="sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-xl border-b border-border py-4">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="w-full bg-secondary/50 border border-border focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold placeholder-slate-500 transition-all outline-none"
            placeholder="Search jobs, skills, or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
      </div>
    </header>
  );
}

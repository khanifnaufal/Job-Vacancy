'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { Vacancy } from '@/types';
import JobCard from '@/components/JobCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';

const fetchVacancies = async (filters: any): Promise<Vacancy[]> => {
  const { data } = await api.get('/vacancies', { params: filters });
  return data;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    job_type: 'all',
    experience: 'all'
  });

  const allFilters = { title: searchTerm, ...filters };

  const { data: vacancies, isLoading, error } = useQuery({
    queryKey: ['vacancies', allFilters],
    queryFn: () => fetchVacancies(allFilters),
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      job_type: 'all',
      experience: 'all'
    });
  };

  return (
    <div className="flex flex-col gap-16 animate-in fade-in duration-700">
      <div className="text-center pt-12 pb-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/15 rounded-full blur-[100px]"></div>
        <h2 className="text-6xl md:text-7xl font-black text-foreground tracking-tighter mb-6 drop-shadow-sm leading-[1.1]">
          Find Your <span className="text-transparent px-1 bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400  drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]">Ultimate</span> Dream Job
        </h2>
        <p className="text-slate-500 mb-12 max-w-2xl mx-auto text-lg leading-relaxed font-bold tracking-tight uppercase tracking-[0.05em] opacity-80">
          Curated opportunities in the global technology ecosystem.
        </p>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onClear={clearFilters} 
      />

      {isLoading && (
        <div className="flex justify-center items-center py-24">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-150"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-300 py-12 px-6 bg-red-950/30 border border-red-900/50 backdrop-blur-sm rounded-2xl mx-auto max-w-2xl shadow-inner shadow-red-900/10">
          <div className="flex justify-center mb-4">
             <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="font-medium text-lg">Error loading vacancies</p>
          <p className="text-red-400/80 text-sm mt-1">Please ensure the backend server is running correctly.</p>
        </div>
      )}

      {!isLoading && !error && vacancies?.length === 0 && (
        <div className="text-center py-24 px-6 border-2 border-dashed border-border rounded-3xl bg-card/50 backdrop-blur-sm">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No vacancies found</h3>
          <p className="text-slate-500 mb-6 font-medium">Try adjusting your filters or search keywords to find what you're looking for.</p>
          <button 
            onClick={clearFilters}
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {!isLoading && !error && vacancies && vacancies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((job, index) => (
            <div key={job.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

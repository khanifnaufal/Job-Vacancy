'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Vacancy } from '@/types';
import JobsHeader from '@/components/JobsHeader';
import JobsFilterSidebar from '@/components/JobsFilterSidebar';
import JobListingCard from '@/components/JobListingCard';
import JobDetailsPanel from '@/components/JobDetailsPanel';
import { motion } from 'framer-motion';
import { Loader2, SearchX } from 'lucide-react';

const fetchVacancies = async (filters: any): Promise<Vacancy[]> => {
  const { data } = await api.get('/vacancies', { params: filters });
  return data;
};

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    job_type: 'all',
    experience: 'all'
  });
  const [selectedJob, setSelectedJob] = useState<Vacancy | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const allFilters = { title: searchTerm, ...filters };

  const { data: vacancies, isLoading, error } = useQuery({
    queryKey: ['vacancies', allFilters],
    queryFn: () => fetchVacancies(allFilters),
  });

  const handleJobClick = useCallback((job: Vacancy) => {
    setSelectedJob(job);
    setIsPanelOpen(true);
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      job_type: 'all',
      experience: 'all'
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background bg-grainy">
      <JobsHeader onSearch={setSearchTerm} searchTerm={searchTerm} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 25% */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="sticky top-28">
              <JobsFilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                onClear={clearFilters} 
              />
            </div>
          </div>

          {/* Main Content - 75% */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {vacancies?.length || 0} Opportunities Found
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Based on your current search and filters
                </p>
              </div>
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-slate-500">Fetching live opportunities...</p>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-12 text-center">
                <p className="text-rose-500 font-bold mb-2">Error loading vacancies</p>
                <p className="text-sm text-slate-500">Please check your connection or try again later.</p>
              </div>
            )}

            {!isLoading && !error && vacancies?.length === 0 && (
              <div className="bg-card/50 border-2 border-dashed border-border rounded-3xl p-20 text-center flex flex-col items-center">
                <div className="p-4 bg-secondary rounded-2xl mb-6">
                  <SearchX className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-foreground mb-2">No jobs match your search</h3>
                <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto mb-8">
                  Try adjusting your filters or search keywords to broaden your results.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {!isLoading && !error && vacancies && vacancies.length > 0 && (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                {vacancies.map((job) => (
                  <motion.div key={job.id} variants={item}>
                    <JobListingCard 
                      job={job} 
                      onClick={handleJobClick} 
                      isSelected={selectedJob?.id === job.id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <JobDetailsPanel 
        job={selectedJob} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </div>
  );
}

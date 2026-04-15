'use client';

import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-10 dark:opacity-25 group-hover:opacity-40 dark:group-hover:opacity-50 transition duration-500"></div>
      <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border hover:border-indigo-400 group-focus-within:border-indigo-500 rounded-full p-2 transition-all duration-300 shadow-xl">
        <div className="pl-4 pr-3 text-slate-400 dark:text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="w-full bg-transparent border-none text-foreground placeholder-slate-500 focus:outline-none focus:ring-0 text-lg py-3 px-2 font-medium"
          placeholder="Search for job titles, keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="pr-2">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-full px-8 py-3 font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 text-sm uppercase tracking-widest">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

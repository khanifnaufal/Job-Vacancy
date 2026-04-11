import React from 'react';
import { Vacancy } from '@/types';
import { 
  Users, 
  MapPin, 
  Clock, 
  Edit3, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

interface JobManagementCardProps {
  vacancy: Vacancy;
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (id: number) => void;
}

export default function JobManagementCard({ vacancy, onEdit, onDelete }: JobManagementCardProps) {
  return (
    <div className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              {vacancy.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                {vacancy.location}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {vacancy.job_type}
              </span>
            </div>
          </div>
          
          <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            vacancy.status 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {vacancy.status ? 'Active' : 'Draft'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Applicants</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-lg font-bold text-slate-200">
                {vacancy.applications?.length || 0}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Experience</span>
            <div className="text-sm font-semibold text-slate-300">
              {vacancy.experience_level || 'N/A'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(vacancy)}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-all"
              title="Edit Vacancy"
            >
              <Edit3 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => onDelete(vacancy.id)}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-all"
              title="Delete Vacancy"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>

          <Link
            href={`/vacancy/${vacancy.id}`}
            className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Preview</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  description?: string;
}

export default function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
  return (
    <div className="relative group overflow-hidden">
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800/50 ${color.split(' ')[0].replace('from-', 'text-')} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-slate-400 text-sm font-medium tracking-wide uppercase">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            {description && (
              <span className="text-xs text-slate-500 font-medium">{description}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

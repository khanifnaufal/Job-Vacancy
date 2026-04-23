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
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-2xl blur opacity-10 group-hover:opacity-25 transition-opacity duration-500`}></div>
      
      <div className="relative bg-card dark:bg-slate-900 border border-border dark:border-slate-800 p-6 rounded-2xl hover:border-primary/30 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-xl shadow-black/[0.03] dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-background dark:bg-slate-950 border border-border dark:border-slate-800 ${color.split(' ')[0].replace('from-', 'text-')} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-[0.15em] uppercase">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground tracking-tight">{value}</span>
            {description && (
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{description}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

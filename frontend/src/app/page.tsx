'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {

  return (
    <div className="flex flex-col gap-24 animate-in fade-in duration-1000">
      <div className="text-center pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary/20">
            Evolution of Recruitment
          </span>
          <h2 className="text-7xl md:text-8xl font-black text-foreground tracking-tighter mb-8 drop-shadow-sm leading-[1.05]">
            Find Your <span className="text-transparent px-2 bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">Next Big</span> Adventure
          </h2>
          <p className="text-slate-500 mb-12 max-w-2xl mx-auto text-xl leading-relaxed font-medium opacity-80">
            Where the world's most innovative companies find their next-generation talent. Seamless, data-driven, and built for the modern workforce.
          </p>

          <div className="flex items-center justify-center gap-6">
            <Link 
              href="/jobs"
              className="px-10 py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-sm hover:bg-indigo-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95"
            >
              Browse Opportunities
            </Link>
            <Link 
              href="/register"
              className="px-10 py-5 rounded-2xl bg-card border border-border text-foreground font-black uppercase tracking-widest text-sm hover:border-primary/50 transition-all active:scale-95"
            >
              For Companies
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Featured Section Placeholder */}
      <section className="py-20 relative">
         <div className="absolute inset-0 bg-secondary/30 -skew-y-3 origin-right -z-10"></div>
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-black tracking-tight mb-4">Built for Performance</h3>
            <p className="text-slate-500 font-medium">
              Our new high-performance job board is optimized for speed and efficiency, helping you find the right match in seconds.
            </p>
         </div>
      </section>

      {/* Quick Stats or something */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full px-6 pb-24">
         {[
           { label: 'Live Vacancies', value: '2.5k+', color: 'text-indigo-500' },
           { label: 'Global Companies', value: '450+', color: 'text-purple-500' },
           { label: 'Successful Hires', value: '12k+', color: 'text-emerald-500' }
         ].map((stat, i) => (
           <div key={i} className="p-8 rounded-[2rem] bg-card/50 border border-border text-center group hover:border-primary/30 transition-all duration-500">
              <span className={`text-4xl font-black tracking-tighter mb-2 block ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
           </div>
         ))}
      </div>
    </div>
  );
}

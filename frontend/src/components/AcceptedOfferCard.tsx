'use client';

import React, { useEffect } from 'react';
import { Application } from '@/types';
import { 
  Trophy, 
  Calendar, 
  DollarSign, 
  Gift, 
  CheckCircle2, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AcceptedOfferCardProps {
  application: Application;
}

export default function AcceptedOfferCard({ application }: AcceptedOfferCardProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!application.offer_accepted_at) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [application.offer_accepted_at]);

  const acceptMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/applications/${application.id}/accept-offer`);
    },
    onSuccess: () => {
      toast.success('Congratulations! You have officially joined the team.');
      queryClient.invalidateQueries({ queryKey: ['seeker-applications'] });
    },
    onError: () => {
      toast.error('Failed to accept offer. Please try again.');
    }
  });

  const isAccepted = !!application.offer_accepted_at;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-background to-indigo-500/10 border border-emerald-500/20 shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 shrink-0">
            <Trophy className="w-12 h-12 md:w-16 md:h-16" />
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {isAccepted ? "You're Hired!" : "Congratulations!"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">
              You've received an official offer for <span className="text-emerald-500">{application.vacancy?.title}</span>
            </p>
          </div>

          {isAccepted && (
            <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-xs">
              <CheckCircle2 className="w-5 h-5" />
              Offer Accepted
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white dark:border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Monthly Salary</span>
            </div>
            <p className="text-2xl font-black text-foreground">
              IDR {Number(application.offered_salary).toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white dark:border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Start Date</span>
            </div>
            <p className="text-2xl font-black text-foreground">
              {application.start_date ? format(new Date(application.start_date), 'MMM do, yyyy') : 'TBD'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white dark:border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Gift className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Benefits</span>
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 line-clamp-2">
              {application.benefits || 'Standard company benefits package.'}
            </p>
          </div>
        </div>

        {!isAccepted && (
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/50">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Ready to join the team?</h3>
              <p className="text-slate-500 text-sm">By clicking the button, you officially accept this offer and the terms provided.</p>
            </div>
            <button 
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
              className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {acceptMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Official Accept</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {isAccepted && (
          <div className="mt-12 p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 text-center">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              Congratulations! Your manager will contact you soon regarding the next steps and onboarding process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

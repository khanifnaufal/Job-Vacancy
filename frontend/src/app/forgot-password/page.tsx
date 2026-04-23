'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await api.post('/forgot-password', data);
      setIsSuccess(true);
      toast.success('Reset link sent to your email');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pt-12">
      <Link 
        href="/login" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-500 transition-colors font-bold text-xs uppercase tracking-widest mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Login
      </Link>

      <div className="bg-card/90 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl p-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
         
         {!isSuccess ? (
           <>
            <div className="text-center mb-10 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-500 mb-6 shadow-xl border border-indigo-500/20">
                <Mail className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Reset Password
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">Enter your email to receive a recovery link</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 font-bold ml-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
           </>
         ) : (
           <div className="text-center py-6 animate-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-foreground dark:text-white mb-4">Email Sent!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto font-medium">
                Check your inbox for a password reset link. It might take a few minutes to arrive.
              </p>
              <Link 
                href="/login" 
                className="inline-block w-full py-5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition-all border border-border dark:border-transparent"
              >
                Return to Login
              </Link>
           </div>
         )}
      </div>
    </div>
  );
}

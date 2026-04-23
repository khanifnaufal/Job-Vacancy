'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import Link from 'next/link';
import { Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid or expired reset link');
      router.push('/login');
    }
  }, [token, email, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    try {
      await api.post('/reset-password', {
        token,
        email,
        ...data
      });
      setIsSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pt-12">
      <div className="bg-card/90 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl p-10 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
         
         {!isSuccess ? (
           <>
            <div className="text-center mb-10 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-500 mb-6 shadow-xl border border-indigo-500/20">
                <Lock className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Set New Password
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">Choose a strong password for your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 font-bold ml-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register('password_confirmation')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password_confirmation && <p className="text-xs text-rose-500 font-bold ml-1">{errors.password_confirmation.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
           </>
         ) : (
           <div className="text-center py-6 animate-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-foreground dark:text-white mb-4">Success!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto font-medium">
                Your password has been reset. Redirecting you to login...
              </p>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 animate-[shimmer_3s_linear_infinite]" style={{width: '100%'}}></div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

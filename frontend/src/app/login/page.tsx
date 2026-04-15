'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import Link from 'next/link';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/login', data);
      setAuth(response.data.user, response.data.access_token);
      toast.success('Login berhasil!');
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah.');
      toast.error('Login gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pt-12">
      <div className="bg-card/90 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-8 mb-6">
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-500/10 text-indigo-500 mb-6 shadow-xl shadow-indigo-500/5 border border-indigo-500/20">
            <LogIn className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-white dark:to-slate-400">
            Welcome Back
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">Identity Authentication</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in zoom-in duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Corporate Email</label>
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-6 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-500 font-bold ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Secure Sign In</span>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-slate-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Create one for free
        </Link>
      </div>
    </div>
  );
}

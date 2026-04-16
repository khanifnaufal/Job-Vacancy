'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Briefcase, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['seeker', 'recruiter']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'seeker',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/register', data);
      setAuth(response.data.user, response.data.access_token);
      toast.success('Akun berhasil dibuat!');
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
      toast.error('Pendaftaran gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pt-8">
      <div className="bg-card/90 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-8 mb-6 relative overflow-hidden">
        {/* Decorative mask */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-purple-500/10 text-purple-500 mb-6 shadow-xl shadow-purple-500/5 border border-purple-500/20">
            <UserPlus className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-white dark:to-slate-400">
            Create Account
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">Join the HireIn Network</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in zoom-in duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                {...register('name')}
                type="text"
                className="w-full bg-background border border-border rounded-2xl py-3.5 pl-11 pr-4 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 font-bold ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-background border border-border rounded-2xl py-3.5 pl-11 pr-4 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 font-bold ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Pass</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-background border border-border rounded-2xl py-3.5 pl-11 pr-12 text-foreground placeholder:text-slate-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all font-medium"
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

          <div className="space-y-1.5 pb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Join as</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border cursor-pointer transition-all ${selectedRole === 'seeker' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500 shadow-xl shadow-indigo-500/5' : 'bg-background border-border text-slate-500 hover:border-indigo-500/30'}`}>
                <input {...register('role')} type="radio" value="seeker" className="sr-only" />
                <Briefcase className="w-5 h-5 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Job Seeker</span>
              </label>
              <label className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border cursor-pointer transition-all ${selectedRole === 'recruiter' ? 'bg-purple-500/10 border-purple-500/50 text-purple-500 shadow-xl shadow-purple-500/5' : 'bg-background border-border text-slate-500 hover:border-indigo-500/30'}`}>
                <input {...register('role')} type="radio" value="recruiter" className="sr-only" />
                <User className="w-5 h-5 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Recruiter</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Launch Profile</span>
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
          Sign In instead
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, LogIn, UserPlus, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      logout();
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/60 border-b border-indigo-500/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            D
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 tracking-tight">
            Dicoding Jobs
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-slate-200">{user.name}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 rounded-sm">
                  {user.role}
                </span>
              </div>
              
              {user.role === 'recruiter' ? (
                <Link
                  href="/dashboard"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all flex items-center gap-2 group"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Recruiter</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/seeker/applications"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all flex items-center gap-2 group"
                    title="My Applications"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Applications</span>
                  </Link>
                  <Link
                    href="/seeker/profile"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center gap-2 group"
                    title="My Profile"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">Profile</span>
                  </Link>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

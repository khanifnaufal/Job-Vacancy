'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, LogIn, UserPlus, Briefcase, Heart, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useBookmarkStore } from '@/lib/bookmarkStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { count, fetchBookmarks } = useBookmarkStore();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

   useEffect(() => {
    if (user?.role === 'seeker') {
      fetchBookmarks();
    }
    
    // Sync profile if missing (helps with avatars in existing sessions)
    if (hasHydrated && user && !user.profile && !user.company) {
      const endpoint = user.role === 'seeker' ? '/profile' : '/company';
      api.get(endpoint).then(res => {
        useAuthStore.getState().setUser(res.data);
      }).catch(err => console.error('Data sync failed', err));
    }
  }, [user, fetchBookmarks, hasHydrated]);

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
            H
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 tracking-tight">
            HireIn
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          {!hasHydrated ? (
            <div className="w-20 h-8 bg-slate-900 animate-pulse rounded-xl"></div>
          ) : user ? (
            <div className="relative">
              {/* Profile Toggle Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-900 border transition-all duration-300 group ${
                  isDropdownOpen ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold overflow-hidden">
                  {(() => {
                    const avatarPath = user.role === 'recruiter' ? user.company?.logo_path : user.profile?.avatar_path;
                    if (avatarPath) {
                      return (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${avatarPath}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover" 
                        />
                      );
                    }
                    return user.name.charAt(0);
                  })()}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{user.name}</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500 mt-1">{user.role}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                {user.role === 'seeker' && count > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-slate-950 shadow-lg animate-in zoom-in duration-300">
                    {count}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-64 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-2 space-y-1">
                      {/* Nav Links */}
                      <Link
                        href={user.role === 'recruiter' ? '/dashboard' : '/seeker/dashboard'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                      >
                        <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href={user.role === 'recruiter' ? '/dashboard/applications' : '/seeker/applications'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                      >
                        <Briefcase className="w-5 h-5 text-sky-400" />
                        <span>Applications</span>
                      </Link>

                      {user.role === 'seeker' && (
                        <Link
                          href="/seeker/saved"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                        >
                          <div className="flex items-center gap-3">
                            <Heart className="w-5 h-5 text-rose-400" />
                            <span>Saved Jobs</span>
                          </div>
                          {count > 0 && (
                            <span className="bg-rose-500/10 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-500/20">
                              {count}
                            </span>
                          )}
                        </Link>
                      )}

                      <Link
                        href={user.role === 'recruiter' ? '/dashboard/company' : '/seeker/profile'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                      >
                        <User className="w-5 h-5 text-emerald-400" />
                        <span>{user.role === 'recruiter' ? 'Company Profile' : 'My Profile'}</span>
                      </Link>

                      <div className="h-px bg-slate-800 my-2 mx-4"></div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-400 hover:text-white hover:bg-rose-500 transition-all font-semibold"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
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

'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, LogIn, UserPlus, Briefcase, Heart, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useBookmarkStore } from '@/lib/bookmarkStore';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/60 border-b border-border transition-all duration-500">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
            H
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight">
            Hire<span className="text-primary italic">In</span>
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <ThemeToggle />
          
          {!hasHydrated ? (
            <div className="w-20 h-9 bg-card animate-pulse rounded-xl border border-border"></div>
          ) : user ? (
            <div className="relative">
              {/* Profile Toggle Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 p-1 rounded-2xl bg-card border transition-all duration-500 group ${
                  isDropdownOpen ? 'border-primary shadow-xl shadow-primary/10' : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary font-black overflow-hidden group-hover:scale-95 transition-transform">
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
                <div className="hidden sm:flex flex-col items-start leading-none pr-2">
                  <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{user.name}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">{user.role}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 mr-2 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                {user.role === 'seeker' && count > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-background shadow-lg animate-in zoom-in duration-300">
                    {count}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-72 bg-card/95 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right p-3">
                    <div className="space-y-1">
                      {/* Nav Links */}
                      <Link
                        href={user.role === 'recruiter' ? '/dashboard' : '/seeker/dashboard'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-primary hover:bg-background transition-all font-bold group/item"
                      >
                        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                        <span>Dashboard Overview</span>
                      </Link>

                      <Link
                        href={user.role === 'recruiter' ? '/dashboard/applications' : '/seeker/applications'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-primary hover:bg-background transition-all font-bold group/item"
                      >
                        <Briefcase className="w-5 h-5 text-sky-500" />
                        <span>My Applications</span>
                      </Link>

                      {user.role === 'seeker' && (
                        <Link
                          href="/seeker/saved"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center justify-between px-5 py-4 rounded-2xl text-slate-500 hover:text-primary hover:bg-background transition-all font-bold group/item"
                        >
                          <div className="flex items-center gap-4">
                            <Heart className="w-5 h-5 text-rose-500" />
                            <span>Saved Jobs</span>
                          </div>
                          {count > 0 && (
                            <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2.5 py-1 rounded-lg border border-rose-500/20">
                              {count}
                            </span>
                          )}
                        </Link>
                      )}

                      <Link
                        href={user.role === 'recruiter' ? '/dashboard/company' : '/seeker/profile'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-primary hover:bg-background transition-all font-bold group/item"
                      >
                        <User className="w-5 h-5 text-emerald-500" />
                        <span>{user.role === 'recruiter' ? 'Company DNA' : 'Identity Profile'}</span>
                      </Link>

                      <div className="h-px bg-border my-2 mx-5"></div>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all font-bold group/logout shadow-inner"
                      >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Terminate Session</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Join Now</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

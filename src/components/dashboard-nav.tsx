"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Database, History, Settings, LogOut, LayoutDashboard, Fingerprint, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vault', href: '/vault', icon: Database },
  { name: 'Audit Logs', href: '/logs', icon: History },
  { name: 'Governance', href: '/admin', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full glass w-72 fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 group">
          <div className="bg-primary/20 p-2.5 rounded-xl neon-glow-primary transition-transform group-hover:rotate-12">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider text-foreground block font-orbitron">SENTINEL<span className="text-primary">VAULT</span></span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-60">AI Node v4.0</span>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-primary-foreground neon-glow-primary font-bold shadow-lg" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-primary/70")} />
                <span className="text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        {user && (
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 glass">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.email?.substring(0, 2).toUpperCase() || 'SV'}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-foreground">{user.displayName || 'Authorized User'}</p>
              <p className="text-[10px] text-muted-foreground truncate font-mono opacity-60">{user.email}</p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">Neural Link</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00F5D4]" />
          </div>
          <div className="text-[10px] space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">LATENCY</span>
              <span className="text-foreground">12ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">INTEGRITY</span>
              <span className="text-primary">SECURE</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-4 w-full px-5 py-3.5 rounded-xl text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-300 group font-bold text-sm"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>TERMINATE LINK</span>
        </button>
      </div>
    </div>
  );
}

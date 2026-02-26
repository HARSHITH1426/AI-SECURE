import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Lock, Database, History, Settings, User, AlertCircle, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Security Posture', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Vault', href: '/vault', icon: Database },
  { name: 'Audit Ledger', href: '/logs', icon: History },
  { name: 'Policy Control', href: '/admin', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r w-64 fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">CogniSecure</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">System State</span>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-accent" />
          </div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Encryption</span>
              <span className="text-foreground font-mono">AES-256</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Integrity</span>
              <span className="text-foreground font-mono">100% Verified</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Admin Portal</span>
        </div>
      </div>
    </div>
  );
}

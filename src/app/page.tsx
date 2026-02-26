import Link from 'next/link';
import { Shield, Lock, Cpu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1A1D23] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-accent rounded-full opacity-50" />
      </div>

      <div className="z-10 max-w-4xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wide uppercase">
          <Cpu className="w-4 h-4" />
          Self-Evolving Architecture
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
          CogniSecure <span className="gradient-text">Vault</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Advanced Trust-Entropy Driven Cryptographic Architecture for mission-critical AI data security.
          Autonomous authentication with real-time risk evaluation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 rounded-full font-semibold">
            <Link href="/dashboard">Access Secure Portal</Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-white/10 hover:bg-white/5 rounded-full font-semibold">
            System Documentation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
          <FeatureCard 
            icon={<Lock className="w-6 h-6 text-accent" />}
            title="Adaptive Encryption"
            description="Dynamic key rotation triggered by entropy shifts and context-aware risk levels."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-accent" />}
            title="Continuous Auth"
            description="Behavioral monitoring engine tracking typing patterns and session activity."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6 text-accent" />}
            title="Immutable Ledger"
            description="Blockchain-based audit logging ensuring tamper-proof forensic evidence."
          />
        </div>
      </div>

      <footer className="mt-20 text-muted-foreground text-sm font-mono opacity-50">
        SECURE NODE v4.0.2 // ARCH: TRUST-ENTROPY-ADAPTIVE
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

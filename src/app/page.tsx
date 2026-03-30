import Link from 'next/link';
import { Shield, Lock, Database, History, ArrowRight, Zap, Globe, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      
      <div className="max-w-4xl space-y-10 z-10 text-center animate-in fade-in zoom-in duration-1000">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-float">
          <Zap className="w-4 h-4 fill-primary" />
          SENTINELVAULT AI NODE IS ONLINE
        </div>

        <h1 className="text-6xl md:text-8xl font-black font-orbitron tracking-tighter leading-none">
          SECURE <span className="text-gradient">VAULT</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
          A premium, <span className="text-foreground font-semibold">AI-driven</span> intelligent secure data system with behavioral threat detection and adaptive neural response.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Button asChild size="lg" className="h-14 px-10 text-sm font-black rounded-2xl btn-neon group bg-primary text-primary-foreground">
            <Link href="/login" className="flex items-center gap-3">
              ESTABLISH CONNECTION
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="h-14 px-10 text-sm font-black rounded-2xl glass border-white/10 hover:border-primary/50 transition-all">
            <Link href="/dashboard">ACCESS TERMINAL</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24">
          <FeatureCard 
            icon={<Cpu className="w-6 h-6 text-primary" />}
            title="Neural Defense"
            description="Real-time behavioral analysis using isolation forest models to detect anomalies."
          />
          <FeatureCard 
            icon={<Lock className="w-6 h-6 text-secondary" />}
            title="AES-256 Vault"
            description="Military-grade multi-layer encryption for all assets with dynamic key rotation."
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6 text-accent" />}
            title="Adaptive Access"
            description="Intelligent security responses that scale based on detected threat levels."
          />
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 font-mono text-[10px] tracking-[0.5em] uppercase pointer-events-none">
        Cognitive Security Framework // v4.0.0
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl glass text-left hover:border-primary/50 hover:-translate-y-2 transition-all duration-500 group">
      <div className="mb-5 p-3 rounded-2xl bg-white/5 inline-block group-hover:neon-glow-primary transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 font-orbitron tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-light">{description}</p>
    </div>
  );
}

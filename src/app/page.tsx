import Link from 'next/link';
import { Shield, Lock, FileText, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase">
          <Shield className="w-3.5 h-3.5" />
          Encrypted Data Vault
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Secure <span className="text-primary">Vault</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          A private storage solution for managing sensitive documents and credentials with multi-layer encryption and biometric verification.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="h-12 px-8 text-sm font-bold rounded-lg group">
            <Link href="/login" className="flex items-center gap-2">
              Access Vault
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="h-12 px-8 text-sm font-bold rounded-lg">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <FeatureCard 
            icon={<Lock className="w-5 h-5 text-primary" />}
            title="Private Storage"
            description="Your data is encrypted and stored securely in isolated environments."
          />
          <FeatureCard 
            icon={<FileText className="w-5 h-5 text-primary" />}
            title="Audit Logs"
            description="Keep track of all access attempts and file modifications in real-time."
          />
          <FeatureCard 
            icon={<Database className="w-5 h-5 text-primary" />}
            title="Cloud Sync"
            description="Access your vault from any device with secure cloud synchronization."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50 text-left hover:border-primary/30 transition-colors">
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-bold mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  User, 
  AlertCircle, 
  Key,
  Globe,
  Loader2,
  Fingerprint
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateIdentityCreation, initiateIdentityValidation, authorizeFederatedNode } from '@/firebase/non-blocking-login';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const authInstance = useAuth();
  const { user, isUserLoading } = useUser();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'done'>('idle');

  useEffect(() => {
    if (user && !isUserLoading) {
      setStatus('done');
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('verifying');
    
    try {
      if (isRegistering) {
        initiateIdentityCreation(authInstance, email, password);
      } else {
        initiateIdentityValidation(authInstance, email, password);
      }
    } catch (err: any) {
      setError("AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
      setStatus('idle');
    }
  };

  const handleGoogleLogin = () => {
    setError(null);
    authorizeFederatedNode(authInstance);
  };

  if (isUserLoading && status !== 'done') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin neon-glow-primary" />
        <p className="font-orbitron font-bold tracking-[0.3em] text-primary animate-pulse">SYNCHRONIZING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full" />
      
      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-primary/10 rounded-2xl border border-primary/20 neon-glow-primary animate-float">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground font-orbitron">
            SENTINEL<span className="text-primary">VAULT</span>
          </h1>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black opacity-60">
            Intelligent Identity Node Access
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-accent/10 border-accent/20 animate-in slide-in-from-top-4">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertTitle className="text-xs font-black uppercase tracking-widest text-accent">Security Violation</AlertTitle>
            <AlertDescription className="text-[10px] font-mono">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="glass border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="pb-8">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold font-orbitron flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-primary" />
                {isRegistering ? "CREATE_IDENTITY" : "ACCESS_PORTAL"}
              </CardTitle>
              <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-widest border-primary/30 text-primary">v4.0</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Identifier (Email)</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="name@vault.core" 
                    className="pl-12 h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl text-sm" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Secret Key (Password)</Label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="pl-12 h-12 bg-white/5 border-white/5 focus:border-primary/50 rounded-2xl text-sm" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full font-black uppercase text-xs h-14 rounded-2xl btn-neon bg-primary text-primary-foreground tracking-widest"
                disabled={status !== 'idle'}
              >
                {status === 'verifying' ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? "REGISTER_NODE" : "ESTABLISH_LINK")}
              </Button>
            </form>

            <div className="relative flex items-center py-4">
              <Separator className="flex-1 bg-white/10" />
              <span className="mx-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">External_Federation</span>
              <Separator className="flex-1 bg-white/10" />
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 text-xs font-black gap-3 rounded-2xl glass border-white/10 hover:border-primary/50 transition-all uppercase tracking-widest"
              onClick={handleGoogleLogin}
              disabled={status !== 'idle'}
            >
              <Globe className="w-5 h-5 text-primary" />
              AUTH_VIA_GOOGLE
            </Button>
          </CardContent>

          <CardFooter className="bg-white/2 border-t border-white/5 py-5">
            <Button 
              variant="link" 
              className="w-full text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary uppercase"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "LINK_EXISTING_NODE" : "PROVISION_NEW_NODE"}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center opacity-40 font-mono text-[9px] tracking-widest uppercase">
          End-to-End Encryption Enabled // RSA-4096 / AES-256
        </div>
      </div>
    </div>
  );
}

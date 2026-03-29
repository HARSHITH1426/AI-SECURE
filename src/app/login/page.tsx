"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  User, 
  Fingerprint, 
  AlertCircle, 
  Cpu, 
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Terminal,
  Activity,
  Scan,
  CheckCircle2
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function LoginNode() {
  const router = useRouter();
  const authInstance = useAuth();
  const { user, isUserLoading } = useUser();
  
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'verifying' | 'scanning' | 'verified' | 'done'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  
  const [hostLabel, setHostLabel] = useState('VAULT_CORE');
  const [currentDate, setCurrentDate] = useState('');

  const checkStrength = (token: string) => {
    let score = 0;
    if (token.length > 8) score += 25;
    if (/[A-Z]/.test(token)) score += 25;
    if (/[0-9]/.test(token)) score += 25;
    if (/[^A-Za-z0-9]/.test(token)) score += 25;
    return score;
  };

  useEffect(() => {
    setHostLabel(window.location.hostname.toUpperCase() || 'VAULT_NODE');
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  useEffect(() => {
    if (user && !isUserLoading) {
      setScanStatus('done');
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanStatus === 'scanning') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setScanStatus('verified'), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [scanStatus]);

  useEffect(() => {
    if (scanStatus === 'verified') {
      try {
        if (isRegistering) {
          initiateEmailSignUp(authInstance, emailInput, passInput);
        } else {
          initiateEmailSignIn(authInstance, emailInput, passInput);
        }
      } catch (err: any) {
        setAuthError(err.message || "Auth failure.");
        setScanStatus('idle');
      }
    }
  }, [scanStatus, authInstance, emailInput, passInput, isRegistering]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setScanStatus('verifying');
    setTimeout(() => setScanStatus('scanning'), 800);
  };

  if (isUserLoading && scanStatus !== 'done') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Cpu className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-primary/10 rounded-full border border-primary/20 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
            CogniSecure <span className="text-primary">Vault</span>
          </h1>
          <p className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase opacity-40">
            Secure Node: {hostLabel} // {currentDate}
          </p>
        </div>

        {authError && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs font-bold uppercase">System Error</AlertTitle>
            <AlertDescription className="text-[10px] font-mono">{authError}</AlertDescription>
          </Alert>
        )}

        <Card className={cn(
          "border-border/20 bg-black/60 backdrop-blur-xl transition-all duration-300",
          (scanStatus === 'scanning' || scanStatus === 'verified') && "border-accent/40"
        )}>
          {scanStatus === 'scanning' && (
            <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center rounded-lg">
              <div className="relative mb-6">
                <div className="w-24 h-24 border-2 border-accent/20 rounded-full flex items-center justify-center">
                  <Fingerprint className="w-12 h-12 text-accent animate-pulse" />
                  <div className="absolute inset-0 border-t-2 border-accent animate-spin rounded-full" />
                </div>
                <Scan className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-accent uppercase tracking-tighter">Biometric Scan</h3>
              <div className="w-48 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-accent transition-all" style={{ width: `${scanProgress}%` }} />
              </div>
              <p className="text-[9px] font-mono text-accent mt-2">{scanProgress}% VERIFIED</p>
            </div>
          )}

          {scanStatus === 'verified' && (
            <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center rounded-lg">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
              <p className="text-[10px] font-mono text-green-500 mt-4">IDENTITY CONFIRMED</p>
            </div>
          )}

          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {scanStatus === 'verifying' ? (
                  <span className="text-primary animate-pulse flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Handshake
                  </span>
                ) : scanStatus === 'done' ? (
                  <span className="text-green-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Access Granted
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" /> Login
                  </span>
                )}
              </CardTitle>
              <Badge variant="outline" className="text-[9px] font-mono border-primary/20 text-primary">
                SEC_LEVEL_4
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Identifier</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="name@vault.core" 
                    className="pl-10 bg-white/5 border-border/20 font-mono text-xs" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    disabled={scanStatus !== 'idle'}
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Token</Label>
                  {isRegistering && passInput && (
                    <span className="text-[9px] font-mono text-muted-foreground">
                      Entropy: <span className={checkStrength(passInput) < 50 ? "text-destructive" : "text-green-500"}>{checkStrength(passInput)}%</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type={showPass ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 bg-white/5 border-border/20 font-mono text-xs" 
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    required
                    disabled={scanStatus !== 'idle'}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                {isRegistering && (
                  <Progress value={checkStrength(passInput)} className="h-0.5 bg-white/5" />
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 font-bold uppercase tracking-tight h-12"
                disabled={scanStatus !== 'idle'}
              >
                {isRegistering ? "Init Identity" : "Authorize Session"}
              </Button>
            </form>

            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground/50 uppercase">
                <Terminal className="w-3 h-3" /> Status Log:
              </div>
              <div className="mt-1 font-mono text-[8px] space-y-0.5">
                <p className="text-green-500/60">[SYS] Secure channel ready...</p>
                <p className="text-primary/60">[SYS] RSA-4096 handshake initialized...</p>
                {scanStatus === 'scanning' && (
                  <p className="text-accent animate-pulse">[SYS] Biometric scan in progress...</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-white/[0.02] border-t border-white/5 py-4">
            <Button 
              variant="ghost" 
              className="w-full text-[10px] font-mono text-muted-foreground hover:text-white"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={scanStatus !== 'idle'}
            >
              {isRegistering ? "Back to Auth" : "New Personnel? Register"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
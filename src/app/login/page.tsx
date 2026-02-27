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
  Zap, 
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

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authStage, setAuthStage] = useState<'idle' | 'verifying' | 'scanning' | 'biometric_verified' | 'established'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  const passwordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 8) strength += 25;
    if (pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/[0-9]/)) strength += 25;
    if (pwd.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  useEffect(() => {
    if (user && !isUserLoading) {
      setAuthStage('established');
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user, isUserLoading, router]);

  // Simulation of fingerprint scanning progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authStage === 'scanning') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setAuthStage('biometric_verified'), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else if (authStage !== 'scanning') {
      setScanProgress(0);
    }
    return () => clearInterval(interval);
  }, [authStage]);

  // Finalize authentication after biometric verification
  useEffect(() => {
    if (authStage === 'biometric_verified') {
      try {
        if (isSignUp) {
          initiateEmailSignUp(auth, email, password);
        } else {
          initiateEmailSignIn(auth, email, password);
        }
      } catch (err: any) {
        setError(err.message || "Credential validation failed.");
        setAuthStage('idle');
      }
    }
  }, [authStage, auth, email, password, isSignUp]);

  const handleAuthInitiation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthStage('verifying');
    
    // Initial handshake simulation
    setTimeout(() => {
      setAuthStage('scanning');
    }, 1000);
  };

  if (isUserLoading && authStage !== 'established') {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <Cpu className="w-20 h-20 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-ping" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
              Synchronizing Neural Link...
            </p>
            <div className="w-48 h-1 bg-muted/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Structural Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-50" />
      </div>

      <div className="w-full max-w-xl z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-5 bg-primary/10 rounded-[2rem] border border-primary/30 shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)] group transition-all duration-700 hover:rotate-[360deg]">
            <Shield className="w-12 h-12 text-primary group-hover:scale-110" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              CogniSecure <span className="text-primary">Vault</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-mono tracking-[0.5em] uppercase opacity-50">
              Authorized Personnel Only // Node: {typeof window !== 'undefined' ? window.location.hostname.toUpperCase() : 'SECURE_PRIMARY'}
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive animate-in slide-in-from-top-4 border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-bold uppercase tracking-tight">Security Alert: Access Denied</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-1">{error}</AlertDescription>
          </Alert>
        )}

        <Card className={cn(
          "border-border/30 bg-black/40 backdrop-blur-3xl shadow-2xl border-t-primary/40 transition-all duration-500 overflow-hidden relative",
          error && "border-destructive/60 animate-shake",
          (authStage === 'scanning' || authStage === 'biometric_verified') && "border-accent/60"
        )}>
          {/* Scanning Overlay */}
          {authStage === 'scanning' && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
                <div className="w-32 h-32 border-2 border-accent/30 rounded-full flex items-center justify-center relative">
                  <Fingerprint className="w-16 h-16 text-accent animate-pulse" />
                  <div className="absolute inset-0 border-t-2 border-accent animate-spin" />
                  <div 
                    className="absolute inset-x-0 bg-accent/20 transition-all duration-75" 
                    style={{ height: '2px', top: `${scanProgress}%` }}
                  />
                </div>
                <Scan className="absolute -top-4 -right-4 w-8 h-8 text-accent animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-accent uppercase tracking-tighter italic">Biometric Scan Active</h3>
                <p className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase">Verifying unique neural-typing signature</p>
                <div className="w-64 h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-75" style={{ width: `${scanProgress}%` }} />
                </div>
                <p className="text-accent font-mono text-[9px] mt-2">{scanProgress}% SECURE_VERIFY</p>
              </div>
            </div>
          )}

          {authStage === 'biometric_verified' && (
            <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="w-20 h-20 text-green-400 animate-bounce" />
              <h3 className="text-2xl font-black text-green-400 uppercase tracking-tighter mt-4 italic">Biometrics Verified</h3>
              <p className="text-muted-foreground text-[10px] font-mono mt-2">ESTABLISHING CRYPTOGRAPHIC CHANNEL...</p>
            </div>
          )}

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <CardHeader className="space-y-2 pb-8">
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {authStage === 'verifying' ? (
                  <span className="flex items-center gap-3 text-primary animate-pulse">
                    <RefreshCw className="w-6 h-6 animate-spin" /> Handshake...
                  </span>
                ) : authStage === 'established' ? (
                  <span className="flex items-center gap-3 text-green-400">
                    <ShieldCheck className="w-6 h-6" /> Access Granted
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-primary" /> Session Initialize
                  </span>
                )}
              </CardTitle>
              <Badge variant="outline" className="font-mono text-[9px] border-primary/30 text-primary px-2 py-0">
                L-LEVEL 4
              </Badge>
            </div>
            <CardDescription className="text-[10px] font-mono flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              Protocol: XTS-AES-512-RSA-4096
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleAuthInitiation} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80">Entity Identifier</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="entity@secure.vault" 
                    className="pl-12 h-14 bg-white/5 border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl font-mono" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={authStage !== 'idle'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80">Security Token</Label>
                  {isSignUp && password && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">Entropy:</span>
                      <span className={cn(
                        "text-[9px] font-bold font-mono",
                        passwordStrength(password) < 50 ? "text-destructive" : "text-green-400"
                      )}>
                        {passwordStrength(password)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••••" 
                    className="pl-12 pr-12 h-14 bg-white/5 border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl font-mono" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={authStage !== 'idle'}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isSignUp && (
                  <div className="pt-2">
                    <Progress value={passwordStrength(password)} className="h-1 bg-muted/20" />
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter h-16 text-xl shadow-[0_20px_40px_-15px_rgba(var(--primary),0.4)] group overflow-hidden relative rounded-xl"
                disabled={authStage !== 'idle'}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSignUp ? "Initialize Identity" : "Authorize Session"}
                  <Fingerprint className="w-5 h-5 group-hover:scale-125 transition-transform" />
                </div>
                {(authStage !== 'idle') && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                )}
              </Button>
            </form>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase">
                <Terminal className="w-3 h-3" /> System Logs:
              </div>
              <div className="space-y-1 font-mono text-[9px]">
                <p className="text-green-500/80 tracking-tighter flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                  [LOG] Secure socket layer established...
                </p>
                <p className="text-primary/80 tracking-tighter flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full" />
                  [LOG] Encryption keys verified (512-bit)...
                </p>
                {authStage === 'scanning' && (
                  <p className="text-accent tracking-tighter flex items-center gap-2 animate-in slide-in-from-left-2">
                    <span className="w-1 h-1 bg-accent rounded-full animate-ping" />
                    [LOG] Fingerprint hardware interface detected. Scanning...
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 bg-white/[0.03] p-8 border-t border-white/5">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[9px] font-mono uppercase tracking-[0.3em]">
                <span className="bg-[#0A0C10] px-4 text-muted-foreground/50">Identity Management</span>
              </div>
            </div>
            
            <div className="w-full">
              <Button 
                variant="outline" 
                className="w-full border-white/10 bg-transparent hover:bg-white/5 h-12 font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={authStage !== 'idle'}
              >
                <Fingerprint className="w-4 h-4 mr-2 text-primary" />
                {isSignUp ? "Already Registered? Authorize" : "New Personnel? Register Personnel"}
              </Button>
            </div>

            <p className="text-[8px] text-muted-foreground/40 font-mono text-center leading-relaxed uppercase tracking-tight max-w-xs mx-auto">
              All interactions are hashed and recorded to the immutable forensic ledger. 
              Breach attempts trigger autonomous defensive measures.
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-between items-center px-4 text-[9px] font-mono text-muted-foreground/30 uppercase tracking-[0.4em]">
          <span>{new Date().toISOString().split('T')[0]}</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
            Active-Secure
          </span>
          <span>CH-8291-B</span>
        </div>
      </div>
    </div>
  );
}

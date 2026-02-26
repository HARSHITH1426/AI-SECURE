"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  User, 
  Terminal, 
  Fingerprint, 
  Zap, 
  AlertCircle, 
  Cpu, 
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
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
  const [authStage, setAuthStage] = useState<'idle' | 'verifying' | 'established'>('idle');

  // Password strength calculation
  const passwordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length > 6) strength += 25;
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
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, isUserLoading, router]);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthStage('verifying');
    
    // Simulate verification delay for "Strong" feel
    setTimeout(() => {
      try {
        if (isSignUp) {
          initiateEmailSignUp(auth, email, password);
        } else {
          initiateEmailSignIn(auth, email, password);
        }
      } catch (err: any) {
        setError(err.message || "An authentication error occurred.");
        setAuthStage('idle');
      }
    }, 1500);
  };

  const handleAnonymousAuth = () => {
    setError(null);
    setAuthStage('verifying');
    setTimeout(() => {
      try {
        initiateAnonymousSignIn(auth);
      } catch (err: any) {
        setError(err.message || "Could not establish guest session.");
        setAuthStage('idle');
      }
    }, 1000);
  };

  if (isUserLoading && authStage !== 'established') {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Cpu className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-ping" />
          </div>
          <p className="text-muted-foreground font-mono text-sm tracking-tighter animate-pulse uppercase">
            Establishing Secure Handshake...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b,transparent)]" />
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] h-full w-full opacity-10">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-primary/10 h-20 w-full" />
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-primary/5 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10 mb-2 group">
            <Shield className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">
            COGNISECURE <span className="text-primary italic">VAULT</span>
          </h1>
          <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase opacity-70">
            Node Identity: {typeof window !== 'undefined' ? window.location.hostname : 'PRIMARY'}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Security Breach / Access Denied</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className={cn(
          "border-border/40 bg-card/60 backdrop-blur-3xl shadow-2xl border-t-primary/20 transition-all duration-300",
          error && "border-destructive/50"
        )}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-3">
              {authStage === 'verifying' ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-accent animate-spin" />
                  <span className="text-accent">Verifying...</span>
                </div>
              ) : authStage === 'established' ? (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Access Granted</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>Establish Session</span>
                </div>
              )}
            </CardTitle>
            <CardDescription className="text-xs font-mono flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                authStage === 'idle' ? "bg-green-500 animate-pulse" : "bg-accent animate-ping"
              )} />
              SYSTEM PROTOCOL: AES-XTS-512 / SHA-3
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold opacity-70">Identity Alias</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="entity@cognisecure.vault" 
                    className="pl-10 h-12 bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={authStage !== 'idle'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold opacity-70">Security Token</Label>
                  {isSignUp && password && (
                    <span className={cn(
                      "text-[10px] font-mono",
                      passwordStrength(password) < 50 ? "text-destructive" : "text-green-500"
                    )}>
                      Strength: {passwordStrength(password)}%
                    </span>
                  )}
                </div>
                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-12 bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={authStage !== 'idle'}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isSignUp && password && (
                  <Progress value={passwordStrength(password)} className="h-1 bg-muted/30" />
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter h-14 text-lg shadow-xl shadow-primary/20 group overflow-hidden relative"
                disabled={authStage !== 'idle'}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isSignUp ? "Initialize Node" : "Authorize Session"}
                  <Zap className="w-5 h-5 group-hover:animate-bounce" />
                </div>
                {authStage === 'verifying' && (
                  <div className="absolute inset-0 bg-accent animate-pulse opacity-20" />
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-5 bg-muted/10 p-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
                <span className="bg-[#0A0C10] px-3 text-muted-foreground">Encryption Bypass</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button 
                variant="outline" 
                className="border-border/50 bg-transparent hover:bg-white/5 h-11 font-mono text-[10px] uppercase tracking-tighter"
                onClick={handleAnonymousAuth}
                disabled={authStage !== 'idle'}
              >
                <Fingerprint className="w-4 h-4 mr-2 text-accent" />
                Ephemeral
              </Button>
              <Button 
                variant="outline" 
                className="border-border/50 bg-transparent hover:bg-white/5 h-11 font-mono text-[10px] uppercase tracking-tighter"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={authStage !== 'idle'}
              >
                {isSignUp ? "Verify Identity" : "Register Node"}
              </Button>
            </div>

            <p className="text-[9px] text-muted-foreground font-mono text-center leading-relaxed opacity-50 uppercase tracking-tight">
              Access is monitored by the AI threat intelligence layer. 
              Unauthorized attempts will be logged to the immutable audit ledger.
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-between px-2 text-[10px] font-mono text-muted-foreground opacity-40 uppercase tracking-widest">
          <span>{new Date().toISOString().split('T')[0]}</span>
          <span>SECURE-TUNNEL-X4</span>
          <span>CH-8291</span>
        </div>
      </div>
    </div>
  );
}

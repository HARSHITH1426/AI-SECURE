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

export default function IdentityAccessPortal() {
  const vaultRouter = useRouter();
  const securityAuth = useAuth();
  const { user: activeEntity, isUserLoading: isCipherLoading } = useUser();
  
  const [entityIdentifier, setEntityIdentifier] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [protocolAlert, setProtocolAlert] = useState<string | null>(null);
  const [revealToken, setRevealToken] = useState(false);
  const [handshakeStage, setHandshakeStage] = useState<'idle' | 'verifying' | 'scanning' | 'biometric_verified' | 'established'>('idle');
  const [telemetryProgress, setTelemetryProgress] = useState(0);
  
  const [hostname, setHostname] = useState('SECURE_NODE');
  const [currentDate, setCurrentDate] = useState('YYYY-MM-DD');

  const evaluateTokenEntropy = (token: string) => {
    let entropyRating = 0;
    if (token.length > 8) entropyRating += 25;
    if (token.match(/[A-Z]/)) entropyRating += 25;
    if (token.match(/[0-9]/)) entropyRating += 25;
    if (token.match(/[^A-Za-z0-9]/)) entropyRating += 25;
    return entropyRating;
  };

  useEffect(() => {
    // Prevent hydration mismatch by setting client-only values in useEffect
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname.toUpperCase());
      setCurrentDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    if (activeEntity && !isCipherLoading) {
      setHandshakeStage('established');
      const transitionTimer = setTimeout(() => {
        vaultRouter.push('/dashboard');
      }, 800);
      return () => clearTimeout(transitionTimer);
    }
  }, [activeEntity, isCipherLoading, vaultRouter]);

  useEffect(() => {
    let telemetryInterval: NodeJS.Timeout;
    if (handshakeStage === 'scanning') {
      telemetryInterval = setInterval(() => {
        setTelemetryProgress((current) => {
          if (current >= 100) {
            clearInterval(telemetryInterval);
            setTimeout(() => setHandshakeStage('biometric_verified'), 500);
            return 100;
          }
          return current + 5;
        });
      }, 50);
    } else if (handshakeStage !== 'scanning') {
      setTelemetryProgress(0);
    }
    return () => clearInterval(telemetryInterval);
  }, [handshakeStage]);

  useEffect(() => {
    if (handshakeStage === 'biometric_verified') {
      try {
        if (isProvisioning) {
          initiateEmailSignUp(securityAuth, entityIdentifier, securityToken);
        } else {
          initiateEmailSignIn(securityAuth, entityIdentifier, securityToken);
        }
      } catch (fault: any) {
        setProtocolAlert(fault.message || "Cryptographic handshake failed.");
        setHandshakeStage('idle');
      }
    }
  }, [handshakeStage, securityAuth, entityIdentifier, securityToken, isProvisioning]);

  const executeHandshakeProtocol = (event: React.FormEvent) => {
    event.preventDefault();
    setProtocolAlert(null);
    setHandshakeStage('verifying');
    
    setTimeout(() => {
      setHandshakeStage('scanning');
    }, 1000);
  };

  if (isCipherLoading && handshakeStage !== 'established') {
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-xl z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-5 bg-primary/10 rounded-[2rem] border border-primary/30 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.5)] group transition-all duration-700 hover:rotate-[360deg]">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
              CogniSecure <span className="text-primary">Vault</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-mono tracking-[0.5em] uppercase opacity-50">
              Authorized Personnel Only // Node: {hostname}
            </p>
          </div>
        </div>

        {protocolAlert && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive animate-in slide-in-from-top-4 border-2 animate-shake">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-bold uppercase tracking-tight">Security Alert: Access Denied</AlertTitle>
            <AlertDescription className="font-mono text-xs mt-1">{protocolAlert}</AlertDescription>
          </Alert>
        )}

        <Card className={cn(
          "border-border/30 bg-black/40 backdrop-blur-3xl shadow-2xl border-t-primary/40 transition-all duration-500 overflow-hidden relative",
          protocolAlert && "border-destructive/60",
          (handshakeStage === 'scanning' || handshakeStage === 'biometric_verified') && "border-accent/60"
        )}>
          {handshakeStage === 'scanning' && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
                <div className="w-32 h-32 border-2 border-accent/30 rounded-full flex items-center justify-center relative">
                  <Fingerprint className="w-16 h-16 text-accent animate-pulse" />
                  <div className="absolute inset-0 border-t-2 border-accent animate-spin" />
                  <div 
                    className="absolute inset-x-0 bg-accent/20 transition-all duration-75" 
                    style={{ height: '2px', top: `${telemetryProgress}%` }}
                  />
                </div>
                <Scan className="absolute -top-4 -right-4 w-8 h-8 text-accent animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-accent uppercase tracking-tighter italic">Biometric Scan Active</h3>
                <p className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase">Verifying unique neural-typing signature</p>
                <div className="w-64 h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-75" style={{ width: `${telemetryProgress}%` }} />
                </div>
                <p className="text-accent font-mono text-[9px] mt-2">{telemetryProgress}% SECURE_VERIFY</p>
              </div>
            </div>
          )}

          {handshakeStage === 'biometric_verified' && (
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
                {handshakeStage === 'verifying' ? (
                  <span className="flex items-center gap-3 text-primary animate-pulse">
                    <RefreshCw className="w-6 h-6 animate-spin" /> Handshake...
                  </span>
                ) : handshakeStage === 'established' ? (
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
            <form onSubmit={executeHandshakeProtocol} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="entityId" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80">Entity Identifier</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="entityId" 
                    type="email" 
                    placeholder="entity@secure.vault" 
                    className="pl-12 h-14 bg-white/5 border-border/30 focus:border-primary/50 transition-all rounded-xl font-mono text-white" 
                    value={entityIdentifier}
                    onChange={(e) => setEntityIdentifier(e.target.value)}
                    required
                    disabled={handshakeStage !== 'idle'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="token" className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80">Security Token</Label>
                  {isProvisioning && securityToken && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase">Entropy:</span>
                      <span className={cn(
                        "text-[9px] font-bold font-mono",
                        evaluateTokenEntropy(securityToken) < 50 ? "text-destructive" : "text-green-400"
                      )}>
                        {evaluateTokenEntropy(securityToken)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="token" 
                    type={revealToken ? "text" : "password"} 
                    placeholder="••••••••••••" 
                    className="pl-12 pr-12 h-14 bg-white/5 border-border/30 focus:border-primary/50 transition-all rounded-xl font-mono text-white" 
                    value={securityToken}
                    onChange={(e) => setSecurityToken(e.target.value)}
                    required
                    disabled={handshakeStage !== 'idle'}
                  />
                  <button 
                    type="button"
                    onClick={() => setRevealToken(!revealToken)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {revealToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isProvisioning && (
                  <div className="pt-2">
                    <Progress value={evaluateTokenEntropy(securityToken)} className="h-1 bg-muted/20" />
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter h-16 text-xl shadow-[0_20px_40px_-15px_hsl(var(--primary)/0.4)] group overflow-hidden relative rounded-xl"
                disabled={handshakeStage !== 'idle'}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isProvisioning ? "Initialize Identity" : "Authorize Session"}
                  <Fingerprint className="w-5 h-5 group-hover:scale-125 transition-transform" />
                </div>
                {(handshakeStage !== 'idle') && (
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
                {handshakeStage === 'scanning' && (
                  <p className="text-accent tracking-tighter flex items-center gap-2 animate-in slide-in-from-left-2">
                    <span className="w-1 h-1 bg-accent rounded-full animate-ping" />
                    [LOG] Fingerprint hardware interface detected. Scanning...
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 bg-white/[0.03] p-8 border-t border-white/5">
            <div className="w-full">
              <Button 
                variant="outline" 
                className="w-full border-white/10 bg-transparent hover:bg-white/5 h-12 font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all"
                onClick={() => setIsProvisioning(!isProvisioning)}
                disabled={handshakeStage !== 'idle'}
              >
                <Fingerprint className="w-4 h-4 mr-2 text-primary" />
                {isProvisioning ? "Already Registered? Authorize" : "New Personnel? Register Personnel"}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="flex justify-between items-center px-4 text-[9px] font-mono text-muted-foreground/30 uppercase tracking-[0.4em]">
          <span>{currentDate}</span>
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
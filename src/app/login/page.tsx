"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User, Terminal, Fingerprint, Zap, AlertCircle } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        initiateEmailSignUp(auth, email, password);
      } else {
        initiateEmailSignIn(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    }
  };

  const handleAnonymousAuth = () => {
    setError(null);
    try {
      initiateAnonymousSignIn(auth);
    } catch (err: any) {
      setError(err.message || "Could not establish guest session.");
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#1A1D23] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-muted-foreground font-mono text-sm animate-pulse">Initializing Secure Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1D23] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">CogniSecure Vault</h1>
          <p className="text-muted-foreground text-sm font-light">
            {isSignUp ? "Create a new secure identity" : "Verify credentials to access protected sectors"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in zoom-in-95">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Security Warning</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              {isSignUp ? "Register Identity" : "Secure Authentication"}
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-mono">
              Protocol: RSA-1024 / AES-256
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Identity (Email)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@cognisecure.vault" 
                    className="pl-10 bg-muted/30 border-border/50" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Security Key</Label>
                <div className="relative">
                  <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-muted/30 border-border/50" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-bold tracking-tight h-11">
                {isSignUp ? "Register Node" : "Establish Secure Session"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1A1D23] px-2 text-muted-foreground">OR</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-border/50 bg-transparent hover:bg-white/5 h-11 font-mono text-xs"
              onClick={handleAnonymousAuth}
            >
              <Fingerprint className="w-4 h-4 mr-2 text-accent" />
              Request Ephemeral Access
            </Button>

            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {isSignUp ? "Already registered? Verify identity" : "Need a vault identity? Request registration"}
            </button>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground font-mono opacity-50">
          NODE: {typeof window !== 'undefined' ? window.location.hostname : 'UNKNOWN'} // IP: 127.0.0.1 // ENCRYPTION: ACTIVE
        </p>
      </div>
    </div>
  );
}

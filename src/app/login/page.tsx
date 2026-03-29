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
  Loader2
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateIdentityCreation, initiateIdentityValidation, authorizeFederatedNode } from '@/firebase/non-blocking-login';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
      setError("Failed to authenticate. Please check your credentials.");
      setStatus('idle');
    }
  };

  const handleGoogleLogin = () => {
    setError(null);
    authorizeFederatedNode(authInstance);
  };

  if (isUserLoading && status !== 'done') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-xl border border-primary/20 mb-2">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vault Access
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest opacity-60">
            Secure Authentication Portal
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs font-bold">Error</AlertTitle>
            <AlertDescription className="text-[10px]">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                {isRegistering ? "Create Account" : "Sign In"}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase font-mono">v1.0</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 text-sm" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 text-sm" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full font-bold uppercase text-xs h-11"
                disabled={status !== 'idle'}
              >
                {status === 'verifying' ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegistering ? "Register" : "Log In")}
              </Button>
            </form>

            <div className="relative flex items-center py-2">
              <Separator className="flex-1" />
              <span className="mx-2 text-[10px] text-muted-foreground font-bold uppercase">Or</span>
              <Separator className="flex-1" />
            </div>

            <Button 
              variant="outline" 
              className="w-full h-11 text-xs font-bold gap-2"
              onClick={handleGoogleLogin}
              disabled={status !== 'idle'}
            >
              <Globe className="w-4 h-4 text-primary" />
              Sign in with Google
            </Button>
          </CardContent>

          <CardFooter className="bg-muted/30 border-t border-border/50 py-3">
            <Button 
              variant="link" 
              className="w-full text-[10px] font-bold text-muted-foreground"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have an account? Log in" : "New user? Create an account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
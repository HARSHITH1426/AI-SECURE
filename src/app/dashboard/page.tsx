"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, AlertTriangle, Activity, Zap, Eye, BrainCircuit, Fingerprint, TrendingUp } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardStats() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'securityLogs'), orderBy('timestamp', 'desc'), limit(12));
  }, [db]);

  const { data: logs } = useCollection(logsQuery);

  const riskData = logs?.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: log.riskScore
  })).reverse() || [];

  const currentRiskLevel = user?.currentRiskLevel || "LOW";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-orbitron tracking-tight text-foreground flex items-center gap-3">
            TERMINAL <span className="text-primary">NODE</span>
          </h1>
          <p className="text-muted-foreground font-light tracking-wide uppercase text-xs mt-1">Intelligence Stream & Adaptive Security Posture</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                A{i}
              </div>
            ))}
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 py-1.5 px-4 font-black tracking-widest uppercase text-[10px] rounded-full neon-glow-primary">
            <Zap className="w-3 h-3 mr-2 fill-primary" /> Active Monitoring
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget 
          label="Risk Posture" 
          value={currentRiskLevel} 
          desc="Current System State" 
          icon={<Shield className={cn("w-5 h-5", currentRiskLevel === 'HIGH' ? 'text-accent' : 'text-primary')} />}
          color={currentRiskLevel === 'HIGH' ? 'text-accent' : 'text-primary'}
          pulse={currentRiskLevel === 'HIGH'}
        />
        <StatWidget 
          label="Neural Baseline" 
          value="99.4%" 
          desc="Behavioral Confidence" 
          icon={<Fingerprint className="w-5 h-5 text-secondary" />}
          color="text-secondary"
        />
        <StatWidget 
          label="Neutralized" 
          value={logs?.filter(l => l.riskLevel === 'HIGH').length || 0} 
          desc="AI Adaptive Blocks" 
          icon={<AlertTriangle className="w-5 h-5 text-accent" />}
          color="text-accent"
        />
        <StatWidget 
          label="Vault Node" 
          value="ENCRYPTED" 
          desc="AES-256 Multi-Layer" 
          icon={<Lock className="w-5 h-5 text-primary" />}
          color="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-none overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold font-orbitron tracking-tight flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  REAL-TIME RISK ANALYSIS
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-widest font-light">Continuous Behavioral Monitoring</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-white/5 font-mono text-[10px]">v4.0. Neural</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] pt-8">
            {mounted && riskData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#ffffff30" fontSize={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F1A', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/2 rounded-3xl border border-dashed border-white/10">
                <p className="text-sm text-muted-foreground font-mono italic animate-pulse">Establishing secure neural link...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-lg font-bold font-orbitron tracking-tight flex items-center gap-3">
              <Eye className="w-5 h-5 text-accent" />
              EXPLAINABLE AI
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-light">Inference Rationalization</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {logs?.slice(0, 5).map((log, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-2xl border transition-all hover:scale-102",
                  log.riskLevel === 'HIGH' 
                    ? 'bg-accent/10 border-accent/20 neon-glow-accent' 
                    : 'bg-white/5 border-white/5'
                )}>
                   <div className="flex justify-between font-black text-[10px] mb-2 tracking-widest">
                      <span className={log.riskLevel === 'HIGH' ? 'text-accent' : 'text-primary'}>{log.riskLevel} RISK</span>
                      <span className="text-muted-foreground opacity-40">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                   <div className="text-xs text-foreground/80 leading-relaxed italic">
                      {log.reasons?.join(' + ') || 'Normal baseline activity detected.'}
                   </div>
                </div>
              ))}
              {!logs?.length && <p className="text-xs text-muted-foreground italic text-center py-8">Awaiting threat data...</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        <Card className="glass border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-orbitron tracking-tight">ADAPTIVE SECURITY PROTOCOLS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/50 transition-all">
               <div>
                 <p className="text-[10px] font-black text-primary tracking-widest mb-1 uppercase">Current Access Mode</p>
                 <h4 className="text-xl font-bold font-orbitron">
                    {currentRiskLevel === 'MEDIUM' ? 'READ-ONLY' : currentRiskLevel === 'HIGH' ? 'LOCKED' : 'FULL UNRESTRICTED'}
                 </h4>
               </div>
               <Badge className={cn("px-6 py-2 rounded-full font-black tracking-widest", currentRiskLevel === 'HIGH' ? 'bg-accent' : 'bg-primary')}>ADAPTIVE</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <MetricProgress label="Encryption Integrity" value={100} color="text-primary" />
              <MetricProgress label="Identity Certainty" value={98} color="text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <div className="glass rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-4 bg-secondary/20 rounded-full neon-glow-accent">
             <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-orbitron">Neural Score</h3>
          <p className="text-5xl font-black text-primary">0.02<span className="text-xs text-muted-foreground ml-2">λ</span></p>
          <p className="text-xs text-muted-foreground font-light uppercase tracking-widest">Minimal System Deviation</p>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ label, value, desc, icon, color, pulse }: { label: string, value: string | number, desc: string, icon: React.ReactNode, color: string, pulse?: boolean }) {
  return (
    <Card className={cn("glass border-none hover:-translate-y-1 transition-all duration-300", pulse && "animate-pulse-high border-accent/30")}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className={cn("text-2xl font-black font-orbitron", color)}>{value}</div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-light mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function MetricProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span className={color}>{value}%</span>
      </div>
      <Progress value={value} className="h-1.5 bg-white/5" />
    </div>
  );
}

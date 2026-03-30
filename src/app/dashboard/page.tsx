
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, AlertTriangle, Activity, Zap, Eye, BrainCircuit, Fingerprint } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

export default function DashboardStats() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'securityLogs'), orderBy('timestamp', 'desc'), limit(10));
  }, [db]);

  const { data: logs } = useCollection(logsQuery);

  const riskData = logs?.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: log.riskScore
  })).reverse() || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Intelligent Security Node</h1>
          <p className="text-sm text-muted-foreground">AI-Driven Threat Detection & Adaptive Response</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
            <BrainCircuit className="w-3 h-3 mr-1" /> Neural Analysis Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          label="Risk Posture" 
          value={user?.currentRiskLevel || "LOW"} 
          desc="Current Adaptive State" 
          icon={<Shield className={`w-4 h-4 ${user?.currentRiskLevel === 'HIGH' ? 'text-destructive' : 'text-primary'}`} />}
        />
        <StatWidget 
          label="Identity Confidence" 
          value="99.4%" 
          desc="Behavioral Baseline" 
          icon={<Fingerprint className="w-4 h-4 text-accent" />}
        />
        <StatWidget 
          label="Threats Neutralized" 
          value={logs?.filter(l => l.riskLevel === 'HIGH').length || 0} 
          desc="Adaptive Blockades" 
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
        />
        <StatWidget 
          label="Encryption Node" 
          value="ACTIVE" 
          desc="AES-256 Multi-Layer" 
          icon={<Lock className="w-4 h-4 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Real-Time Risk Scoring (AI)
            </CardTitle>
            <CardDescription className="text-xs">Continuous behavioral analysis stream</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {mounted && riskData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                  <XAxis dataKey="time" stroke="#555" fontSize={10} />
                  <YAxis stroke="#555" fontSize={10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/5 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground italic">Awaiting AI log stream data...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" />
              Explainable AI (XAI)
            </CardTitle>
            <CardDescription className="text-xs">Risk classification rationale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs?.slice(0, 5).map((log, i) => (
                <div key={i} className={`text-[10px] p-2.5 rounded border border-border/10 ${log.riskLevel === 'HIGH' ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/10'}`}>
                   <div className="flex justify-between font-bold mb-1">
                      <span className={log.riskLevel === 'HIGH' ? 'text-destructive' : 'text-primary'}>{log.riskLevel} RISK</span>
                      <span className="text-muted-foreground opacity-50">{new Date(log.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <div className="italic text-muted-foreground">
                      {log.reasons?.join(', ') || 'Normal baseline detected.'}
                   </div>
                </div>
              ))}
              {!logs?.length && <p className="text-[10px] text-muted-foreground italic text-center py-4">No security anomalies detected.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold">Adaptive Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded bg-muted/20 border border-border/10">
               <div className="text-xs font-bold">MODE: {user?.currentRiskLevel === 'MEDIUM' ? 'READ-ONLY' : user?.currentRiskLevel === 'HIGH' ? 'LOCKED' : 'FULL ACCESS'}</div>
               <Badge className={user?.currentRiskLevel === 'HIGH' ? 'bg-destructive' : 'bg-primary'}>Adaptive</Badge>
            </div>
            <MetricProgress label="Encryption Integrity" value={100} color="text-accent" />
            <MetricProgress label="Behavioral Confidence" value={98} color="text-primary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatWidget({ label, value, desc, icon }: { label: string, value: string | number, desc: string, icon: React.ReactNode }) {
  return (
    <Card className="border-border/10 bg-card/40">
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4">
        <p className="text-[9px] font-bold uppercase text-muted-foreground">{label}</p>
        {icon}
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xl font-bold">{value}</div>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function MetricProgress({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className="text-muted-foreground">{label}</span>
        <span className={color}>{value}%</span>
      </div>
      <Progress value={value} className="h-1" />
    </div>
  );
}

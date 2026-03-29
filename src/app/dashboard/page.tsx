"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, AlertTriangle, Activity, Zap, Fingerprint, Eye } from 'lucide-react';
import { currentSystemStats, mockThreats } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const RISK_HISTORY = [
  { time: '00:00', risk: 0.12 },
  { time: '04:00', risk: 0.08 },
  { time: '08:00', risk: 0.45 },
  { time: '12:00', risk: 0.22 },
  { time: '16:00', risk: 0.15 },
  { time: '20:00', risk: 0.38 },
  { time: 'NOW', risk: 0.25 },
];

export default function DashboardStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Telemetry</h1>
          <p className="text-sm text-muted-foreground">Real-time risk metrics from the Trust-Entropy Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5 animate-pulse-accent">
            <Zap className="w-3 h-3 mr-1" /> Monitoring Active
          </Badge>
          <Badge variant="secondary" className="text-[10px] font-mono">NODE_DELTA_V4</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          label="Global Integrity" 
          value={`${currentSystemStats.trustScore}%`} 
          desc="System Trust Index" 
          icon={<Shield className="w-4 h-4 text-primary" />}
        />
        <StatWidget 
          label="Entropy Level" 
          value={currentSystemStats.entropyLevel} 
          desc="Signal Density" 
          icon={<Activity className="w-4 h-4 text-accent" />}
        />
        <StatWidget 
          label="Active Flags" 
          value={currentSystemStats.activeThreats} 
          desc="Security Anomalies" 
          icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
        />
        <StatWidget 
          label="Neural Match" 
          value="99.4%" 
          desc="Biometric Confidence" 
          icon={<Fingerprint className="w-4 h-4 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Risk Trend Analysis
            </CardTitle>
            <CardDescription className="text-xs">24-hour aggregate risk factor</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RISK_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                  <XAxis dataKey="time" stroke="#555" fontSize={10} />
                  <YAxis stroke="#555" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontSize: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 5, fill: "hsl(var(--accent))" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-muted/10 animate-pulse rounded-lg" />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockThreats.slice(0, 4).map((msg, i) => (
                <div key={i} className="text-[11px] p-2.5 rounded border border-border/10 bg-muted/10 text-muted-foreground italic leading-relaxed">
                  {msg}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold">Biometric Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricProgress label="Typing Rhythm Match" value={92} color="text-accent" />
            <MetricProgress label="Session Persistence" value={100} color="text-primary" />
            <MetricProgress label="Neural Drift" value={4} color="text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="border-border/10 bg-card/40">
          <CardHeader>
            <CardTitle className="text-base font-bold">Cryptographic Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-muted/20 border border-border/10">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Protocol</p>
                <div className="text-sm font-bold flex items-center gap-2">
                  <Lock className="w-3 h-3 text-accent" /> Active
                </div>
              </div>
              <div className="p-3 rounded bg-muted/20 border border-border/10">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Policy</p>
                <div className="text-sm font-bold">Hardened</div>
              </div>
              <div className="col-span-2 p-3 rounded bg-muted/20 border border-border/10">
                <p className="text-[9px] text-muted-foreground uppercase font-bold mb-2">Key Rotation Progress</p>
                <div className="flex items-center gap-3">
                  <Progress value={75} className="h-1 flex-1" />
                  <span className="text-[9px] font-mono text-muted-foreground">02:45:00</span>
                </div>
              </div>
            </div>
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
        <div className="text-xl font-black">{value}</div>
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
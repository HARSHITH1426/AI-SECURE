"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, AlertTriangle, Activity, Zap, Fingerprint, Eye } from 'lucide-react';
import { currentSystemStats, mockThreats } from '@/lib/mock-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const riskHistory = [
  { time: '00:00', score: 0.12 },
  { time: '04:00', score: 0.08 },
  { time: '08:00', score: 0.45 },
  { time: '12:00', score: 0.22 },
  { time: '16:00', score: 0.15 },
  { time: '20:00', score: 0.38 },
  { time: 'now', score: 0.25 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Security Posture</h1>
          <p className="text-muted-foreground">Real-time telemetry from Trust-Entropy Risk Engine</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-accent text-accent animate-pulse-accent">
            <Zap className="w-3 h-3 mr-1" /> Monitoring Active
          </Badge>
          <Badge variant="secondary" className="bg-muted">Node ID: AP-X72-DELTA</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Trust Score" 
          value={`${currentSystemStats.trustScore}%`} 
          description="Global System Integrity" 
          icon={<Shield className="w-5 h-5 text-primary" />}
          trend="+2.1% from last hour"
        />
        <StatsCard 
          title="Dynamic Entropy" 
          value={currentSystemStats.entropyLevel} 
          description="Information Density" 
          icon={<Activity className="w-5 h-5 text-accent" />}
          trend="Optimizing"
        />
        <StatsCard 
          title="Active Anomalies" 
          value={currentSystemStats.activeThreats} 
          description="Flagged Events" 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          trend="None Critical"
        />
        <StatsCard 
          title="Auth Certainty" 
          value="99.4%" 
          description="Continuous Behavioral" 
          icon={<Fingerprint className="w-5 h-5 text-primary" />}
          trend="Highly Reliable"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Historical Risk Telemetry
            </CardTitle>
            <CardDescription>24-hour window aggregated from all layers</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "hsl(var(--accent))" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-accent" />
              Live Threat Intel
            </CardTitle>
            <CardDescription>Recent findings from AI-driven modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockThreats.slice(0, 5).map((threat, i) => (
                <div key={i} className="flex gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-border/20">
                  <div className="w-1 h-auto bg-primary rounded-full shrink-0" />
                  <p className="text-muted-foreground leading-snug">{threat}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Continuous Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Typing Pattern Analysis</span>
                <span className="text-accent font-semibold">92% Match</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Session Activity Tracker</span>
                <span className="text-primary font-semibold">Stable</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Behavioral Baseline Drift</span>
                <span className="text-muted-foreground font-semibold">Low (0.04)</span>
              </div>
              <Progress value={4} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Risk-Adaptive Cryptography</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/20">
                <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Controller State</span>
                <div className="text-xl font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" /> Active
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/20">
                <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Adaptive Policy</span>
                <div className="text-xl font-bold">High-Entropy</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/20 col-span-2">
                <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Key Health</span>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex-1 bg-border/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary w-3/4 h-full" />
                  </div>
                  <span className="text-sm font-mono">2h 45m left</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, description, icon, trend }: { title: string, value: string | number, description: string, icon: React.ReactNode, trend?: string }) {
  return (
    <Card className="border-border/50 bg-card/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {trend && (
          <div className="mt-3 text-[10px] font-mono text-primary flex items-center gap-1 uppercase">
            <Activity className="w-3 h-3" /> {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

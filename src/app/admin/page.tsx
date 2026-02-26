"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Settings, BrainCircuit, RefreshCw, Lock, AlertCircle, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { adminThreatInsightSummary, AdminThreatInsightSummaryOutput } from '@/ai/flows/admin-threat-insight-summary';
import { mockThreats } from '@/lib/mock-data';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AdminThreatInsightSummaryOutput | null>(null);

  const generateAIInsight = async () => {
    setLoading(true);
    try {
      const result = await adminThreatInsightSummary({ threatData: mockThreats });
      setInsight(result);
    } catch (error) {
      console.error("AI Insight Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy & Governance</h1>
          <p className="text-muted-foreground">Configure adaptive cryptographic rules and risk thresholds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Reset Factory Presets
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Save Configuration</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Adaptive Cryptographic Policy
              </CardTitle>
              <CardDescription>Define how the system reacts to dynamic entropy shifts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dynamic Key Rotation</Label>
                  <p className="text-sm text-muted-foreground">Force rotate AES keys when context-risk exceeds threshold.</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <Label>Entropy Trigger Sensitivity</Label>
                  <span className="font-mono text-primary">0.65</span>
                </div>
                <Slider defaultValue={[65]} max={100} step={1} />
                <p className="text-xs text-muted-foreground italic">Higher sensitivity leads to more frequent rotations but increases latency.</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Multi-Factor Re-Auth Escalation</Label>
                  <p className="text-sm text-muted-foreground">Automatically trigger secondary auth on behavioral drift detection.</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Differential Privacy Engine</Label>
                  <p className="text-sm text-muted-foreground">Inject noise into secure analytics to protect individual data points.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-accent" />
                Autonomous Response Rules
              </CardTitle>
              <CardDescription>Actions triggered by high risk levels without human intervention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResponseRuleCard 
                  title="Session Termination" 
                  condition="Risk > 0.8" 
                  description="Immediate invalidation of all active user tokens."
                  active={true}
                />
                <ResponseRuleCard 
                  title="Access Restriction" 
                  condition="Entropy Shift > 3.0" 
                  description="Block high-privilege operations until manual override."
                  active={true}
                />
                <ResponseRuleCard 
                  title="Model Retraining" 
                  condition="Anomalies > 5/hr" 
                  description="Trigger local ML model update with recent patterns."
                  active={false}
                />
                <ResponseRuleCard 
                  title="Global Lockdown" 
                  condition="Manual Trigger" 
                  description="Encrypt all vault sectors with static root keys."
                  active={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Sparkles className="w-5 h-5" />
                AI Threat Insight
              </CardTitle>
              <CardDescription>GenAI summary of complex system anomalies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!insight ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BrainCircuit className="w-8 h-8 text-accent animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground px-6">
                    Analyze current telemetry and generate a strategic security overview.
                  </p>
                  <Button 
                    onClick={generateAIInsight} 
                    disabled={loading}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-full w-full max-w-[200px]"
                  >
                    {loading ? "Analyzing..." : "Generate AI Insight"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-accent">Summary Overview</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-accent">Key Threats</h4>
                    <ul className="space-y-1">
                      {insight.keyThreatsIdentified.map((t, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-accent">Recommendations</h4>
                    <div className="space-y-2">
                      {insight.actionableRecommendations.map((r, i) => (
                        <div key={i} className="text-[11px] p-2 bg-accent/5 border border-accent/10 rounded-md text-muted-foreground italic">
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground hover:text-accent"
                    onClick={() => setInsight(null)}
                  >
                    Clear and Re-analyze
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                ML Model Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Last Retrained</span>
                  <span className="font-mono">2024-05-19 14:02</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Model Confidence</span>
                  <span className="font-mono text-primary">98.92%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Entropy Baseline</span>
                  <span className="font-mono">4.20 H</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-[10px] uppercase font-bold tracking-widest">
                  View Evolution Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ResponseRuleCard({ title, condition, description, active }: { title: string, condition: string, description: string, active: boolean }) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${active ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 border-border/50 opacity-60 grayscale'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold">{title}</h4>
        <Badge variant={active ? "default" : "secondary"} className="text-[10px] h-5">
          {active ? "ACTIVE" : "DISABLED"}
        </Badge>
      </div>
      <div className="text-[10px] font-mono text-primary mb-2 uppercase tracking-tight">{condition}</div>
      <p className="text-xs text-muted-foreground leading-snug">{description}</p>
    </div>
  );
}

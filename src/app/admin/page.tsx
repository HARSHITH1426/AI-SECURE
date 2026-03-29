"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Settings, BrainCircuit, RefreshCw, AlertCircle, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { fetchSecuritySummary, AdminThreatInsightSummaryOutput } from '@/ai/flows/admin-threat-insight-summary';
import { mockThreats } from '@/lib/mock-data';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<AdminThreatInsightSummaryOutput | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await fetchSecuritySummary({ threatData: mockThreats });
      setInsight(result);
    } catch (error) {
      console.error("AI Insight Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black">Governance Node</h1>
          <p className="text-sm text-muted-foreground">Configure adaptive rules and risk thresholds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs h-9">
            <RefreshCw className="w-3 h-3 mr-1.5" /> Reset
          </Button>
          <Button size="sm" className="text-xs h-9 font-bold">Apply Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/10 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Policy Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Dynamic Key Rotation</Label>
                  <p className="text-[10px] text-muted-foreground">Force rotate keys on high risk.</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Sensitivity</span>
                  <span className="text-primary">0.65</span>
                </div>
                <Slider defaultValue={[65]} max={100} step={1} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Neural Auth Escalation</Label>
                  <p className="text-[10px] text-muted-foreground">MFA on behavioral drift.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RuleWidget title="Session Kill" trigger="Risk > 0.8" active />
            <RuleWidget title="Access Lock" trigger="Entropy > 3.0" active />
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-accent">
                <Sparkles className="w-4 h-4" />
                Security Briefing
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!insight ? (
                <div className="text-center py-10">
                  <BrainCircuit className="w-8 h-8 text-accent/40 mx-auto mb-4 animate-pulse" />
                  <p className="text-[10px] text-muted-foreground mb-4">Run analysis to generate briefing.</p>
                  <Button onClick={runAnalysis} disabled={loading} size="sm" className="bg-accent hover:bg-accent/90 w-full text-[10px] font-bold">
                    {loading ? "Scanning..." : "Generate AI Briefing"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-[11px] animate-in zoom-in-95">
                  <div>
                    <p className="font-bold text-accent uppercase mb-1">Briefing</p>
                    <p className="text-muted-foreground leading-relaxed italic">{insight.summary}</p>
                  </div>
                  <div>
                    <p className="font-bold text-accent uppercase mb-1">Risk Factors</p>
                    <ul className="space-y-1">
                      {insight.keyThreatsIdentified.map((t, i) => (
                        <li key={i} className="flex gap-2">
                          <ChevronRight className="w-3 h-3 text-accent shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/10 bg-card/40">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase flex items-center gap-2">
                <Activity className="w-3 h-3 text-primary" />
                Model State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[10px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono text-primary">98.92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Baseline</span>
                <span className="font-mono">4.20 H</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RuleWidget({ title, trigger, active }: { title: string, trigger: string, active: boolean }) {
  return (
    <div className={`p-4 rounded-lg border bg-muted/20 ${active ? 'border-primary/20' : 'opacity-40'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-xs font-bold">{title}</h4>
        <Badge variant={active ? "default" : "outline"} className="text-[8px] h-4">
          {active ? "ON" : "OFF"}
        </Badge>
      </div>
      <p className="text-[9px] font-mono text-primary mb-1">{trigger}</p>
      <p className="text-[10px] text-muted-foreground">Auto-mitigation enabled.</p>
    </div>
  );
}
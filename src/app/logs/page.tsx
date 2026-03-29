"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Search, 
  ShieldCheck, 
  Database, 
  ExternalLink, 
  Link as LinkIcon, 
  AlertTriangle, 
  BrainCircuit, 
  Sparkles, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { mockLogs } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { processForensicLogs, ForensicAnalysisOutput } from '@/ai/flows/forensic-log-analysis';

export default function LogsPage() {
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<ForensicAnalysisOutput | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  const runDeepScan = async () => {
    setBusy(true);
    try {
      const data = await processForensicLogs({ logs: mockLogs });
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black">Audit Ledger</h1>
          <p className="text-sm text-muted-foreground">Immutable forensic evidence records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={runDeepScan}
            disabled={busy}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-9 px-4"
          >
            {busy ? <BrainCircuit className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
            {busy ? "Scanning..." : "AI Forensic Scan"}
          </Button>
          <div className="hidden md:flex items-center gap-2 bg-muted/20 border border-border/10 px-3 py-1.5 rounded-lg">
            <LinkIcon className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-mono text-accent">CHAIN_HT: 1.84M</span>
          </div>
        </div>
      </div>

      {report && (
        <Card className="border-accent/30 bg-accent/5 animate-in zoom-in-95">
          <CardHeader>
            <CardTitle className="text-base text-accent flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Forensic Report
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px]">
            <div className="space-y-4">
              <div>
                <p className="font-bold text-accent uppercase mb-1">Integrity Check</p>
                <div className="p-2 bg-black/20 rounded border border-accent/10 text-muted-foreground italic leading-relaxed">
                  {report.integrityReport}
                </div>
              </div>
              <div>
                <p className="font-bold text-accent uppercase mb-1">Verdict</p>
                <p className="font-medium text-foreground">"{report.forensicConclusion}"</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-accent uppercase mb-1">Anomalies</p>
                <ul className="space-y-1">
                  {report.anomaliesDetected.map((a, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground">
                      <ChevronRight className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-2.5 bg-primary/10 rounded border border-primary/20">
                <p className="font-bold text-primary uppercase mb-1 text-[9px]">Mitigation Protocol</p>
                <p className="text-muted-foreground font-mono leading-relaxed">{report.suggestedMitigation}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="py-2 border-t border-accent/10">
            <p className="text-[8px] font-mono text-accent/40 mx-auto">SCAN_ID: AI_V4_FS // {time}</p>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard title="Verification" value="Tamper-Proof" icon={<ShieldCheck className="w-4 h-4 text-primary" />} />
        <StatusCard title="Last Snapshot" value="May 20, 2024" icon={<Database className="w-4 h-4 text-accent" />} />
        <StatusCard title="Anomalies" value="2 Flagged" icon={<AlertTriangle className="w-4 h-4 text-destructive" />} />
      </div>

      <Card className="border-border/10 bg-card/40">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 py-3 px-4">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Filter entries..." className="pl-9 h-8 bg-muted/20 border-border/10 text-xs" />
            </div>
          </div>
          <span className="text-[9px] font-mono text-muted-foreground opacity-50">LGR_V2_PROT</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border/10">
                <TableHead className="text-[10px] uppercase font-bold">Time</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Event</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Risk</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold">Proof</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id} className="border-border/10 hover:bg-muted/5 transition-colors group">
                  <TableCell className="text-[10px] font-mono text-muted-foreground">{log.timestamp.split('T')[1].replace('Z', '')}</TableCell>
                  <TableCell className="text-xs font-semibold">{log.event}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[8px] h-4 font-normal">
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-0.5 bg-muted rounded-full">
                        <div className={`h-full ${log.risk > 0.5 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${log.risk * 100}%` }} />
                      </div>
                      <span className="text-[9px] font-mono">{(log.risk * 100).toFixed(0)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <ExternalLink className="w-3 h-3 ml-auto opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="border-border/10 bg-card/40">
      <CardContent className="pt-4 flex items-center gap-3">
        <div className="p-2 rounded bg-muted/20">{icon}</div>
        <div>
          <p className="text-[9px] font-bold uppercase text-muted-foreground">{title}</p>
          <p className="text-sm font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
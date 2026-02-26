"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Search, ShieldCheck, Database, ExternalLink, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { mockLogs } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

export default function LogsPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Immutable Audit Ledger</h1>
          <p className="text-muted-foreground">Blockchain-verified forensic security evidence</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-accent/10 border border-accent/20 px-4 py-2 rounded-lg flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono text-accent">Chain Height: 1,842,910</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ledger Integrity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold">Verified Tamper-Proof</span>
            </div>
            <p className="text-xs text-muted-foreground">Cryptographic proofs consistent across 12 distributed nodes.</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Forensic Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-accent" />
              <span className="text-xl font-bold">Snapshot: May 20, 2024</span>
            </div>
            <p className="text-xs text-muted-foreground">Forensic evidence preserved for incident #420-B.</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Threats Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="text-xl font-bold">2 Anomalies Flagged</span>
            </div>
            <p className="text-xs text-muted-foreground">Requires administrator review of risk-adaptive actions.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Filter by hash, event, or status..." className="pl-10 h-10 bg-muted/30 border-border/50" />
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary">Live Syncing...</Badge>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            PROTOCOL: BCT-LEGER-V2
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50">
                <TableHead>Timestamp</TableHead>
                <TableHead>Security Event</TableHead>
                <TableHead>System Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Block Hash</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id} className="border-border/50 hover:bg-muted/10 transition-colors group">
                  <TableCell className="text-muted-foreground font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell className="font-semibold">{log.event}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={log.status === 'Mitigated' ? 'default' : log.status === 'Success' ? 'secondary' : 'outline'}
                      className={log.status === 'Encrypted' ? 'bg-accent/20 text-accent border-accent/20' : ''}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${log.risk > 0.5 ? 'bg-destructive' : log.risk > 0.1 ? 'bg-primary' : 'bg-accent'}`} 
                          style={{ width: `${log.risk * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{(log.risk * 100).toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-[10px] tracking-widest">{log.blockHash}</TableCell>
                  <TableCell className="text-right">
                    <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary" />
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

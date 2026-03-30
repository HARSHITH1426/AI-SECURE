"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Search, 
  FileText, 
  Download, 
  Lock, 
  ShieldCheck, 
  AlertTriangle,
  Flame,
  Filter,
  MoreVertical,
  Cpu
} from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc } from 'firebase/firestore';
import { evaluateSessionRisk } from '@/lib/security-engine';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VaultPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [search, setSearch] = useState("");

  const filesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'vaultFiles'), where('userId', '==', user.uid));
  }, [db, user]);

  const { data: files, isLoading } = useCollection(filesQuery);

  const filteredFiles = useMemo(() => {
    if (!files) return [];
    return files.filter(f => 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  const handleDownload = async (file: any) => {
    if (file.isHoneyfile) {
      toast({
        variant: "destructive",
        title: "SECURITY ALERT TRIGGERED",
        description: "UNAUTHORIZED ACCESS TO DECOY FILE DETECTED.",
      });
      await evaluateSessionRisk({
        failedAttempts: 0,
        isNewIp: false,
        isUnusualTime: false,
        accessedHoneyfile: true,
        downloadSpikes: 5,
        recentLogs: [`Attempted to access decoy trap: ${file.name}`]
      });
      return;
    }
    
    toast({
      title: "DECRYPTION SUCCESSFUL",
      description: `Downloading ${file.name} through secure AES-256 pipeline.`,
    });
  };

  const createHoneyTrap = () => {
    if (!db || !user) return;
    addDoc(collection(db, 'vaultFiles'), {
      userId: user.uid,
      name: "admin_recovery_keys_2025.txt",
      category: "Critical",
      size: "8 KB",
      encryptedData: "AES256:FAKE_CHALLENGE",
      isHoneyfile: true,
      sensitivityLevel: "Critical",
      createdAt: new Date().toISOString()
    });
    toast({ title: "DECOY DEPLOYED", description: "Honey trap asset has been synchronized with the vault." });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-orbitron tracking-tight">SECURE <span className="text-primary">VAULT</span></h1>
          <p className="text-muted-foreground font-light tracking-wide uppercase text-xs mt-1">Encrypted Asset Management & Neural Trap Deployment</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={createHoneyTrap} className="rounded-2xl border-white/10 glass text-accent hover:border-accent/50 hover:bg-accent/5 font-bold h-12 px-6">
            <Flame className="w-5 h-5 mr-3" /> DEPLOY TRAP
          </Button>
          <Button className="rounded-2xl btn-neon bg-primary text-primary-foreground font-bold h-12 px-6">
            <Upload className="w-5 h-5 mr-3" /> UPLOAD ASSET
          </Button>
        </div>
      </div>

      <Card className="glass border-none overflow-hidden rounded-3xl">
        <CardHeader className="p-8 border-b border-white/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search neural vault for assets..." 
                className="pl-12 bg-white/5 border-white/5 focus:border-primary/50 h-12 rounded-2xl text-sm" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass border-primary/20">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black tracking-widest uppercase text-primary">AES-256 ACTIVE</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl glass border-white/5 hover:border-primary/20">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/2">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest">Asset Identifier</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Classification</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Payload Size</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Integrity Level</TableHead>
                <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl transition-all group-hover:neon-glow-primary",
                        file.isHoneyfile ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      )}>
                        {file.isHoneyfile ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{file.name}</span>
                          {file.isHoneyfile && <Badge variant="destructive" className="text-[8px] h-4 font-black bg-accent text-accent-foreground rounded-full">TRAP</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">ID: {file.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-widest bg-white/5 border-white/5 px-3 py-1 rounded-full">{file.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{file.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        file.sensitivityLevel === 'Critical' ? 'bg-accent animate-pulse' : 'bg-primary'
                      )} />
                      <span className="text-[11px] font-black tracking-widest uppercase">{file.sensitivityLevel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/20" onClick={() => handleDownload(file)}>
                        <Download className="w-5 h-5 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10 opacity-40 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFiles.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <Cpu className="w-12 h-12 text-muted-foreground" />
                      <p className="text-sm font-mono tracking-widest uppercase">No assets identified in current node.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

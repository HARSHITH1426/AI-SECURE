
"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Upload, 
  Search, 
  FileText, 
  Download, 
  Lock, 
  ShieldCheck, 
  MoreVertical,
  Filter,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc } from 'firebase/firestore';
import { evaluateSessionRisk } from '@/lib/security-engine';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

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
        title: "SECURITY ALERT",
        description: "Accessing protected system file. Triggering response...",
      });
      // AI Behavioral Response Trigger
      await evaluateSessionRisk({
        failedAttempts: 0,
        isNewIp: false,
        isUnusualTime: false,
        accessedHoneyfile: true,
        downloadSpikes: 5,
        recentLogs: [`Attempted to access honey file: ${file.name}`]
      });
      return;
    }
    
    toast({
      title: "Decryption Successful",
      description: `Downloading ${file.name} via AES-256 channel.`,
    });
  };

  const createHoneyTrap = () => {
    if (!db || !user) return;
    addDoc(collection(db, 'vaultFiles'), {
      userId: user.uid,
      name: "admin_passwords_v2.txt",
      category: "System",
      size: "4 KB",
      encryptedData: "AES256:FAKE_DATA",
      isHoneyfile: true,
      sensitivityLevel: "Critical",
      createdAt: new Date().toISOString()
    });
    toast({ title: "Honey Trap Created", description: "Decoy file deployed to monitor threats." });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Secure Vault</h1>
          <p className="text-muted-foreground">Encrypted storage with real-time adaptive defense</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createHoneyTrap} className="border-accent/30 text-accent">
            <Flame className="w-4 h-4 mr-2" /> Deploy Honey Trap
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="w-4 h-4 mr-2" /> Upload Asset
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search encrypted vault..." 
                className="pl-10 bg-muted/30 border-border/50" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-10 px-4 rounded-md border-border/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" /> AES-256 Active
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50">
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Security Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} className="border-border/50 hover:bg-muted/20">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${file.isHoneyfile ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        {file.isHoneyfile ? <AlertTriangle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <span className="flex items-center gap-2">
                        {file.name}
                        {file.isHoneyfile && <Badge variant="destructive" className="text-[8px] h-4">HONEY FILE</Badge>}
                        <Lock className="w-3 h-3 text-muted-foreground opacity-50" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{file.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{file.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${file.sensitivityLevel === 'Critical' ? 'bg-destructive' : 'bg-primary'}`} />
                      <span className="text-sm font-medium">{file.sensitivityLevel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(file)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFiles.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No encrypted assets found in this node.
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

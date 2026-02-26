"use client"

import { useState } from 'react';
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
  Trash2, 
  Lock, 
  ShieldCheck, 
  MoreVertical,
  Filter
} from 'lucide-react';
import { mockVaultFiles } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function VaultPage() {
  const [search, setSearch] = useState("");

  const filteredFiles = mockVaultFiles.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Vault Management</h1>
          <p className="text-muted-foreground">Securely isolated storage with multi-layer encryption</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Secure Asset
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search encrypted vault..." 
                className="pl-10 bg-muted/30 border-border/50 focus-visible:ring-primary" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 border-border/50">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
              <Badge variant="outline" className="h-10 px-4 rounded-md border-border/50 flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" /> Total: 1.2 GB
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50">
                <TableHead className="w-[400px]">Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Security Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} className="border-border/50 hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-primary/10 text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="flex items-center gap-2">
                        {file.name}
                        <Lock className="w-3 h-3 text-muted-foreground opacity-50" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{file.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{file.size}</TableCell>
                  <TableCell className="text-muted-foreground">{file.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${file.securityLevel === 'Critical' ? 'bg-destructive' : 'bg-primary'}`} />
                      <span className="text-sm font-medium">{file.securityLevel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-muted-foreground">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Integrity Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">Last full system scan completed 12 minutes ago.</p>
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/20">
              <span className="text-sm font-mono text-primary font-bold">100% HEALTHY</span>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Active Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">Vault assets are encrypted using the following standard:</p>
            <div className="bg-muted/30 p-3 rounded-lg border border-border/20 text-center">
              <span className="text-sm font-mono font-bold">AES-256-GCM / 1024-BIT RSA</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              Categorization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Scientific (12)</Badge>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Access (5)</Badge>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer">Corporate (24)</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

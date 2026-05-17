
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowRight, Lock, User, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AuthService } from '@/services/auth-service';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await AuthService.login({ email, password });
      
      if (response.data) {
        toast({
          title: "Identity Verified",
          description: "Establishing multi-sig session...",
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: response.error || "Invalid credentials provided to the node.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Protocol Error",
        description: "Could not connect to the Satoshi network.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <CardHeader className="p-10 pb-4 text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
          <Shield className="w-7 h-7" />
        </div>
        <CardTitle className="text-3xl font-headline font-bold tracking-tight">Identity Access</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Initialize your professional node session.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10 pt-6">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Identifier (Email)</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="alex@satoshi.mail" 
                  className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Access Key</Label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                  Recover Key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <Button 
            type="submit"
            className="w-full h-14 rounded-2xl bg-primary neon-glow-primary font-bold text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Initialize Session <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="p-10 pt-0 flex justify-center border-t border-white/5 bg-white/[0.02]">
        <p className="text-xs text-muted-foreground font-medium">
          New to the network? <Link href="/signup" className="text-primary font-bold hover:underline">Register Identity</Link>
        </p>
      </CardFooter>
    </Card>
  );
}

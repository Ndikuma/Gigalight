
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight, Mail, User, Lock, Briefcase, Zap, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AuthService } from '@/services/auth-service';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'professional' | 'client'>('professional');
  
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    email: '',
    password: '',
    password2: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast({ variant: "destructive", title: "Key Mismatch", description: "Access keys do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.signup({
        ...formData,
        role: role
      });

      if (response.data) {
        toast({
          title: "Protocol Initialized",
          description: "Your node identity has been registered. Proceed to login.",
        });
        router.push('/login');
      } else {
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: response.error || "Could not propagate identity to the network.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Interface Error",
        description: "The Satoshi gateway is unreachable.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
      <CardHeader className="p-10 pb-4 text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
          <Sparkles className="w-7 h-7" />
        </div>
        <CardTitle className="text-3xl font-headline font-bold tracking-tight">Identity Registration</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Join the professional Satoshi L2 workforce.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-10 pt-6">
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('professional')}
              className={cn(
                "p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2",
                role === 'professional' ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              <Zap className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Professional</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('client')}
              className={cn(
                "p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2",
                role === 'client' ? "bg-secondary/10 border-secondary text-secondary" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Client</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Username</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    name="username"
                    placeholder="alex_node" 
                    className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Display Name</Label>
                <Input 
                  name="display_name"
                  placeholder="Alex Lightning" 
                  className="h-12 bg-black/40 border-white/5 rounded-xl focus:ring-primary/40"
                  value={formData.display_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Protocol Mail</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  name="email"
                  type="email"
                  placeholder="alex@satoshi.mail" 
                  className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Access Key</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    name="password"
                    type="password"
                    placeholder="••••••••" 
                    className="h-12 bg-black/40 border-white/5 rounded-xl pl-11 focus:ring-primary/40"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Confirm Key</Label>
                <Input 
                  name="password2"
                  type="password"
                  placeholder="••••••••" 
                  className="h-12 bg-black/40 border-white/5 rounded-xl focus:ring-primary/40"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <Button 
            type="submit"
            className={cn(
              "w-full h-14 rounded-2xl font-bold text-lg",
              role === 'professional' ? "bg-primary neon-glow-primary" : "bg-secondary neon-glow-secondary"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Propagating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Initialize Node <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="p-10 pt-0 flex justify-center border-t border-white/5 bg-white/[0.02]">
        <p className="text-xs text-muted-foreground font-medium">
          Already verified? <Link href="/login" className="text-primary font-bold hover:underline">Access Identity</Link>
        </p>
      </CardFooter>
    </Card>
  );
}

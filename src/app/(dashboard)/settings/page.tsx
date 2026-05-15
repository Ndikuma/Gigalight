"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Wallet, Bell, Moon, Globe, Zap, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { mockProfile } from '@/lib/mock-data';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [profile, setProfile] = useState(mockProfile);

  function handleSave() {
    toast({
      title: "Profile Updated",
      description: "Your network identity has been synced to the L2.",
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your decentralized identity and platform preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20">
            <User className="w-4 h-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-white/5">
            <Shield className="w-4 h-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-white/5">
            <Wallet className="w-4 h-4" /> Wallet API
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-white/5">
            <Bell className="w-4 h-4" /> Notifications
          </Button>
        </nav>

        <div className="lg:col-span-3 space-y-8">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Identity & Bio</CardTitle>
              <CardDescription>This is how other nodes see you on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-primary p-1.5 rounded-full border-2 border-card">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="rounded-xl border-white/10 text-xs font-bold h-9">Change Avatar</Button>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Max 5MB • JPG/PNG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Full Name</Label>
                  <Input defaultValue={profile.fullName} className="bg-white/5 border-white/5 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input defaultValue={profile.location} className="bg-white/5 border-white/5 rounded-xl h-12 pl-11" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Bio</Label>
                <textarea 
                  className="w-full min-h-[120px] bg-white/5 border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                  defaultValue={profile.bio}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Skills (Comma separated)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.skills.map(skill => (
                    <Badge key={skill} className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest px-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Input defaultValue={profile.skills.join(', ')} className="bg-white/5 border-white/5 rounded-xl h-12" />
              </div>

              <Button onClick={handleSave} className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary px-8 font-bold h-12">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Network Settings</CardTitle>
              <CardDescription>Manage how you interact with the validation layer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Validator Node</Label>
                  <p className="text-sm text-muted-foreground">Audit work submissions and earn verification fees.</p>
                </div>
                <Switch defaultChecked={profile.isValidator} />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Public Stats</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your lifetime earnings and project history.</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Deleting your account will permanently remove all history. Ensure all SATs are withdrawn to an external wallet.</p>
              <Button variant="destructive" className="rounded-xl h-10 font-bold px-6">Deactivate Node</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

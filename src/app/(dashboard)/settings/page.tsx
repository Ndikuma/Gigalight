
"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Wallet, Bell, Moon, Globe, Zap } from 'lucide-react';
import { mockProfile } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and global identity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20">
            <User className="w-4 h-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <Shield className="w-4 h-4" /> Security
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <Wallet className="w-4 h-4" /> Wallet API
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <Bell className="w-4 h-4" /> Notifications
          </Button>
        </nav>

        <div className="lg:col-span-3 space-y-8">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Profile Information</CardTitle>
              <CardDescription>Your public identity on the Gigalight network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <img src={mockProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl border-white/10">Change Avatar</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={mockProfile.fullName} className="bg-white/5 border-white/5 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Public Email</Label>
                  <Input defaultValue="alex@lightning.node" className="bg-white/5 border-white/5 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Bio</Label>
                <textarea 
                  className="w-full min-h-[100px] bg-white/5 border-white/5 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  defaultValue="Senior full-stack developer obsessed with Bitcoin Layer 2s and decentralized marketplaces."
                />
              </div>
              <Button className="rounded-xl bg-primary hover:brightness-110 neon-glow-primary">Save Profile</Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Role Preferences</CardTitle>
              <CardDescription>Configure which roles are available in your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Worker Account</Label>
                  <p className="text-sm text-muted-foreground">Allows you to find gigs and earn SATs.</p>
                </div>
                <Switch defaultChecked={mockProfile.isWorkerAccount} />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Business Account</Label>
                  <p className="text-sm text-muted-foreground">Post jobs, manage projects, and hire talent.</p>
                </div>
                <Switch defaultChecked={mockProfile.isBusinessAccount} />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Validator Status</Label>
                  <p className="text-sm text-muted-foreground">Audit work submissions and earn verification fees.</p>
                </div>
                <Switch defaultChecked={mockProfile.isValidator} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Deleting your account will permanently remove all history and potentially lock remaining SATs if not withdrawn.</p>
              <Button variant="destructive" className="rounded-xl">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

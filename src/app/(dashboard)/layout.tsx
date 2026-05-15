"use client"

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { UserRole } from '@/lib/types';
import { Bell, Search, User, Globe } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('user');

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} onRoleChange={setRole} />
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-background/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4 bg-muted/30 border border-white/5 rounded-full px-4 py-2 w-full max-w-lg">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search gigs, projects or talent..." 
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <Globe className="w-3 h-3" /> Node: Satoshi-01
            </div>
            <div className="h-8 w-px bg-white/5"></div>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Alex Lightning</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Level 4 Node</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

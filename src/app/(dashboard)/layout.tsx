
"use client"

import React, { useState } from 'react';
import { UserRole } from '@/lib/types';
import { 
  Bell, 
  Search, 
  User, 
  Globe, 
  Zap, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  Briefcase,
  Wallet as WalletIcon,
  Search as SearchIcon,
  PlusCircle,
  LogOut,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('standard');
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Market', icon: SearchIcon, href: '/market' },
    { name: 'Listings', icon: Briefcase, href: '/my-projects' },
    { name: 'Wallet', icon: WalletIcon, href: '/wallet' },
    ...(role === 'validator' ? [{ name: 'Audits', icon: ShieldCheck, href: '/audits' }] : []),
  ];

  const roleConfigs = {
    standard: { label: 'Professional Mode', color: 'text-primary', icon: Sparkles, desc: 'Work & Hire' },
    validator: { label: 'Validator Mode', color: 'text-emerald-400', icon: ShieldCheck, desc: 'Audit Network' },
  };

  const currentRole = roleConfigs[role] || roleConfigs.standard;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Professional Navigation */}
      <header className="h-16 border-b border-white/5 bg-card/50 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          {/* Mobile Navigation */}
          <div className="xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card border-white/10 w-72 p-0">
                <SheetHeader className="p-6 border-b border-white/5">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow-primary">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-headline font-bold text-xl tracking-tight">Giga<span className="text-primary">light</span></span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          isActive 
                            ? "text-primary bg-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                  <div className="pt-4 mt-4 border-t border-white/5">
                     <Button asChild className="w-full rounded-xl bg-secondary hover:brightness-110 gap-2 h-12 font-bold shadow-lg shadow-secondary/20">
                      <Link href="/my-projects/create">
                        <PlusCircle className="w-4 h-4" /> Post a Listing
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow-primary transition-transform group-hover:scale-110">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight hidden sm:block">Giga<span className="text-primary">light</span></span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-3 bg-muted/30 border border-white/5 rounded-full px-4 py-1.5 w-48 lg:w-64 focus-within:w-80 transition-all focus-within:ring-1 focus-within:ring-primary/40">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search marketplace..." 
              className="bg-transparent text-xs outline-none w-full placeholder:text-muted-foreground"
            />
          </div>

          <div className="h-8 w-px bg-white/5 hidden sm:block mx-1 md:mx-2"></div>

          {/* Mode Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-xl h-10 px-2 md:px-3 hover:bg-white/5 gap-2 border border-white/5">
                <div className={cn("p-1 rounded-md bg-background", currentRole.color)}>
                  <currentRole.icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold leading-none">{currentRole.desc}</p>
                  <p className="text-xs font-bold leading-tight">{currentRole.label}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card border-white/10 p-2 shadow-2xl">
              <DropdownMenuItem onClick={() => setRole('standard')} className="flex items-center gap-3 rounded-lg p-2 focus:bg-primary/20 cursor-pointer">
                <Sparkles className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-bold text-sm">Professional Mode</p>
                  <p className="text-[10px] text-muted-foreground">Work Gigs & Hire Talent</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole('validator')} className="flex items-center gap-3 rounded-lg p-2 focus:bg-emerald-400/20 cursor-pointer">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-bold text-sm">Validator Mode</p>
                  <p className="text-[10px] text-muted-foreground">Audit & Verify Yield</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/5 hidden sm:flex">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 outline-none group ml-1 md:ml-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card border-white/10 p-2 shadow-2xl">
              <div className="p-3">
                <p className="text-sm font-bold">Alex Lightning</p>
                <p className="text-xs text-muted-foreground">alex@satoshi.mail</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  <Globe className="w-3 h-3" /> Node: Satoshi-01
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 p-2 rounded-lg cursor-pointer focus:bg-white/5">
                  <User className="w-4 h-4" /> Identity Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wallet" className="flex items-center gap-2 p-2 rounded-lg cursor-pointer focus:bg-white/5">
                  <WalletIcon className="w-4 h-4" /> Wallet Manager
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <Link href="/" className="flex items-center gap-2 p-2 rounded-lg">
                  <LogOut className="w-4 h-4" /> Exit Session
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Quick Action FAB for Mobile */}
      <div className="fixed bottom-6 right-6 xl:hidden">
        <Button size="icon" className="w-14 h-14 rounded-full bg-secondary neon-glow-secondary shadow-lg shadow-secondary/20" asChild>
          <Link href="/my-projects/create"><PlusCircle className="w-6 h-6" /></Link>
        </Button>
      </div>
    </div>
  );
}

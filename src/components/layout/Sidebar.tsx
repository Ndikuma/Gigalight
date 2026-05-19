
"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  Wallet, 
  Settings, 
  ShieldCheck, 
  Zap,
  LogOut,
  ChevronDown,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Sidebar({ role, onRoleChange }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Gigs Market', icon: Search, href: '/market' },
    { name: 'Tasks', icon: Zap, href: '/my-projects?tab=contributions' },
    { name: 'My Listings', icon: Briefcase, href: '/my-projects' },
    { name: 'Wallet', icon: Wallet, href: '/wallet' },
    ...(role === 'validator' ? [{ name: 'Audits', icon: ShieldCheck, href: '/audits' }] : []),
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  const roleConfigs = {
    standard: { label: 'Standard Mode', color: 'text-primary', icon: Sparkles, desc: 'Earn & Hire' },
    validator: { label: 'Validator Mode', color: 'text-emerald-400', icon: ShieldCheck, desc: 'Audit Network' },
  };

  // Fallback to standard if role is invalid or missing
  const currentRole = roleConfigs[role] || roleConfigs.standard;

  return (
    <aside className="w-64 border-r border-white/5 bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow-primary group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">Giga<span className="text-primary">light</span></span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="w-full text-left p-3 rounded-xl border border-white/5 bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between group outline-none">
            <div className="flex items-center gap-3">
              <div className={cn("p-1.5 rounded-lg bg-background", currentRole.color)}>
                <currentRole.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{currentRole.desc}</p>
                <p className="text-sm font-semibold">{currentRole.label}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-white/5 p-2">
            <DropdownMenuItem onClick={() => onRoleChange('standard')} className="flex items-center gap-2 cursor-pointer rounded-lg p-2 focus:bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" /> Standard Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRoleChange('validator')} className="flex items-center gap-2 cursor-pointer rounded-lg p-2 focus:bg-emerald-400/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Validator Mode
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes('tab=contributions') && pathname === '/my-projects');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 space-y-3">
        <Button asChild className="w-full rounded-xl bg-secondary hover:brightness-110 font-bold h-11 gap-2 neon-glow-secondary">
          <Link href="/my-projects/create">
            <PlusCircle className="w-4 h-4" /> Post a Listing
          </Link>
        </Button>
        <Button variant="ghost" asChild className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all justify-start">
          <Link href="/">
            <LogOut className="w-5 h-5" />
            Exit App
          </Link>
        </Button>
      </div>
    </aside>
  );
}

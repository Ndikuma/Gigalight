
"use client"

import React, { useState, useEffect } from 'react';
import { UserRole, Notification as NotificationType } from '@/lib/types';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Globe, 
  Zap, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  Briefcase,
  Wallet as WalletIcon,
  PlusCircle,
  LogOut,
  Menu,
  Network,
  Check,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileService } from '@/services/profile-service';
import { NotificationService } from '@/services/notification-service';
import { AuthService } from '@/services/auth-service';
import { toast } from '@/hooks/use-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('standard');
  const [mounted, setMounted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    async function initLayout() {
      const token = localStorage.getItem('gigalight_access');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [profRes, notifRes] = await Promise.all([
          ProfileService.getMyProfile(),
          NotificationService.getNotifications({ page_size: 5 })
        ]);

        if (profRes.status === 401) {
          AuthService.logout();
          router.push('/login');
          return;
        }

        if (profRes.data) {
          setUser(profRes.data);
          // Auto-set role based on validator status
          setRole(profRes.data.is_validator ? 'validator' : 'standard');
        }
        
        if (notifRes.data && Array.isArray(notifRes.data.results)) {
          setNotifications(notifRes.data.results);
        } else {
          setNotifications([]);
        }
        
        setIsAuthenticating(false);
      } catch (err) {
        console.error("Layout init error:", err);
        setIsAuthenticating(false); 
      }
    }
    
    initLayout();
  }, [router]);

  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => n.status === 'unread').length 
    : 0;

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllRead();
      setNotifications(prev => (prev || []).map(n => ({ ...n, status: 'read' as const })));
    } catch (e) {
      console.error("Failed to mark notifications as read:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (e) {
      console.error("Logout propagation failed:", e);
    } finally {
      router.push('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Market', icon: Globe, href: '/market' },
    { name: 'Tasks', icon: Zap, href: '/my-projects?tab=contributions' },
    { name: 'Listings', icon: Briefcase, href: '/my-projects' },
    { name: 'Financials', icon: WalletIcon, href: '/wallet' },
    ...(user?.is_validator && role === 'validator' ? [{ name: 'Audits', icon: ShieldCheck, href: '/audits' }] : []),
  ];

  const roleConfigs = {
    standard: { label: 'Professional Mode', color: 'text-primary', icon: Sparkles, desc: 'Strategy & Ops' },
    validator: { label: 'Validator Mode', color: 'text-emerald-400', icon: ShieldCheck, desc: 'Network Audit' },
  };

  const currentRole = roleConfigs[role] || roleConfigs.standard;

  if (!mounted || isAuthenticating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center neon-glow-primary animate-pulse">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" /> Synchronizing Node...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-white/5 bg-card/50 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
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
                    const isActive = pathname === item.href || (item.href.includes('tab=contributions') && pathname === '/my-projects');
                    return (
                      <Link key={item.name} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all", isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}>
                        <item.icon className="w-5 h-5" /> {item.name}
                      </Link>
                    );
                  })}
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
              const isActive = pathname === item.href || (item.href.includes('tab=contributions') && pathname === '/my-projects');
              return (
                <Link key={item.name} href={item.href} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all", isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}>
                  <item.icon className="w-4 h-4" /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button asChild variant="outline" size="sm" className="hidden lg:flex rounded-xl border-primary/20 text-primary hover:bg-primary/5 h-9 font-bold gap-2">
            <Link href="/my-projects/create"><PlusCircle className="w-4 h-4" /> Post Listing</Link>
          </Button>

          <div className="h-8 w-px bg-white/5 hidden sm:block mx-1 md:mx-2"></div>

          {/* Mode Switcher - Gated by user.is_validator */}
          {user?.is_validator ? (
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
                  <div><p className="font-bold text-sm">Professional Mode</p><p className="text-[10px] text-muted-foreground">Strategy & Ops</p></div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('validator')} className="flex items-center gap-3 rounded-lg p-2 focus:bg-emerald-400/20 cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div><p className="font-bold text-sm">Validator Mode</p><p className="text-[10px] text-muted-foreground">Audit & Integrity</p></div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="rounded-xl h-10 px-2 md:px-4 flex items-center gap-2 border border-white/5 bg-white/5 select-none cursor-default">
              <div className="p-1 rounded-md bg-background text-primary">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[9px] text-muted-foreground uppercase font-bold leading-none">Strategy & Ops</p>
                <p className="text-xs font-bold leading-tight">Professional Mode</p>
              </div>
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/5 hidden sm:flex outline-none">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-card animate-in zoom-in-50">{unreadCount}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 glass-card border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h4 className="font-headline font-bold text-sm">Network Activity</h4>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10" onClick={markAllAsRead}>Clear All</Button>
              </div>
              <ScrollArea className="h-80">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {notifications.map((n) => (
                      <div key={n.id} className={cn("p-4 transition-colors relative group cursor-pointer", n.status === 'unread' ? "bg-primary/5" : "hover:bg-white/5")}>
                        <div className="flex gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", n.type === 'reward' ? "bg-emerald-400/10 text-emerald-400" : "bg-primary/10 text-primary")}>
                            {n.type === 'reward' ? <Check className="w-4 h-4" /> : <Network className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs font-bold leading-none">{n.title}</p>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="w-8 h-8 text-muted-foreground/20" />
                    <p className="text-xs font-bold text-muted-foreground">All signals clear</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 outline-none group ml-1 md:ml-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <img src={user?.profile?.avatar_url || `https://picsum.photos/seed/${user?.id || 'node'}/100/100`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card border-white/10 p-2 shadow-2xl">
              <div className="p-3">
                <p className="text-sm font-bold">{user?.display_name || 'Protocol Node'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild><Link href="/settings" className="flex items-center gap-2 p-2 rounded-lg cursor-pointer focus:bg-white/5"><UserIcon className="w-4 h-4" /> Identity Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer flex items-center gap-2 p-2 rounded-lg"><LogOut className="w-4 h-4" /> Exit Session</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}

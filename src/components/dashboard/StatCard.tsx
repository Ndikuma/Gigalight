import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  trend?: 'up' | 'down';
  color?: 'primary' | 'secondary' | 'emerald';
}

export function StatCard({ label, value, icon: Icon, subValue, trend, color = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: 'bg-[#8457F1]/10 text-[#8457F1] border-[#8457F1]/20',
    secondary: 'bg-[#3C62FF]/10 text-[#3C62FF] border-[#3C62FF]/20',
    emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl border", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' ? "bg-emerald-400/10 text-emerald-400" : "bg-destructive/10 text-destructive"
          )}>
            {trend === 'up' ? '↑' : '↓'} 12%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <h3 className="text-2xl font-headline font-bold">{value}</h3>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </div>
    </div>
  );
}
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  icon?: LucideIcon;
  accentColor?: 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  accentColor = 'teal'
}) => {
  const getIconBg = () => {
    switch (accentColor) {
      case 'teal': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'sky': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'amber': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rose': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${getIconBg()}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
          {value}
        </div>

        {(subValue || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            {trend && (
              <span className={`font-medium ${
                trend.direction === 'up' ? 'text-emerald-600' :
                trend.direction === 'down' ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {trend.text}
              </span>
            )}
            {subValue && <span>{trend ? '·' : ''} {subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

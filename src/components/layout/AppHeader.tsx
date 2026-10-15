import React from 'react';
import { UserProfile, UserRole } from '../../types';
import { Anchor, LogOut, ArrowRightLeft, ShieldAlert } from 'lucide-react';

interface AppHeaderProps {
  user: UserProfile;
  currentSection: string;
  onSwitchRole: (newRole: UserRole) => void;
  onLogout: () => void;
  criticalAlertCount: number;
  onViewAlerts: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  currentSection,
  onSwitchRole,
  onLogout,
  criticalAlertCount,
  onViewAlerts,
}) => {
  const formatSectionTitle = (sec: string) => {
    switch (sec) {
      case 'overview': return 'Overview Dashboard';
      case 'tracking': return 'Global Real-Time Tracking & Fleet Radar';
      case 'demand': return 'Demand Intelligence';
      case 'suppliers': return 'Supplier Matching';
      case 'orders': return 'Order Tracking';
      case 'quality': return 'Quality & Freshness Risk';
      case 'shipments': return 'Shipment Monitoring';
      case 'coldchain': return 'Cold-Chain Telemetry';
      case 'risk': return 'AI Risk Center';
      case 'waste': return 'Waste Prevention';
      case 'docs': return 'Compliance & Documentation';
      case 'assistant': return user.role === 'buyer' ? 'AI Seafood Assistant' : 'AI Operations Copilot';
      case 'lab': return 'Experience Lab';
      default: return 'Dashboard';
    }
  };

  const isBuyer = user.role === 'buyer';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Breadcrumbs & Page Context */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Anchor className="w-3.5 h-3.5 text-teal-600" />
            SereSeaShip Guard
          </span>
          <span className="text-slate-300">/</span>
          <span className="capitalize">{user.role} Workspace</span>
          <span className="text-slate-300">/</span>
        </div>
        <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
          {formatSectionTitle(currentSection)}
        </h1>
      </div>

      {/* Zone 2: Real Status & Role Switch & Account */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Critical Alert Indicator if any */}
        {criticalAlertCount > 0 && (
          <button
            onClick={onViewAlerts}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="View critical cold-chain alerts"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span className="tabular-nums">{criticalAlertCount} Alert{criticalAlertCount > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Quick Role Switcher Button */}
        <button
          onClick={() => onSwitchRole(isBuyer ? 'logistics' : 'buyer')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title={`Switch to ${isBuyer ? 'Logistics' : 'Buyer'} workspace`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Switch to {isBuyer ? 'Logistics' : 'Buyer'}</span>
        </button>

        {/* Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            isBuyer ? 'bg-teal-600' : 'bg-sky-600'
          }`}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-semibold text-slate-900 leading-tight">
              {user.name}
            </span>
            <span className="block text-[11px] text-slate-500 capitalize">
              {user.role} · {user.organization}
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Sign out of SereSeaShip Guard"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

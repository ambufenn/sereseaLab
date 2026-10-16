import React from 'react';
import { UserRole } from '../../types';
import {
  Anchor,
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  ShieldCheck,
  Bot,
  Truck,
  Snowflake,
  AlertTriangle,
  Leaf,
  FileText,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  Compass,
  ShoppingBag
} from 'lucide-react';

interface AppSidebarProps {
  role: UserRole;
  currentSection: string;
  onSelectSection: (section: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenSettings: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  role,
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapsed,
  onOpenSettings,
}) => {
  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';

  const buyerNavItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tracking', label: 'Real-Time Tracking', icon: Compass },
    { id: 'demand', label: 'Demand Intelligence', icon: TrendingUp },
    { id: 'suppliers', label: 'Supplier Matching', icon: Users },
    { id: 'orders', label: 'Order Tracking', icon: Package },
    { id: 'quality', label: 'Quality & Freshness', icon: ShieldCheck },
    { id: 'assistant', label: 'AI Seafood Assistant', icon: Bot, isAi: true },
  ];

  const sellerNavItems = [
    { id: 'overview', label: 'Exporter Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Catch Lots & Batches', icon: Package },
    { id: 'orders', label: 'Singapore Orders', icon: ShoppingBag },
    { id: 'compliance', label: 'BKIPM & SFA Clearance', icon: ShieldCheck },
    { id: 'pricing', label: 'AI Pricing Optimizer', icon: TrendingUp },
    { id: 'tracking', label: 'Cross-Strait Tracking', icon: Compass },
    { id: 'assistant', label: 'Fishery Export Copilot', icon: Bot, isAi: true },
  ];

  const logisticsNavItems = [
    { id: 'overview', label: 'Operations Overview', icon: LayoutDashboard },
    { id: 'tracking', label: 'Real-Time Tracking', icon: Compass },
    { id: 'shipments', label: 'Shipment Monitoring', icon: Truck },
    { id: 'coldchain', label: 'Cold-Chain Telemetry', icon: Snowflake },
    { id: 'risk', label: 'AI Risk Center', icon: AlertTriangle },
    { id: 'waste', label: 'Waste Prevention', icon: Leaf },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'assistant', label: 'AI Operations Copilot', icon: Bot, isAi: true },
  ];

  const navItems = isBuyer ? buyerNavItems : isSeller ? sellerNavItems : logisticsNavItems;

  return (
    <aside
      className={`h-screen sticky top-0 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 z-40 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isBuyer
                  ? 'bg-teal-500/20 border-teal-500/40 text-teal-400'
                  : isSeller
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                  : 'bg-sky-500/20 border-sky-500/40 text-sky-400'
              }`}>
                <Anchor className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-bold text-white text-base tracking-tight block">SereSeaShip Guard</span>
                <span className={`text-[10px] block tracking-wide uppercase font-semibold ${
                  isBuyer ? 'text-teal-400' : isSeller ? 'text-indigo-400' : 'text-sky-400'
                }`}>
                  {isBuyer ? 'Buyer Suite' : isSeller ? 'Fishery Exporter Suite' : 'Logistics Suite'}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Anchor className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={onToggleCollapsed}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              collapsed ? 'hidden sm:block mx-auto' : ''
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="p-3 space-y-6">
          <div>
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Operations
              </p>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      isActive
                        ? isBuyer
                          ? 'bg-teal-600 text-white shadow-sm'
                          : isSeller
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.isAi ? (isSeller ? 'text-indigo-400' : 'text-teal-400') : 'text-slate-400'}`} />
                    {!collapsed && (
                      <span className="truncate flex-1 flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.isAi && (
                          <Sparkles className="w-3 h-3 text-amber-300 opacity-90" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dedicated Experience Lab Section (Reefer Tetris, Seafood Journey, Simulator, Flow Diagram) */}
          <div>
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Interactive Lab
              </p>
            )}
            <nav className="space-y-1">
              <button
                onClick={() => onSelectSection('lab')}
                title={collapsed ? 'Experience Lab' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  currentSection === 'lab'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Gamepad2 className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    <span>Experience Lab</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded">
                      Demo & Flow
                    </span>
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Settings & Serenade Data Brand */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenSettings}
          title={collapsed ? 'Platform Settings' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings & Roles</span>}
        </button>

        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-slate-850 border border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Created by Serenade Data
            </span>
            <span className="font-mono text-slate-500">v2.5</span>
          </div>
        )}
      </div>
    </aside>
  );
};

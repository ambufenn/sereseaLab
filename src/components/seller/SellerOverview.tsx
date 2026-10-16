import React from 'react';
import { CatchBatch, SellerOrder, Shipment } from '../../types';
import { StatCard } from '../common/StatCard';
import {
  Package,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Anchor,
  Snowflake,
  Clock,
  Sparkles,
  Workflow,
  CheckCircle2,
  Compass,
  AlertCircle
} from 'lucide-react';

interface SellerOverviewProps {
  batches: CatchBatch[];
  sellerOrders: SellerOrder[];
  shipments: Shipment[];
  onNavigate: (section: string) => void;
  onOpenAddBatch: () => void;
  onDispatchOrder: (order: SellerOrder) => void;
}

export const SellerOverview: React.FC<SellerOverviewProps> = ({
  batches,
  sellerOrders,
  shipments,
  onNavigate,
  onOpenAddBatch,
  onDispatchOrder
}) => {
  const totalStockKg = batches.reduce((sum, b) => sum + b.availableKg, 0);
  const totalStockValue = batches.reduce((sum, b) => sum + (b.availableKg * b.pricePerKgUSD), 0);
  const pendingOrders = sellerOrders.filter(o => o.status === 'pending' || o.status === 'accepted');
  const pendingOrdersValue = pendingOrders.reduce((sum, o) => sum + o.totalAmountUSD, 0);
  const dispatchedOrders = sellerOrders.filter(o => o.status === 'dispatched');

  return (
    <div className="space-y-6">
      {/* Editorial Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl border border-emerald-900/60 p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Anchor className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fishery Exporter Command Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              PT Nusantara Marine Export (Batam & Kepri)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Managing pristine catch manifests, real-time cryogenic storage temperatures, BKIPM export certifications, and high-speed cold-chain dispatches to Singapore wholesale & culinary hubs.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddBatch}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register New Catch Batch</span>
            </button>
            <button
              onClick={() => onNavigate('diagram')}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700 text-teal-300 border border-teal-500/30 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Workflow className="w-4 h-4 text-teal-400" />
              <span>Flow Simulation Demo</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle backdrop accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Catch in Storage"
          value={`${(totalStockKg / 1000).toFixed(1)} tons`}
          subValue={`Est. value $${totalStockValue.toLocaleString()}`}
          trend={{ direction: 'up', text: `${batches.length} active batches ready` }}
          icon={Package}
          accentColor="emerald"
        />
        <StatCard
          label="Pending SG Orders"
          value={pendingOrders.length}
          subValue={`Contract sum $${pendingOrdersValue.toLocaleString()}`}
          trend={{ direction: 'up', text: 'Jurong & Marina Bay' }}
          icon={ShoppingBag}
          accentColor="amber"
        />
        <StatCard
          label="Active Dispatches"
          value={dispatchedOrders.length}
          subValue="Maritime reefer in transit"
          trend={{ direction: 'neutral', text: 'ETA 2h - 18h' }}
          icon={Compass}
          accentColor="sky"
        />
        <StatCard
          label="BKIPM & SFA Compliance"
          value="99.6%"
          subValue="Zero customs rejections"
          trend={{ direction: 'up', text: 'e-Cert verified' }}
          icon={ShieldCheck}
          accentColor="teal"
        />
      </div>

      {/* Grid: Left Column (Catch Inventory) & Right Column (Singapore Orders) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Catch Manifest */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Active Catch Manifest & Cold Storage
              </h3>
              <p className="text-xs text-slate-500">
                Live inventory batches monitored under HACCP organoleptic standards.
              </p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All Batches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {batches.slice(0, 4).map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {batch.batchNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        batch.status === 'chilled_ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : batch.status === 'allocated'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {batch.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {batch.species}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Zone: {batch.catchZone}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block font-mono font-bold text-sm text-slate-900">
                      {batch.availableKg.toLocaleString()} kg
                    </span>
                    <span className="block font-mono text-xs text-emerald-700 font-semibold">
                      ${batch.pricePerKgUSD.toFixed(2)}/kg
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-600 font-mono">
                      <Snowflake className="w-3.5 h-3.5 text-teal-600" />
                      {batch.storageTemp > 0 ? `+${batch.storageTemp}°C` : `${batch.storageTemp}°C`}
                    </span>
                    <span className="text-slate-500">
                      QIM: <strong className="text-slate-800 font-medium">{batch.qimGrade.split(' ')[0]}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Cert #{batch.certificationNumber.split('/').pop()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Incoming Singapore Orders */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Singapore Buyer Orders
                </h3>
                <p className="text-xs text-slate-500">
                  Cross-strait demand needing fulfillment.
                </p>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {sellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'dispatched'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {order.species}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {order.buyerName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="font-mono text-slate-600">
                      {order.weightKg.toLocaleString()} kg
                    </span>
                    <span className="font-mono font-bold text-emerald-800">
                      ${order.totalAmountUSD.toLocaleString()}
                    </span>
                  </div>

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => onDispatchOrder(order)}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Anchor className="w-3.5 h-3.5" />
                      <span>Dispatch to Reefer Vessel</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>SFA Green-Lane Digital Pass Active</span>
            </span>
            <span className="font-mono text-teal-600 font-medium">
              Created by Serenade Data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

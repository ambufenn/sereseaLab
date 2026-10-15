import React from 'react';
import { PurchaseOrder, Shipment } from '../../types';
import { StatCard } from '../common/StatCard';
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Snowflake,
  ExternalLink,
  Compass
} from 'lucide-react';
import { GlobalCommandCenter } from '../dashboard/GlobalCommandCenter';

interface BuyerOverviewProps {
  orders: PurchaseOrder[];
  shipments: Shipment[];
  onNavigate: (section: string) => void;
  onSelectOrder: (order: PurchaseOrder) => void;
}

export const BuyerOverview: React.FC<BuyerOverviewProps> = ({
  orders,
  shipments,
  onNavigate,
  onSelectOrder,
}) => {
  const activeOrdersCount = orders.filter(o => o.status !== 'received').length;
  const arrivingToday = orders.filter(o => o.expectedDelivery.toLowerCase().includes('today')).length;
  const atRiskOrders = orders.filter(o => o.riskScore > 50);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Procurement & Supply Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time seafood inventory pipeline, expected dockings, and incoming freshness assurance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('tracking')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Fleet Radar</span>
          </button>
          <button
            onClick={() => onNavigate('demand')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            <span>Demand Forecast</span>
          </button>
          <button
            onClick={() => onNavigate('suppliers')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Match Suppliers</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Purchase Orders"
          value={activeOrdersCount}
          subValue="5 species in pipeline"
          trend={{ direction: 'up', text: '+12% vs last month' }}
          icon={ShoppingBag}
          accentColor="teal"
        />
        <StatCard
          label="Expected Deliveries Today"
          value={arrivingToday || 1}
          subValue="Rotterdam Gateway Hub"
          trend={{ direction: 'neutral', text: 'On Schedule' }}
          icon={Clock}
          accentColor="sky"
        />
        <StatCard
          label="Cold-Chain Safety Index"
          value="97.8%"
          subValue="Certified HACCP standard"
          trend={{ direction: 'up', text: '+1.4% consistency' }}
          icon={ShieldCheck}
          accentColor="emerald"
        />
        <StatCard
          label="Quality Risk Alerts"
          value={atRiskOrders.length}
          subValue="Sashimi temp drift alert"
          trend={{ direction: 'down', text: 'Requires attention' }}
          icon={AlertCircle}
          accentColor="rose"
        />
      </div>

      {/* Primary Operational Section: What needs attention right now? */}
      {atRiskOrders.length > 0 && (
        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-rose-800 font-semibold mb-1">
                  <span>URGENT PROCUREMENT ACTION</span>
                  <span>·</span>
                  <span className="font-mono">{atRiskOrders[0].poNumber}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {atRiskOrders[0].species} — Temperature fluctuation detected in transit
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Container CMAU-452109-1 (Pacific Rim Marine) reported a temp excursion to -16.2°C (target -20°C). Remaining sashimi shelf-life reduced by 24h. AI advises requesting an on-dock inspection or triggering rapid secondary re-chilling upon arrival.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('quality')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Inspect Quality Risk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Executive Command Center & Global Inbound Fleet Radar */}
      <GlobalCommandCenter
        shipments={shipments}
        role="buyer"
      />

      {/* Two Column Layout: Freshness Delivery Pipeline & Order Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Active Seafood Consignments
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                IoT-tracked purchase orders with live freshness verification
              </p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">PO & Species</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-right">Value (USD)</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4">Cold-Chain Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((order) => {
                  const isHighRisk = order.riskScore > 50;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-slate-900 block">{order.poNumber}</span>
                        <span className="text-slate-500 block truncate max-w-[200px]">{order.species}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {order.supplier}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-mono">
                        {order.weightKg.toLocaleString()} kg
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-semibold text-slate-900">
                        ${order.totalAmountUSD.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="block font-medium text-slate-900">{order.expectedDelivery}</span>
                        <span className="text-[11px] text-slate-500">{order.temperatureStandard}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span className={`font-medium ${isHighRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {isHighRisk ? 'Temp Anomaly' : 'Nominal Chilled'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-2.5 py-1 text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 rounded text-[11px] font-semibold transition-colors"
                        >
                          Specs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Freshness Index & Fast AI Suggestion */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Catch Freshness Index (QIM)
              </h3>
              <Snowflake className="w-4 h-4 text-teal-600" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Atlantic Salmon (Bergen)</span>
                  <span className="font-mono font-semibold text-emerald-700">QIM 2.0 · 14 Days Shelf</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[90%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Yellowfin Tuna (Mindanao)</span>
                  <span className="font-mono font-semibold text-amber-700">QIM 8.0 · 4 Days Shelf</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Wild Halibut (Dutch Harbor)</span>
                  <span className="font-mono font-semibold text-emerald-700">QIM 1.0 · 12 Days Shelf</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[95%]" />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Lower QIM indicates higher freshness</span>
              <button
                onClick={() => onNavigate('quality')}
                className="text-teal-600 font-semibold hover:underline"
              >
                Full Analysis
              </button>
            </div>
          </div>

          {/* AI Purchasing Recommendation Widget */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>AI PROCUREMENT SIGNAL</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Wild Alaskan Halibut Quota Closing
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dutch Harbor catch volumes will drop 85% by month end. Recommend locking in a 10,000 kg forward order with Bering Sound Fisheries to hedge a 16% spot-price rally.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('assistant')}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Query AI Assistant
              </button>
              <button
                onClick={() => onNavigate('demand')}
                className="text-xs text-slate-300 hover:text-white underline font-medium"
              >
                View Demand Forecast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

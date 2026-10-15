import React, { useState } from 'react';
import { PurchaseOrder } from '../../types';
import { Package, Clock, CheckCircle2, AlertTriangle, Truck, Anchor, MapPin } from 'lucide-react';

interface BuyerOrderTrackingProps {
  orders: PurchaseOrder[];
  selectedOrder?: PurchaseOrder | null;
  onClearSelected?: () => void;
}

export const BuyerOrderTracking: React.FC<BuyerOrderTrackingProps> = ({
  orders,
  selectedOrder: initialSelected,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>(
    initialSelected || orders[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Purchase Order Tracking & Telemetry
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          End-to-end milestone visibility from dock harvest to customer delivery with sensor validation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
            Active Orders ({orders.length})
          </div>
          {orders.map((order) => {
            const isSelected = selectedOrder.id === order.id;
            const isHighRisk = order.riskScore > 50;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block">
                      {order.poNumber}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                      {order.species}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">
                      <span>{order.supplier}</span>
                      <span> · </span>
                      <span className="font-mono">{order.weightKg.toLocaleString()} kg</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-bold text-slate-900 block">
                      ${order.totalAmountUSD.toLocaleString()}
                    </span>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider block mt-1 ${
                      isHighRisk ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>ETA: {order.expectedDelivery}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Risk: {order.riskScore}/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Tracking Milestone Card */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-700">
                  {selectedOrder.poNumber}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">Order Placed: {selectedOrder.orderDate}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedOrder.species}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Commitment</span>
              <span className="font-mono text-xl font-bold text-slate-900 block">
                ${selectedOrder.totalAmountUSD.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Telemetry Spec Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Supplier</span>
              <span className="font-semibold text-slate-900 truncate block mt-0.5">{selectedOrder.supplier}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Net Weight</span>
              <span className="font-mono font-semibold text-slate-900 block mt-0.5">{selectedOrder.weightKg.toLocaleString()} kg</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Freshness Guarantee</span>
              <span className="font-semibold text-emerald-800 block mt-0.5">{selectedOrder.freshnessGuaranteeDays} Days Shelf</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Thermal Standard</span>
              <span className="font-semibold text-slate-800 truncate block mt-0.5">{selectedOrder.temperatureStandard}</span>
            </div>
          </div>

          {/* Milestone Step Tracker */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Cold-Chain Milestones
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Vessel Catch & Landed Quality Inspection</span>
                    <span className="text-slate-400 font-mono text-[11px]">{selectedOrder.orderDate} 06:00</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Catch logged in FAO electronic vessel ledger. Slurry ice cold blast applied within 30 minutes of harvest.
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Reefer Container Stacking & Seal Lock</span>
                    <span className="text-slate-400 font-mono text-[11px]">{selectedOrder.orderDate} 15:45</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Temperature target set to {selectedOrder.temperatureStandard}. IoT door seals registered with cryptographic timestamp.
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                  selectedOrder.riskScore > 50 ? 'bg-amber-500' : 'bg-teal-600'
                }`}>
                  <Truck className="w-2.5 h-2.5 text-white" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Maritime / Intermodal Transit</span>
                    <span className="font-mono text-teal-700 text-[11px] font-semibold">Active In Transit</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sensors broadcasting GPS, internal core temperature, and relative humidity every 15 minutes.
                  </p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="relative opacity-70">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" />
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Port Hub Customs & Final Consignee Delivery</span>
                    <span className="text-slate-400 font-mono text-[11px]">ETA: {selectedOrder.expectedDelivery}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated smart contract release on receipt of valid temperature curve without HACCP breaches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

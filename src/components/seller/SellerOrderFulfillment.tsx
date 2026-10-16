import React, { useState } from 'react';
import { SellerOrder, CatchBatch, Shipment } from '../../types';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Snowflake,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Anchor,
  X,
  FileCheck2
} from 'lucide-react';

interface SellerOrderFulfillmentProps {
  orders: SellerOrder[];
  batches: CatchBatch[];
  onUpdateOrderStatus: (orderId: string, status: SellerOrder['status']) => void;
  onDispatchToLogistics: (order: SellerOrder, containerId: string, carrierName: string) => void;
}

export const SellerOrderFulfillment: React.FC<SellerOrderFulfillmentProps> = ({
  orders,
  batches,
  onUpdateOrderStatus,
  onDispatchToLogistics
}) => {
  const [selectedOrderToDispatch, setSelectedOrderToDispatch] = useState<SellerOrder | null>(null);
  const [carrierName, setCarrierName] = useState<string>('Samudera Seafresh Fast-Barge (Batam-Jurong)');
  const [containerId, setContainerId] = useState<string>('SMDU-891024-1');

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderToDispatch) return;

    onDispatchToLogistics(selectedOrderToDispatch, containerId, carrierName);
    setSelectedOrderToDispatch(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cross-Strait Export Pipeline
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Singapore Buyer Purchase Orders & Handoff
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage wholesale commitments, package into isothermal reefers, and dispatch to marine vessels.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SFA Green-Lane Connected</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => {
          const matchingBatch = batches.find(b => b.batchNumber === order.assignedBatchNumber);

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-mono text-xs font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'dispatched'
                          ? 'bg-sky-100 text-sky-800'
                          : order.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {order.species}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="block font-mono font-bold text-base text-slate-900">
                    ${order.totalAmountUSD.toLocaleString()}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {order.weightKg.toLocaleString()} kg @ ${order.unitPriceUSD.toFixed(2)}/kg
                  </span>
                </div>
              </div>

              {/* Order Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Buyer & Destination:</span>
                  <strong className="text-slate-800 block mt-0.5">{order.buyerName}</strong>
                  <span className="text-slate-500 text-[11px] block">{order.destinationPort}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Cold-Chain Requirement:</span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-teal-700 mt-0.5">
                    <Snowflake className="w-3.5 h-3.5" />
                    {order.coldChainSpec}
                  </span>
                  <span className="text-slate-500 text-[11px] block">Target departure: {order.targetShipDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Regulatory Inspection:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {order.inspectionStatus}
                  </span>
                  <span className="text-slate-500 text-[11px] block">
                    Batch: {order.assignedBatchNumber || 'Pending Allocation'}
                  </span>
                </div>
              </div>

              {/* Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Order Placed: {order.orderDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'accepted')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Order & Allocate Catch</span>
                    </button>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => setSelectedOrderToDispatch(order)}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Dispatch to Reefer Vessel</span>
                    </button>
                  )}

                  {order.status === 'dispatched' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 font-semibold text-xs border border-sky-200">
                      <Truck className="w-3.5 h-3.5 text-sky-600" />
                      <span>In Active Maritime Transit to Singapore</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DISPATCH TO LOGISTICS MODAL */}
      {selectedOrderToDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Dispatch Catch to Maritime Carrier
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hand off cargo to cold-chain reefer vessel bound for Singapore.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderToDispatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Order Details:</span>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedOrderToDispatch.species} ({selectedOrderToDispatch.weightKg.toLocaleString()} kg)
                </p>
                <p className="text-slate-600">
                  Buyer: {selectedOrderToDispatch.buyerName}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Assigned Reefer Container ID
                </label>
                <input
                  type="text"
                  value={containerId}
                  onChange={(e) => setContainerId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Maritime Carrier & Vessel
                </label>
                <select
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="Samudera Seafresh Fast-Barge (Batam-Jurong)">
                    Samudera Seafresh Fast-Barge (Batam ➔ Jurong Pier 2) - 3h transit
                  </option>
                  <option value="KM Nusantara Reefer 18 (Jakarta-Pasir Panjang)">
                    KM Nusantara Reefer 18 (Tanjung Priok ➔ Pasir Panjang) - 18h transit
                  </option>
                  <option value="Batam Express Sea Shuttle 04">
                    Batam Express Sea Shuttle 04 - Direct Express
                  </option>
                </select>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Automated Telemetry Gateway Activated</span>
                </div>
                <p className="text-teal-700">
                  Dual temperature sensors and GPS satellite tracker will start transmitting live readings directly to Singapore customs.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrderToDispatch(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Confirm & Dispatch Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { SUPPLIERS } from '../../data/mockData';
import { SeafoodSupplier } from '../../types';
import { ShieldCheck, Award, Star, Search, Check, Send, Clock, MapPin } from 'lucide-react';

export const BuyerSupplierMatching: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SeafoodSupplier | null>(null);
  const [rfqSuccess, setRfqSuccess] = useState<string | null>(null);
  const [rfqVolume, setRfqVolume] = useState('5000');
  const [rfqSpecies, setRfqSpecies] = useState('Atlantic Salmon');

  const filteredSuppliers = SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.speciesOffered.some(sp => sp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    setRfqSuccess(`RFQ submitted to ${selectedSupplier.name} for ${rfqVolume} kg of ${rfqSpecies}. AI contract verification dispatched.`);
    setTimeout(() => {
      setRfqSuccess(null);
      setSelectedSupplier(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Verified Supplier Matching & Sourcing
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pre-vetted commercial fisheries and aquaculture producers with certified cold-chain telemetry.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search species, supplier, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
          />
        </div>
      </div>

      {rfqSuccess && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{rfqSuccess}</span>
        </div>
      )}

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {supplier.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{supplier.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{supplier.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Reliability Score</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {supplier.reliabilityScore}%
                  </span>
                </div>
                <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                  <span className="text-emerald-700 text-[11px] block">Cold-Chain Assurance</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {supplier.coldChainCompliancePct}%
                  </span>
                </div>
              </div>

              {/* Species Offered */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Available Harvests
                </span>
                <div className="flex flex-wrap gap-1 text-xs text-slate-600">
                  {supplier.speciesOffered.map((sp, idx) => (
                    <span key={idx}>
                      {sp}{idx < supplier.speciesOffered.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications (Zero-pill text representation) */}
              <div className="mb-4 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Certifications
                </span>
                <div className="text-xs text-teal-800 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{supplier.certificationTypes.join(' · ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{supplier.avgDeliveryHours}h avg transit</span>
              </span>
              <button
                onClick={() => {
                  setSelectedSupplier(supplier);
                  setRfqSpecies(supplier.speciesOffered[0]);
                }}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Request RFQ</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RFQ Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Submit Direct RFQ to {selectedSupplier.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter target requirements to initiate smart contract matching and logistics pre-clearing.
            </p>

            <form onSubmit={handleSendRFQ} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Species
                </label>
                <select
                  value={rfqSpecies}
                  onChange={(e) => setRfqSpecies(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  {selectedSupplier.speciesOffered.map((sp) => (
                    <option key={sp} value={sp}>{sp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Required Volume (kg)
                </label>
                <input
                  type="number"
                  value={rfqVolume}
                  onChange={(e) => setRfqVolume(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-mono"
                  min="500"
                  step="500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Window
                </label>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900">
                  <option>Next available reefer sailing (48-72h)</option>
                  <option>Scheduled recurring bi-weekly</option>
                  <option>Spot purchase (immediate dispatch)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplier(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Transmit RFQ to Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

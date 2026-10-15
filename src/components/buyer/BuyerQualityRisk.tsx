import React, { useState } from 'react';
import { INITIAL_SHIPMENTS } from '../../data/mockData';
import { Shipment } from '../../types';
import { ShieldCheck, AlertTriangle, Snowflake, Sparkles, Check, ChevronRight } from 'lucide-react';

export const BuyerQualityRisk: React.FC = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(INITIAL_SHIPMENTS[1]); // Yellowfin tuna with excursion
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Quality Index Method (QIM) & Freshness Assurance
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sensory and chemical degradation models predicting exact retail shelf-life and cold-chain compliance.
        </p>
      </div>

      {actionNotice && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-teal-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Shipments List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1 block">
            Monitored Consignments
          </span>
          {INITIAL_SHIPMENTS.map((s) => {
            const isSelected = selectedShipment.id === s.id;
            const isCritical = s.riskLevel === 'critical';
            return (
              <div
                key={s.id}
                onClick={() => setSelectedShipment(s)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {s.containerId}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                      {s.species}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1">
                      <span>{s.origin}</span>
                      <span> → </span>
                      <span>{s.destination.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      isCritical ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      QIM: {s.qimFreshnessScore}/20
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {s.shelfLifeRemainingDays} days shelf-life
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed QIM & Degradation Inspector */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                Freshness Diagnostic Profile
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedShipment.species}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Container {selectedShipment.containerId} · {selectedShipment.buyerName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Current Cargo Temp</span>
              <span className={`font-mono text-xl font-bold ${
                selectedShipment.riskLevel === 'critical' ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {selectedShipment.currentTemp > 0 ? `+${selectedShipment.currentTemp}°C` : `${selectedShipment.currentTemp}°C`}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">
                Target: {selectedShipment.targetTemp}°C
              </span>
            </div>
          </div>

          {/* QIM Sensory Parameters Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Standardized Quality Index (QIM) Attributes
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Eye Translucency & Cornea Clarity</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {selectedShipment.qimFreshnessScore < 4 ? 'Clear & Convex (Score 0)' : 'Slight opalescence (Score 2)'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedShipment.qimFreshnessScore < 4 ? 'bg-emerald-500 w-[90%]' : 'bg-amber-500 w-[60%]'}`} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Gill Pigment & Marine Brine Aroma</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {selectedShipment.qimFreshnessScore < 4 ? 'Deep Crimson, Fresh Seaweed (Score 0)' : 'Muted Red, Neutral Odor (Score 2)'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedShipment.qimFreshnessScore < 4 ? 'bg-emerald-500 w-[95%]' : 'bg-amber-500 w-[55%]'}`} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Flesh Elasticity & Rigor Mortis Curve</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {selectedShipment.qimFreshnessScore < 4 ? 'Firm & Springing (Score 0)' : 'Moderate finger depression recovery (Score 2)'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedShipment.qimFreshnessScore < 4 ? 'bg-emerald-500 w-[92%]' : 'bg-amber-500 w-[50%]'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* TVB-N & Chemical Freshness */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Total Volatile Basic Nitrogen (TVB-N)</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-1 block">
                {selectedShipment.qimFreshnessScore < 4 ? '12.4 mg N/100g' : '22.8 mg N/100g'}
              </span>
              <span className="text-[11px] text-slate-500">EU Limit: 35 mg N/100g (Grade A)</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Calculated Remaining Retail Shelf-Life</span>
              <span className="text-base font-bold font-mono text-teal-800 mt-1 block">
                {selectedShipment.shelfLifeRemainingDays} Days Remaining
              </span>
              <span className="text-[11px] text-slate-500">at 0°C to 1°C storage</span>
            </div>
          </div>

          {/* AI Risk Recommendation */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI QUALITY COPILOT RECOMMENDATION</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedShipment.riskLevel === 'critical'
                ? 'Yellowfin Tuna consignment experienced a +3.8°C thermal deviation. While fit for culinary cooking, top sashimi grading requires rapid chill blast at Tokyo distribution port. Dispatch QA surveyor notice immediately.'
                : 'Atlantic Salmon consignment exhibits pristine QIM score (2.0) with zero cumulative thermal excursions. Estimated prime retail window is 14 days post-docking.'
              }
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleAction('Automated QA inspection request dispatched to receiving dock master.')}
                className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Request Priority Dock QA
              </button>
              <button
                onClick={() => handleAction('Supplier notified of thermal log telemetry.')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors border border-slate-700"
              >
                Notify Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

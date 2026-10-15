import React, { useState } from 'react';
import { Shipment } from '../../types';
import { AlertTriangle, ShieldAlert, TrendingDown, ArrowRight, Check, Compass, Sliders } from 'lucide-react';

interface LogisticsRiskCenterProps {
  shipments: Shipment[];
  onNavigateToWaste: () => void;
}

export const LogisticsRiskCenter: React.FC<LogisticsRiskCenterProps> = ({
  shipments,
  onNavigateToWaste,
}) => {
  const [activeTab, setActiveTab] = useState<'spoilage' | 'delay' | 'interventions'>('spoilage');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const criticalShipments = shipments.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'moderate');

  const handleExecuteAction = (actionName: string, containerId: string) => {
    setActionSuccess(`Action executed: ${actionName} for container ${containerId}. Automated dispatch notices transmitted.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            AI Cold-Chain Risk Center & Incident Mitigation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Predictive spoilage risk scoring, maritime delay modeling, and real-time salvage intervention.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('spoilage')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'spoilage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Spoilage Risk
          </button>
          <button
            onClick={() => setActiveTab('delay')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'delay' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Port & Customs Delays
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'interventions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Salvage Protocol
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Incidents */}
        <div className="lg:col-span-8 space-y-4">
          {criticalShipments.map((s) => {
            const isCritical = s.riskLevel === 'critical';

            return (
              <div
                key={s.id}
                className={`bg-white rounded-xl border p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4 ${
                  isCritical ? 'border-rose-200' : 'border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {s.containerId} · {s.species}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        Cargo Value: ${s.cargoValueUSD.toLocaleString()} USD ({s.quantityKg.toLocaleString()} kg)
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded self-start sm:self-auto ${
                    isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isCritical ? 'High Risk Incident' : 'Moderate Anomaly'}
                  </span>
                </div>

                {/* Analysis Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[11px] block">Sensor Breach</span>
                    <span className="font-mono font-bold text-rose-600 block mt-0.5">
                      {s.currentTemp > 0 ? `+${s.currentTemp}°C` : `${s.currentTemp}°C`} (Target: {s.targetTemp}°C)
                    </span>
                    <span className="text-slate-500 text-[11px]">Duration: 1.2 hours</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[11px] block">Degradation Rate</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">
                      +2.4x standard QIM decay
                    </span>
                    <span className="text-slate-500 text-[11px]">Shelf-life reduced to 4 days</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[11px] block">ETA to Destination</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">
                      {s.eta}
                    </span>
                    <span className="text-slate-500 text-[11px]">{s.destination.split(',')[0]}</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-3.5 bg-slate-900 text-white rounded-lg text-xs space-y-2">
                  <span className="text-sky-300 font-bold block uppercase text-[10px]">
                    SereSeaShip Guard Automated Recovery Action
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {s.alerts[0]?.recommendedAction ||
                      'Engage auxiliary chiller loop remotely or coordinate rapid clearance at Tokyo Port.'}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleExecuteAction('Engage Remote Emergency Chiller Loop', s.containerId)}
                      className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-md transition-colors"
                    >
                      Execute Chiller Override
                    </button>
                    <button
                      onClick={() => handleExecuteAction('Divert to Yokohama Blast-Freeze Terminal', s.containerId)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-md border border-slate-700 transition-colors"
                    >
                      Divert to Rapid Cryo-Hub
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Spoilage Model & Loss Aversion Stats */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Predictive Spoilage Decay Curve
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on kinetic Arrhenius microbial growth equations for seafood spoilage. For every 2°C temperature elevation above frozen setpoint, bacterial replication accelerates exponentially.
            </p>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block">Intervention Benefit</span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Initiating rapid cooling within 2 hours preserves 95% of commercial sashimi grade value.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Food Waste Prevention Hub</span>
              <button
                onClick={onNavigateToWaste}
                className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>View Salvage Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

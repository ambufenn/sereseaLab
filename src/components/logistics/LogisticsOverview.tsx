import React from 'react';
import { Shipment } from '../../types';
import { StatCard } from '../common/StatCard';
import {
  Truck,
  Snowflake,
  AlertTriangle,
  Leaf,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Compass
} from 'lucide-react';
import { GlobalCommandCenter } from '../dashboard/GlobalCommandCenter';

interface LogisticsOverviewProps {
  shipments: Shipment[];
  onNavigate: (section: string) => void;
  onSelectShipment: (shipment: Shipment) => void;
  onResolveAlert: (shipmentId: string, alertId: string) => void;
}

export const LogisticsOverview: React.FC<LogisticsOverviewProps> = ({
  shipments,
  onNavigate,
  onSelectShipment,
  onResolveAlert,
}) => {
  const activeShipments = shipments.filter(s => s.status === 'in_transit' || s.status === 'customs_hold');
  const tempAlertsCount = shipments.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'moderate').length;
  const criticalShipment = shipments.find(s => s.riskLevel === 'critical');

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cold-Chain Operations & Fleet Control
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Global refrigerated reefer container telemetry, temperature anomaly detection, and spoilage prevention.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('coldchain')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Snowflake className="w-3.5 h-3.5 text-sky-600" />
            <span>Telemetry Curves</span>
          </button>
          <button
            onClick={() => onNavigate('risk')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>AI Risk Center</span>
          </button>
        </div>
      </div>

      {/* 4 Core Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Reefer Shipments"
          value={activeShipments.length}
          subValue="52.4 MT cargo total"
          trend={{ direction: 'neutral', text: 'All units transmitting' }}
          icon={Truck}
          accentColor="sky"
        />
        <StatCard
          label="Deliveries In Progress"
          value={3}
          subValue="Rotterdam, Tokyo, Paris"
          trend={{ direction: 'up', text: 'ETA confidence 96%' }}
          icon={Compass}
          accentColor="teal"
        />
        <StatCard
          label="Active Temperature Alerts"
          value={tempAlertsCount}
          subValue="1 Critical Excursion"
          trend={{ direction: 'down', text: 'Requires immediate action' }}
          icon={AlertTriangle}
          accentColor="rose"
        />
        <StatCard
          label="Prevented Seafood Waste"
          value="42.6 MT"
          subValue="$482,000 saved YTD"
          trend={{ direction: 'up', text: '+8.2 MT this quarter' }}
          icon={Leaf}
          accentColor="emerald"
        />
      </div>

      {/* Primary Priority Alert: What needs attention right now? */}
      {criticalShipment && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 mb-1">
                  <span>CRITICAL COMPRESSOR FAULT</span>
                  <span>·</span>
                  <span className="font-mono">{criticalShipment.containerId}</span>
                  <span>·</span>
                  <span>{criticalShipment.species}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Temperature excursion to -16.2°C (exceeds -18°C sushi sashimi threshold)
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Reefer unit #2 duty cycle fault detected 42 mins ago. AI advises immediate remote activation of auxiliary loop B or rerouting consignment to Tokyo Cryogenic Pier 4.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (criticalShipment.alerts[0]) {
                    onResolveAlert(criticalShipment.id, criticalShipment.alerts[0].id);
                  }
                  onNavigate('coldchain');
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Activate Auxiliary Chiller</span>
                <Snowflake className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('risk')}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-lg transition-colors"
              >
                Inspect Risk Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Executive Command Center & Real Tracking */}
      <GlobalCommandCenter
        shipments={shipments}
        role="logistics"
        onSelectShipment={onSelectShipment}
      />

      {/* Main Operational Section: Live Fleet & Route Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Reefer Shipments Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Live Reefer Fleet Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time telemetry, core temperature variance, and ETA tracking
              </p>
            </div>
            <button
              onClick={() => onNavigate('shipments')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Full Fleet Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Container ID</th>
                  <th className="py-3 px-4">Species & Consignee</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4 text-center">Temp / Target</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {shipments.map((s) => {
                  const isCrit = s.riskLevel === 'critical';
                  const isMod = s.riskLevel === 'moderate';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {s.containerId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block truncate max-w-[180px]">{s.species}</span>
                        <span className="text-slate-400 text-[11px] block">{s.buyerName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block truncate max-w-[150px]">{s.origin}</span>
                        <span className="text-slate-400 text-[11px] block">to {s.destination.split(',')[0]}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className={`font-bold block ${
                          isCrit ? 'text-rose-600' : isMod ? 'text-amber-600' : 'text-slate-900'
                        }`}>
                          {s.currentTemp > 0 ? `+${s.currentTemp}°C` : `${s.currentTemp}°C`}
                        </span>
                        <span className="text-[11px] text-slate-400">Target: {s.targetTemp}°C</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold capitalize text-[11px] ${
                          isCrit ? 'text-rose-700' : isMod ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            onSelectShipment(s);
                            onNavigate('coldchain');
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-sky-700 hover:bg-sky-50 border border-slate-200 rounded text-[11px] font-semibold transition-colors"
                        >
                          Telemetry
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Cold-Chain Integrity & Waste Prevention Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Fleet Thermal Compliance
              </h3>
              <Snowflake className="w-4 h-4 text-sky-600" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Fresh Chilled (0°C to 2°C)</span>
                  <span className="font-mono font-semibold text-emerald-700">100% Compliant</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Deep Frozen (-20°C Standard)</span>
                  <span className="font-mono font-semibold text-amber-700">75% (1 Excursion)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[75%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Live Crustacean Aero (4°C)</span>
                  <span className="font-mono font-semibold text-emerald-700">100% Compliant</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>HACCP Validation Protocol</span>
              <button
                onClick={() => onNavigate('coldchain')}
                className="text-sky-600 font-semibold hover:underline"
              >
                View Sensor Logs
              </button>
            </div>
          </div>

          {/* Rapid Reroute & Food Waste Prevention Action */}
          <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>RAPID SPOILAGE MITIGATION</span>
            </div>
            <h4 className="text-sm font-bold text-white">
              Dynamic Salvage & Re-Route Available
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              For any shipment exceeding 6 hours outside thermal thresholds, automated routing algorithms match nearby regional processing facilities (canning, flash blast freeze) to prevent 100% loss.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => onNavigate('waste')}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Inspect Waste Pipeline
              </button>
              <button
                onClick={() => onNavigate('assistant')}
                className="text-xs text-slate-300 hover:text-white underline font-medium"
              >
                AI Ops Guidance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

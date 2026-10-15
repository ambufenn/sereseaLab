import React, { useState } from 'react';
import { Shipment } from '../../types';
import { Truck, Search, MapPin, Compass, Clock, Snowflake, ShieldCheck, ChevronRight } from 'lucide-react';

interface LogisticsShipmentMonitoringProps {
  shipments: Shipment[];
  onSelectShipment: (s: Shipment) => void;
  onNavigateToColdChain: (s: Shipment) => void;
}

export const LogisticsShipmentMonitoring: React.FC<LogisticsShipmentMonitoringProps> = ({
  shipments,
  onSelectShipment,
  onNavigateToColdChain,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = shipments.filter(s => {
    const matchesSearch = s.containerId.toLowerCase().includes(search.toLowerCase()) ||
      s.species.toLowerCase().includes(search.toLowerCase()) ||
      s.carrier.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Live Reefer Fleet & Shipment Telemetry
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Global maritime container tracking with live GPS positioning and thermal compliance sensors.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search container, carrier, species..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 w-56 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="in_transit">In Transit</option>
            <option value="customs_hold">Customs Hold</option>
            <option value="docked">Docked</option>
          </select>
        </div>
      </div>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => {
          const isCritical = s.riskLevel === 'critical';
          const isModerate = s.riskLevel === 'moderate';

          return (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm block">
                      {s.containerId}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {s.carrier}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isCritical ? 'bg-rose-100 text-rose-800' :
                    isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {s.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {s.species}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-mono">{s.quantityKg.toLocaleString()} kg</span>
                    <span>·</span>
                    <span className="font-mono">${s.cargoValueUSD.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Route Visualization */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 mb-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate"><strong>Origin:</strong> {s.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Compass className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate"><strong>Destination:</strong> {s.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 pt-1 border-t border-slate-200/60 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>ETA: {s.eta}</span>
                  </div>
                </div>

                {/* Telemetry Strip */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="p-2.5 rounded-lg border bg-white">
                    <span className="text-slate-400 text-[11px] block">Current Temp</span>
                    <span className={`font-mono font-bold text-sm ${
                      isCritical ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                      {s.currentTemp > 0 ? `+${s.currentTemp}°C` : `${s.currentTemp}°C`}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-white">
                    <span className="text-slate-400 text-[11px] block">Target Setpoint</span>
                    <span className="font-mono font-bold text-slate-700 text-sm">
                      {s.targetTemp}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  QIM {s.qimFreshnessScore}/20
                </span>
                <button
                  onClick={() => {
                    onSelectShipment(s);
                    onNavigateToColdChain(s);
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Open Telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

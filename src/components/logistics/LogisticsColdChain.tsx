import React, { useState } from 'react';
import { Shipment, ReeferTelemetryPoint } from '../../types';
import { Snowflake, AlertTriangle, ShieldCheck, Activity, Power, Sliders, Check, Download } from 'lucide-react';

interface LogisticsColdChainProps {
  shipments: Shipment[];
  selectedShipment?: Shipment | null;
  onUpdateTempSetpoint?: (shipmentId: string, newTarget: number) => void;
}

export const LogisticsColdChain: React.FC<LogisticsColdChainProps> = ({
  shipments,
  selectedShipment: propShipment,
}) => {
  const [activeShipment, setActiveShipment] = useState<Shipment>(
    propShipment || shipments[1] || shipments[0]
  );
  const [overrideSuccess, setOverrideSuccess] = useState<string | null>(null);
  const [auxModeActive, setAuxModeActive] = useState<boolean>(false);

  const handleAuxTrigger = () => {
    setAuxModeActive(true);
    setOverrideSuccess(`Auxiliary Chiller Loop B triggered for ${activeShipment.containerId}. Refrigeration duty cycle boosted to 100%.`);
    setTimeout(() => setOverrideSuccess(null), 4000);
  };

  const isExcursion = activeShipment.currentTemp > activeShipment.targetTemp + 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cold-Chain Telemetry & Sensor Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time reefer internal temperature, relative humidity, and compressor duty cycle tracking.
          </p>
        </div>

        {/* Container Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Reefer Unit:</label>
          <select
            value={activeShipment.id}
            onChange={(e) => {
              const found = shipments.find(s => s.id === e.target.value);
              if (found) setActiveShipment(found);
            }}
            className="px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {shipments.map(s => (
              <option key={s.id} value={s.id}>
                {s.containerId} ({s.species.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {overrideSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{overrideSuccess}</span>
        </div>
      )}

      {/* Primary Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sensor Metrics & Interactive Hardware Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-sky-700">
                  {activeShipment.containerId} · {activeShipment.carrier}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeShipment.species}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isExcursion ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isExcursion ? 'Temperature Excursion Flagged' : 'Thermal Envelope Nominal'}
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Core Temp</span>
                <span className={`font-mono text-xl font-bold block mt-0.5 ${
                  isExcursion ? 'text-rose-600' : 'text-slate-900'
                }`}>
                  {activeShipment.currentTemp > 0 ? `+${activeShipment.currentTemp}°C` : `${activeShipment.currentTemp}°C`}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Target: {activeShipment.targetTemp}°C</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Relative Humidity</span>
                <span className="font-mono text-xl font-bold text-slate-900 block mt-0.5">
                  {activeShipment.telemetryHistory[activeShipment.telemetryHistory.length - 1]?.humidity || 84}%
                </span>
                <span className="text-[11px] text-slate-500">Optimum: 85-90%</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Compressor Health</span>
                <span className={`font-mono text-xl font-bold block mt-0.5 ${
                  auxModeActive ? 'text-emerald-600' : isExcursion ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {auxModeActive ? '100% Boost' : isExcursion ? 'Cycling Fault' : 'Nominal'}
                </span>
                <span className="text-[11px] text-slate-500">Unit #2 Scroll</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-400 block">Door Sensor</span>
                <span className="font-mono text-xl font-bold text-emerald-700 block mt-0.5">
                  Sealed
                </span>
                <span className="text-[11px] text-slate-500">Lock ID #8819</span>
              </div>
            </div>

            {/* Visual Telemetry Chart Table Representation */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-600" />
                  <span>Telemetry Timeline (Past 6 Hours)</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">1-Hour Sampling Interval</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-y border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3 text-right">Logged Temp</th>
                      <th className="py-2.5 px-3 text-right">Setpoint Target</th>
                      <th className="py-2.5 px-3 text-right">Variance (Δ)</th>
                      <th className="py-2.5 px-3 text-right">RH %</th>
                      <th className="py-2.5 px-3 text-center">Door State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {activeShipment.telemetryHistory.map((point, idx) => {
                      const delta = (point.temperature - point.targetTemp).toFixed(1);
                      const isHigh = parseFloat(delta) > 2;

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-slate-600">{point.time} CET</td>
                          <td className={`py-2 px-3 text-right font-bold ${
                            isHigh ? 'text-rose-600' : 'text-slate-900'
                          }`}>
                            {point.temperature > 0 ? `+${point.temperature}°C` : `${point.temperature}°C`}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-500">
                            {point.targetTemp}°C
                          </td>
                          <td className={`py-2 px-3 text-right font-bold ${
                            isHigh ? 'text-rose-600' : 'text-slate-500'
                          }`}>
                            {parseFloat(delta) > 0 ? `+${delta}°C` : `${delta}°C`}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-600">
                            {point.humidity}%
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded ${
                              point.doorOpen ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {point.doorOpen ? 'Breach 12m' : 'Secured'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Remote Controls & HACCP Compliance Box */}
        <div className="lg:col-span-4 space-y-4">
          {/* Reefer Control Interface */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Reefer Remote Command</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">IoT Connected</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80">
                <span className="text-slate-400 text-[11px] block">Target Setpoint</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-lg font-bold text-white">{activeShipment.targetTemp}°C</span>
                  <span className="text-[11px] text-sky-300">ISO 22000 Locked</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Primary Compressor Loop</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Auxiliary Loop B</span>
                  <span className={`font-mono text-[11px] ${auxModeActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {auxModeActive ? 'Engaged (100%)' : 'Standby'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAuxTrigger}
                disabled={auxModeActive}
                className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Power className="w-3.5 h-3.5" />
                <span>{auxModeActive ? 'Auxiliary Chiller Active' : 'Engage Auxiliary Rapid Chill'}</span>
              </button>
            </div>
          </div>

          {/* HACCP Compliance Report Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Cold-Chain Audit Verification</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Cryptographic hash log validates continuous telemetry for customs and port health inspections under EU Regulation (EC) No 853/2004.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-slate-400 text-[11px]">Hash: 8f4b...392a</span>
              <button
                onClick={() => {
                  setOverrideSuccess(`Telemetry log exported for ${activeShipment.containerId}.`);
                  setTimeout(() => setOverrideSuccess(null), 3000);
                }}
                className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

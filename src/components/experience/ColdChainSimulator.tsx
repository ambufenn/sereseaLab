import React, { useState } from 'react';
import { AlertTriangle, Snowflake, Play, RotateCcw, ShieldCheck, Check, Sparkles, Activity, Clock, Compass, Anchor, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  species: string;
  corridor: string;
  normalTemp: number;
  initialTemp: number;
  failureType: string;
  ambientHeat: number;
  defaultLossUSD: number;
  description: string;
  aiMitigationDescription: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    name: 'Selat Karimata Compressor Duty Overload',
    species: 'Yellowfin Tuna Sashimi AAA (Muara Baru Harvest)',
    corridor: 'Jakarta (Tanjung Priok) → Singapore (Pasir Panjang Terminal)',
    normalTemp: -20.0,
    initialTemp: -20.0,
    failureType: 'Primary Scroll Compressor Circuit B Trip',
    ambientHeat: 34,
    defaultLossUSD: 245000,
    description: 'Equatorial maritime heatwave of 34°C and heavy swells in Selat Karimata trigger compressor thermal shutdown; internal reefer temperature is climbing towards the -16°C sashimi threshold.',
    aiMitigationDescription: 'SereSeaShip Guard AI autonomously engages secondary cryogenic loop, optimizes container ventilation dampers, and pre-books emergency priority green-berth at Pasir Panjang Terminal.'
  },
  {
    id: 'sc-2',
    name: 'SFA & BKIPM Electronic Quarantine Sync Delay',
    species: 'Black Tiger Prawns & Red Snapper (Udang & Kakap)',
    corridor: 'Medan (Pelabuhan Belawan) → Singapore (Jurong Cold Logistics Hub)',
    normalTemp: -22.0,
    initialTemp: -22.0,
    failureType: 'BKIPM / SFA Electronic Health Cert Checkpoint Hold',
    ambientHeat: 31,
    defaultLossUSD: 198000,
    description: 'Electronic health certificate hash discrepancy between Indonesia BKIPM e-Cert and Singapore Food Agency (SFA) TradeNet holds container on the open sunny inspection apron at Tuas.',
    aiMitigationDescription: 'SereSeaShip Guard auto-generates and transmits a cryptographic temperature integrity certificate directly to SFA TradeNet API, resolving clearance within 10 minutes.'
  },
  {
    id: 'sc-3',
    name: 'Selat Singapura Traffic Congestion & Aerator Surge',
    species: 'Live Cantang Grouper & Mud Crabs (Kerapu & Kepiting)',
    corridor: 'Batam (Pelabuhan Batu Ampar) → Singapore (Jurong Fishery Port Pier 2)',
    normalTemp: 3.0,
    initialTemp: 3.0,
    failureType: 'Seawater Aeration Pump Power Fluctuation',
    ambientHeat: 33,
    defaultLossUSD: 84000,
    description: 'Heavy tanker vessel traffic in the Singapore Strait TSS delays the fast-barge off St. John Island; seawater circulation pump voltage spike risks oxygen depletion and live seafood mortality.',
    aiMitigationDescription: 'Autonomous failover to battery-backed dissolved O2 micro-bubblers and dynamic route rerouting around anchored VLCC tankers directly into Jurong Pier 2.'
  },
  {
    id: 'sc-4',
    name: 'Changi Coolport Tarmac Heat Exposure',
    species: 'Fresh Bigeye Tuna Loins & Barramundi (Benoa / Bali Harvest)',
    corridor: 'Bali (Benoa) via Surabaya → Singapore (Changi Airport Coolport & Jurong)',
    normalTemp: 0.0,
    initialTemp: 0.0,
    failureType: 'Tarmac Transfer Thermal Blanket Puncture',
    ambientHeat: 33,
    defaultLossUSD: 142000,
    description: 'Cargo transfer delay on Singapore Changi Airport tarmac under 33°C tropical midday sun compromises ULD insulation, risking core muscle temperature rise above culinary grade.',
    aiMitigationDescription: 'SereSeaShip Guard triggers immediate automated dispatch of the Changi Coolport cryogenic re-icing team to Ramp Zone 3, preventing core temp excursion.'
  }
];

export const ColdChainSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [hoursElapsed, setHoursElapsed] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [aiMitigationActive, setAiMitigationActive] = useState<boolean>(false);

  // Calculate current simulated temperature based on scenario and hours elapsed
  const getSimulatedTemp = () => {
    if (hoursElapsed === 0) return selectedScenario.initialTemp;
    if (aiMitigationActive) {
      // AI mitigation arrested the climb!
      const climbBeforeMitigation = Math.min(1.8, hoursElapsed * 0.7);
      return (selectedScenario.initialTemp + climbBeforeMitigation - (hoursElapsed > 2 ? (hoursElapsed - 2) * 0.5 : 0)).toFixed(1);
    }
    // Unmitigated climb
    const rate = selectedScenario.species.includes('Live') || selectedScenario.species.includes('Fresh') ? 0.8 : 0.6;
    return (selectedScenario.initialTemp + hoursElapsed * rate).toFixed(1);
  };

  const currentTemp = parseFloat(getSimulatedTemp().toString());
  const isCritical = currentTemp > (selectedScenario.normalTemp + 2.5);

  const handleStepHour = () => {
    setHoursElapsed(h => Math.min(12, h + 1));
  };

  const handleTriggerMitigation = () => {
    setAiMitigationActive(true);
  };

  const handleReset = () => {
    setHoursElapsed(0);
    setIsSimulating(false);
    setAiMitigationActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            Indonesia ⇄ Singapore Cold-Chain Sandbox
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Thermal Failure & AI Intervention Simulator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Simulate realistic hardware faults & customs delays on Indonesia-Singapore shipping lanes and evaluate SereSeaShip Guard's automated mitigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector: 4 Indonesia-to-Singapore specific corridors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                handleReset();
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-1 ring-teal-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded font-bold uppercase">
                  {sc.corridor.split('→')[0].split('(')[0].trim()} → SG
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  ${(sc.defaultLossUSD / 1000).toFixed(0)}k Risk
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                {sc.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {sc.species}
              </p>
            </button>
          );
        })}
      </div>

      {/* Corridor Route Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-teal-400 shrink-0" />
          <div>
            <span className="text-slate-400 block text-[10px]">SELECTED TRADE LANE CORRIDOR</span>
            <span className="font-bold text-teal-300 text-xs sm:text-sm">{selectedScenario.corridor}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <span>Standard: <strong className="text-white">{selectedScenario.normalTemp}°C</strong></span>
          <span>Tropical Ambient: <strong className="text-amber-400">+{selectedScenario.ambientHeat}°C</strong></span>
          <span>Cargo Risk: <strong className="text-rose-400">${selectedScenario.defaultLossUSD.toLocaleString()} USD</strong></span>
        </div>
      </div>

      {/* Simulation Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Telemetry Gauges */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Container Telemetry
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {selectedScenario.species}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedScenario.failureType}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                Elapsed: +{hoursElapsed}h
              </span>
            </div>
          </div>

          {/* Gauges */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[11px]">Core Cargo Temp</span>
              <span className={`font-mono text-2xl sm:text-3xl font-bold block mt-1 ${
                isCritical ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {currentTemp > 0 ? `+${currentTemp}°C` : `${currentTemp}°C`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Target: {selectedScenario.normalTemp}°C</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[11px]">Tropical Sea Ambient</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-600 block mt-1">
                +{selectedScenario.ambientHeat}°C
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Straits Humidity: 88%</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[11px]">Potential Cargo Loss</span>
              <span className={`font-mono text-2xl sm:text-3xl font-bold block mt-1 ${
                aiMitigationActive ? 'text-emerald-700' : isCritical ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {aiMitigationActive ? '$0' : isCritical ? `$${selectedScenario.defaultLossUSD.toLocaleString()}` : '$0'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {aiMitigationActive ? '100% Protected' : isCritical ? 'Severe Spoilage Risk' : 'Normal Buffer'}
              </span>
            </div>
          </div>

          {/* Thermal Deviation Graph visualization */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Temperature Drift Projection (+12 Hours)</span>
              <span className="font-mono text-[11px] text-slate-500">
                {aiMitigationActive ? 'Stabilized via AI Auxiliary Loop' : 'Uncontrolled Thermal Ingress'}
              </span>
            </div>
            <div className="relative h-16 w-full bg-white rounded-lg border border-slate-200 overflow-hidden flex items-end px-2 py-1 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => {
                const isActive = hour <= hoursElapsed;
                const heightPct = Math.min(100, Math.max(15, 20 + hour * (aiMitigationActive ? 3 : 6.5)));
                return (
                  <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        !isActive ? 'bg-slate-100' :
                        aiMitigationActive ? 'bg-emerald-500' :
                        hour >= 4 ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
              <span>0h Departure</span>
              <span>+4h Crisis Point</span>
              <span>+8h Straits</span>
              <span>+12h Singapore Dock</span>
            </div>
          </div>

          {/* Simulation Timeline Controls */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Time-Lapse Controls:</span>
              <span className="text-slate-500 font-mono">Step forward in 1-hour increments</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleStepHour}
                disabled={hoursElapsed >= 12}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Advance +1 Hour</span>
              </button>

              <button
                onClick={() => setHoursElapsed(4)}
                className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Jump to +4h (Critical Deviation)
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Reset Chamber
              </button>
            </div>
          </div>
        </div>

        {/* Right: SereSeaShip Guard AI Intervention Engine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">SereSeaShip Guard Autonomous Mitigation</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                aiMitigationActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {aiMitigationActive ? 'MITIGATION ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>Incident Profile:</strong> {selectedScenario.description}
              </p>
            </div>

            <div className="p-3.5 bg-slate-800/90 rounded-lg border border-slate-700 text-xs space-y-1.5">
              <span className="text-teal-400 block text-[11px] font-mono font-bold uppercase tracking-wider">
                Autonomous Intervention Plan
              </span>
              <p className="text-slate-200 font-medium leading-relaxed">
                {selectedScenario.aiMitigationDescription}
              </p>
            </div>

            {aiMitigationActive ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg space-y-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Seafood Cargo Safeguarded</span>
                </div>
                <p className="text-emerald-200/80 text-[11px]">
                  Auxiliary cooling active. Real-time temperature drift neutralized back to safe bounds. Spoilage risk reduced to 0%.
                </p>
              </div>
            ) : null}

            <button
              onClick={handleTriggerMitigation}
              disabled={aiMitigationActive}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{aiMitigationActive ? 'AI Mitigation Engaged' : 'Trigger Automated AI Intervention'}</span>
            </button>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Integration: Singapore SFA & Indonesia BKIPM</span>
              <span className="text-teal-400 font-mono">Port API Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

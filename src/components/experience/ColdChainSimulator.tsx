import React, { useState } from 'react';
import { AlertTriangle, Snowflake, Play, RotateCcw, ShieldCheck, Check, Sparkles, Activity, Clock } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  species: string;
  normalTemp: number;
  initialTemp: number;
  failureType: string;
  ambientHeat: number;
  defaultLossUSD: number;
  description: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    name: 'Reefer Compressor Seizure in Red Sea',
    species: 'Yellowfin Tuna Loins (Sashimi AAA)',
    normalTemp: -20.0,
    initialTemp: -20.0,
    failureType: 'Scroll Compressor Power Cut',
    ambientHeat: 38,
    defaultLossUSD: 238000,
    description: 'Ambient maritime heatwave of 38°C causes rapid internal thermal climb without mechanical refrigeration.'
  },
  {
    id: 'sc-2',
    name: 'Hamburg Port Customs 36h Paperwork Stall',
    species: 'Black Tiger Prawns (Frozen Blocks)',
    normalTemp: -22.0,
    initialTemp: -22.0,
    failureType: 'Veterinary Clearance Hold',
    ambientHeat: 24,
    defaultLossUSD: 312000,
    description: 'Reefer unplugged on apron while paper documentation is manually translated by port authorities.'
  },
  {
    id: 'sc-3',
    name: 'Transpacific Door Seal Breach',
    species: 'Fresh Atlantic Salmon (Chilled Slurry)',
    normalTemp: 0.5,
    initialTemp: 0.5,
    failureType: 'Gasket Vibration Failure',
    ambientHeat: 28,
    defaultLossUSD: 168000,
    description: 'Warm humid sea air ingress during rough swell accelerates bacterial replication.'
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
      const climbBeforeMitigation = Math.min(2, hoursElapsed * 0.8);
      return (selectedScenario.initialTemp + climbBeforeMitigation - (hoursElapsed > 2 ? (hoursElapsed - 2) * 0.6 : 0)).toFixed(1);
    }
    // Unmitigated climb
    const rate = selectedScenario.species.includes('Fresh') ? 0.9 : 0.6;
    return (selectedScenario.initialTemp + hoursElapsed * rate).toFixed(1);
  };

  const currentTemp = parseFloat(getSimulatedTemp().toString());
  const isCritical = currentTemp > (selectedScenario.normalTemp + 3);

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
            Cold-Chain Stress Test Sandbox
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Thermal Failure & AI Intervention Simulator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Simulate critical hardware breakdowns and evaluate SerenAgri's automated mitigation response.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                handleReset();
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/30 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                  {sc.failureType}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  ${sc.defaultLossUSD.toLocaleString()} Risk
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {sc.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {sc.species}
              </p>
            </button>
          );
        })}
      </div>

      {/* Simulation Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Telemetry Gauges */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Chamber Runtime
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedScenario.species}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                Elapsed: +{hoursElapsed} Hours
              </span>
            </div>
          </div>

          {/* Gauges */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[11px]">Chamber Core Temp</span>
              <span className={`font-mono text-2xl sm:text-3xl font-bold block mt-1 ${
                isCritical ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {currentTemp > 0 ? `+${currentTemp}°C` : `${currentTemp}°C`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Target: {selectedScenario.normalTemp}°C</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[11px]">Ambient Port Temp</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-600 block mt-1">
                +{selectedScenario.ambientHeat}°C
              </span>
              <span className="text-[10px] text-slate-400">External Heat Load</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-slate-400 block text-[11px]">Potential Cargo Loss</span>
              <span className={`font-mono text-2xl sm:text-3xl font-bold block mt-1 ${
                aiMitigationActive ? 'text-emerald-700' : isCritical ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {aiMitigationActive ? '$0' : isCritical ? `$${selectedScenario.defaultLossUSD.toLocaleString()}` : '$0'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {aiMitigationActive ? '100% Protected' : 'At Risk'}
              </span>
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
                Jump to +4h (Critical Point)
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

        {/* Right: SerenAgri AI Intervention Engine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">SereSeaShip Guard Incident Mitigation</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                aiMitigationActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {aiMitigationActive ? 'MITIGATION DEPLOYED' : 'STANDBY'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When sensors detect a persistent thermal climb exceeding 1.2°C, SereSeaShip Guard executes automated failover: auxiliary generator ignition, setpoint compensation, and dynamic salvage notification.
            </p>

            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs space-y-1">
              <span className="text-slate-400 block text-[11px]">Recommended Strategy</span>
              <p className="text-slate-200 font-medium">
                {selectedScenario.id === 'sc-1'
                  ? 'Switch to secondary compressor loop B & transmit emergency cold-berth clearance to Tokyo harbor.'
                  : selectedScenario.id === 'sc-2'
                  ? 'Auto-dispatch cryptographic Catch Certificate hash to customs API gate for priority release.'
                  : 'Inject dry-ice CO2 auxiliary cold blast and reseal container entry point.'}
              </p>
            </div>

            <button
              onClick={handleTriggerMitigation}
              disabled={aiMitigationActive}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{aiMitigationActive ? 'AI Mitigation Safeguarding Catch' : 'Trigger Automated AI Intervention'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

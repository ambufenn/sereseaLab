import React, { useState, useEffect } from 'react';
import {
  Anchor,
  Truck,
  Building2,
  UtensilsCrossed,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Snowflake,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Info,
  Layers,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';

interface StageNode {
  id: number;
  name: string;
  tagline: string;
  actor: string;
  location: string;
  icon: any;
  color: string;
  borderColor: string;
  bgColor: string;
  tempReading: string;
  targetTemp: string;
  dwellTime: string;
  protocol: string;
  keyAction: string;
  telemetryPayload: {
    status: string;
    ambientTemp: string;
    internalTemp: string;
    humidity: string;
    powerState: string;
    certificationId: string;
    dataHash: string;
  };
}

export const SupplyChainDiagramDemo: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<number>(1);
  const [injectedEvent, setInjectedEvent] = useState<string | null>(null);

  const STAGES: StageNode[] = [
    {
      id: 1,
      name: 'Stage 1: Fishery Landing & Cold Prep',
      tagline: 'Catch Registration & Pre-Chilling',
      actor: 'Indonesian Exporter / Seller',
      location: 'Batam / Muara Baru / Bali',
      icon: Anchor,
      color: 'emerald',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-500/10',
      tempReading: '+3.2°C Chilled',
      targetTemp: '+3.0°C (Live Tank) or -22.0°C (IQF)',
      dwellTime: '0.8 hours',
      protocol: 'BKIPM Pre-Harvest Quality & Health Standard',
      keyAction: 'Digital QIM organoleptic rating, electronic catch documentation (e-SHTI), and isothermal reefer pre-cooling.',
      telemetryPayload: {
        status: 'DISPATCH_READY',
        ambientTemp: '30.5°C',
        internalTemp: '3.1°C',
        humidity: '96%',
        powerState: 'Shore Grid Active',
        certificationId: 'BKIPM/BTM/EXP/2026/8812',
        dataHash: '0x8f2a...c31b'
      }
    },
    {
      id: 2,
      name: 'Stage 2: Reefer Maritime Corridor',
      tagline: 'Cross-Strait Autonomous Telemetry',
      actor: 'Cold-Chain Reefer Logistics Fleet',
      location: 'Selat Malaka / Selat Singapura',
      icon: Truck,
      color: 'sky',
      borderColor: 'border-sky-500',
      bgColor: 'bg-sky-500/10',
      tempReading: '+3.2°C Stable',
      targetTemp: '+3.0°C ±0.5°C Bound',
      dwellTime: '2.5 - 18 hours transit',
      protocol: 'IMO SPS & Real-Time IoT In-Transit Telemetry',
      keyAction: 'Satellite ping every 60s, automated dual-compressor backup, and dynamic route speed adjustment.',
      telemetryPayload: {
        status: 'MARITIME_UNDERWAY',
        ambientTemp: '28.2°C (Sea)',
        internalTemp: '3.2°C',
        humidity: '95%',
        powerState: 'Dual Reefer Generator #1 ACTIVE',
        certificationId: 'IMO-REEFER-SMDU891',
        dataHash: '0x3e19...77b4'
      }
    },
    {
      id: 3,
      name: 'Stage 3: Singapore Port & SFA Customs',
      tagline: 'Cryogenic Gateway Pre-Clearance',
      actor: 'Singapore Customs & SFA Inspectors',
      location: 'Jurong Fishery Port Pier 2 / Pasir Panjang',
      icon: Building2,
      color: 'amber',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-500/10',
      tempReading: '+3.1°C Held',
      targetTemp: 'Strict < 4.0°C Verification',
      dwellTime: '38 minutes (Green Lane)',
      protocol: 'Singapore Food Agency (SFA) TradeNet 5.0',
      keyAction: 'Automated data log audit, zero-touch clearance via electronic health cert matching, zero defrosting delay.',
      telemetryPayload: {
        status: 'SFA_GREENLANE_CLEARED',
        ambientTemp: '24.0°C (Quayside)',
        internalTemp: '3.1°C',
        humidity: '94%',
        powerState: 'Quayside Shore Power Connected',
        certificationId: 'SFA-TRADENET-PERMIT-4019',
        dataHash: '0xaa42...91f0'
      }
    },
    {
      id: 4,
      name: 'Stage 4: Premium Buyer & Gastronomy',
      tagline: 'Zero-Waste Fresh Receiving',
      actor: 'Singapore Seafood Buyer & Chefs',
      location: 'Jurong Hub & Marina Bay Sands',
      icon: UtensilsCrossed,
      color: 'teal',
      borderColor: 'border-teal-500',
      bgColor: 'bg-teal-500/10',
      tempReading: '+3.0°C Pristine',
      targetTemp: 'Served Fresh (0 Spoilage)',
      dwellTime: 'Final distribution',
      protocol: 'HACCP Tier 1 & Consumer Provenance QR',
      keyAction: 'Immediate cold storage check-in, dynamic QR code generation for diners showing Indonesian origin & live temp history.',
      telemetryPayload: {
        status: 'DELIVERED_ZERO_WASTE',
        ambientTemp: '21.0°C (Kitchen)',
        internalTemp: '3.0°C',
        humidity: '92%',
        powerState: 'Coolroom Master #2',
        certificationId: 'QR-PROV-MBS-99120',
        dataHash: '0x718a...dd5e'
      }
    }
  ];

  // Auto-advance loop during simulation playback
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      const intervalMs = 2800 / playbackSpeed;
      timer = setInterval(() => {
        setActiveStage((prev) => {
          const next = prev >= 4 ? 1 : prev + 1;
          setSelectedNodeId(next);
          return next;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const activeNode = STAGES.find(s => s.id === selectedNodeId) || STAGES[0];

  const handleInjectEvent = (eventName: string, stageId: number) => {
    setInjectedEvent(eventName);
    setActiveStage(stageId);
    setSelectedNodeId(stageId);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Interactive Live Architecture Demo
              </span>
              <span className="text-xs text-slate-400">
                • Created by <strong className="text-teal-300 font-semibold">Serenade Data</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Indonesia ⇄ Singapore Cold-Chain Flow Simulation</span>
              <Sparkles className="w-5 h-5 text-teal-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Demonstrating the four synchronized milestones connecting Indonesian seafood sellers, maritime reefer carriers, Singapore SFA customs clearance, and high-end culinary buyers with 0% spoilage.
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 self-start lg:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Demo' : 'Run Flow Simulation'}</span>
            </button>

            <button
              onClick={() => {
                setActiveStage(1);
                setSelectedNodeId(1);
                setIsPlaying(false);
                setInjectedEvent(null);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
              title="Reset simulation to Stage 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1" />

            {/* Speed Toggle */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setPlaybackSpeed(1)}
                className={`px-2 py-1 rounded font-mono text-[11px] font-bold ${
                  playbackSpeed === 1 ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setPlaybackSpeed(2)}
                className={`px-2 py-1 rounded font-mono text-[11px] font-bold ${
                  playbackSpeed === 2 ? 'bg-slate-700 text-teal-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                2x Fast
              </button>
            </div>
          </div>
        </div>

        {/* Live Stage Progress Indicator */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Active Simulation Progress:</span>
            <span className="font-mono text-teal-400 font-bold">Stage {activeStage} of 4</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">{STAGES[activeStage - 1].tagline}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                onClick={() => {
                  setActiveStage(step);
                  setSelectedNodeId(step);
                  setIsPlaying(false);
                }}
                className={`w-7 h-7 rounded-full text-xs font-bold font-mono transition-all flex items-center justify-center ${
                  activeStage === step
                    ? 'bg-teal-400 text-slate-950 ring-4 ring-teal-400/20'
                    : step < activeStage
                    ? 'bg-slate-700 text-teal-300'
                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Interactive Supply Chain Stage Graph
            </h3>
            <p className="text-xs text-slate-500">
              Click any stage node below to inspect live telemetry packets, regulatory controls, and sensor payloads.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Click node to inspect
          </span>
        </div>

        {/* The 4-Node Pipeline Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = activeStage === stage.id;
            const isSelected = selectedNodeId === stage.id;

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedNodeId(stage.id)}
                className={`relative rounded-xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/40 shadow-lg ring-2 ring-teal-500/20'
                    : isCurrent
                    ? 'border-slate-400 bg-slate-50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Active Pulse Animation Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-teal-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1 animate-pulse">
                    <Activity className="w-3 h-3" />
                    <span>Live Stage</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCurrent
                        ? 'bg-teal-600 text-white'
                        : isSelected
                        ? 'bg-slate-900 text-teal-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="font-mono text-xs font-bold text-slate-400">
                      0{stage.id}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {stage.name}
                  </h4>
                  <p className="text-xs font-medium text-teal-700 mt-0.5">
                    {stage.tagline}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {stage.actor} • <span className="font-semibold text-slate-700">{stage.location}</span>
                  </p>
                </div>

                {/* Micro Metric Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Telemetry:</span>
                    <span className="font-mono font-bold text-slate-800">{stage.tempReading}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Dwell / Transit:</span>
                    <span className="font-mono text-slate-600">{stage.dwellTime}</span>
                  </div>
                </div>

                {/* Right Connector Arrow for Desktop */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400 shadow-xs">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Scenario Injections for Live Demo */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Presenter Event Injectors</span>
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Trigger real-time edge situations to demonstrate platform fault-tolerance and regulatory compliance during meetings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleInjectEvent('SFA Fast-Track Clearance: TradeNet Pre-Approved in 28 mins', 3)}
              className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Inject: SFA Green Lane Fast Clearance</span>
              </div>
              <p className="text-[11px] text-emerald-700/80 mt-1">
                Zero-delay automated release at Jurong Pier 2. QIM Freshness score 99.4%.
              </p>
            </button>

            <button
              onClick={() => handleInjectEvent('Selat Singapore Thermal Drift: Auto-Subcooling Triggered', 2)}
              className="p-3 text-left rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
                <Snowflake className="w-4 h-4 text-sky-600" />
                <span>Inject: Thermal Drift Compensation</span>
              </div>
              <p className="text-[11px] text-sky-700/80 mt-1">
                Reefer switches to auxiliary compressor, stabilizing temperature back to 3.0°C.
              </p>
            </button>

            <button
              onClick={() => handleInjectEvent('Batam-to-Jurong High-Speed Express: 2h 15m Sea Transit', 1)}
              className="p-3 text-left rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Anchor className="w-4 h-4 text-amber-600" />
                <span>Inject: Ultra-Fresh Batam Grouper</span>
              </div>
              <p className="text-[11px] text-amber-700/80 mt-1">
                Harvested 2pm, cleared in Singapore 6:30pm same day for dinner service.
              </p>
            </button>
          </div>

          {injectedEvent && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-900 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>Active Demo Event:</strong> {injectedEvent}</span>
              </div>
              <button
                onClick={() => setInjectedEvent(null)}
                className="text-amber-700 hover:text-amber-950 font-semibold underline text-[11px] cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Node Inspection Drawer */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-mono font-bold uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Inspection Node Telemetry & Compliance Inspector</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{activeNode.name}</span>
              <span className="text-xs font-normal text-slate-400">({activeNode.location})</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {activeNode.keyAction}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
              Protocol: {activeNode.protocol}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics & JSON Raw Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Standard Operating Thresholds
            </h4>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Cargo Temp:</span>
                <span className="font-mono font-bold text-teal-300">{activeNode.targetTemp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Reading:</span>
                <span className="font-mono font-bold text-white">{activeNode.tempReading}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Expected Max Dwell:</span>
                <span className="font-mono text-slate-300">{activeNode.dwellTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Responsible Party:</span>
                <span className="font-semibold text-slate-200">{activeNode.actor}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/50 text-xs text-teal-200/90 leading-relaxed">
              <strong>Quality Guarantee:</strong> Automated cold-chain continuity records ensure full compliance with ISO 22000, HACCP seafood safety, and Singapore SFA import standards.
            </div>
          </div>

          {/* Raw JSON Stream Panel */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Live IoT Telemetry Packet Payload
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Socket Sync
              </span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300/90 overflow-x-auto leading-relaxed shadow-inner">
{JSON.stringify(
  {
    packet_id: `PKT-2026-SG${activeNode.id}092`,
    timestamp: new Date().toISOString(),
    stage_index: activeNode.id,
    stage_name: activeNode.name,
    node_location: activeNode.location,
    telemetry: activeNode.telemetryPayload,
    security: {
      algorithm: 'ECDSA-SHA256',
      signed_by: 'Serenade Data Cold-Chain Anchor',
      tamper_proof: true
    }
  },
  null,
  2
)}
            </pre>
          </div>
        </div>

        {/* Footer Attribution Tag */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>SereSeaShip Guard Enterprise Platform Architecture</span>
          </div>
          <span className="font-mono text-teal-400">
            Created by Serenade Data
          </span>
        </div>
      </div>
    </div>
  );
};

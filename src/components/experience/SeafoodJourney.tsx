import React, { useState } from 'react';
import { Anchor, Snowflake, Truck, Building2, UtensilsCrossed, CheckCircle2, ChevronRight, Play, Pause, MapPin, Compass } from 'lucide-react';
import heroImage from '../../assets/images/seafood_logistics_hero_1792035022885.jpg';

interface JourneyStage {
  step: number;
  title: string;
  icon: any;
  location: string;
  tempRange: string;
  duration: string;
  summary: string;
  wastePreventionMeasure: string;
  telemetryMetrics: { label: string; value: string }[];
}

const STAGES: JourneyStage[] = [
  {
    step: 1,
    title: 'Catch & Slurry Pre-Chilling in Indonesian Waters',
    icon: Anchor,
    location: 'Kepulauan Riau & Laut Natuna, Indonesia (FAO 71)',
    tempRange: '-0.5°C to +0.5°C',
    duration: '0-2 Hours Post-Harvest',
    summary: 'Live Cantang Grouper, Mud Crabs, and Sashimi-grade Yellowfin Tuna landed by certified Indonesian coastal fishers. Flash pre-chilled using food-grade RSW (Refrigerated Sea Water) slurry ice, reducing core flesh temperature to 0°C within 30 minutes.',
    wastePreventionMeasure: 'Immediate cryogenic slurry immersion arrests enzymatic autolysis and preserves adenosine triphosphate (ATP) cellular energy, preventing rigor muscle gaping and ensuring 100% sashimi-grade firm texture.',
    telemetryMetrics: [
      { label: 'RSW Slurry Temp', value: '-0.4°C' },
      { label: 'Indonesian FAO Zone', value: 'WPP-NRI 711' },
      { label: 'QIM Primacy Baseline', value: '0.0 (Ultra-Fresh)' }
    ]
  },
  {
    step: 2,
    title: 'Port Cold Processing & BKIPM e-Cert Registration',
    icon: Snowflake,
    location: 'Batam Batu Ampar & Jakarta Muara Baru Cold Hub, Indonesia',
    tempRange: '-20.0°C (Frozen) / +3.0°C (Live Aerated)',
    duration: '4-6 Hours Processing',
    summary: 'Sanitary grading under strict Indonesian BKIPM (Badan Karantina Ikan) standards. Cleanroom filleting, vacuum skin packaging, and issuance of electronic sanitary health certificates cross-signed with Singapore Food Agency (SFA) import requirements.',
    wastePreventionMeasure: 'Optical AI grading scans flesh for micro-hematomas and parasites prior to box sealing. Digital batch hash registered on SereSeaShip Guard cryptographic ledger to eliminate customs paper delays.',
    telemetryMetrics: [
      { label: 'Ambient Cleanroom', value: '2.1°C' },
      { label: 'BKIPM e-Cert ID', value: 'ID-BKIPM-SG-928' },
      { label: 'Microbial Load', value: '<5 CFU/g' }
    ]
  },
  {
    step: 3,
    title: 'Cross-Strait Fast Reefer Maritime Transit',
    icon: Truck,
    location: 'Selat Singapura & Selat Karimata Maritime Shipping Lanes',
    tempRange: 'Target Setpoint ±0.2°C Continuous',
    duration: '3 to 24 Hours Transit',
    summary: 'Transport aboard high-speed refrigerated feeder vessels (e.g., KM Samudera Seafresh) equipped with dual-redundant marine scroll chillers, nitrogen atmospheric control, and satellite IoT beacons transmitting coordinates and thermal telemetry every 60 seconds.',
    wastePreventionMeasure: 'Predictive compressor health monitoring detects micro-vibrations and refrigerant leaks hours before temperature rises. Autonomous auxiliary failover activates if temperature drifts by more than 1.0°C.',
    telemetryMetrics: [
      { label: 'Container ID', value: 'SMDU-891024' },
      { label: 'Live Core Temp', value: '+3.2°C / -20.0°C' },
      { label: 'Strait Navigation', value: 'Selat Singapura TSS' }
    ]
  },
  {
    step: 4,
    title: 'Singapore SFA Port Gateway & Cryogenic Clearance',
    icon: Building2,
    location: 'Jurong Fishery Port & Pasir Panjang Terminal, Singapore',
    tempRange: '0.0°C Chilled Receiving Buffer',
    duration: '45 Minutes Rapid Release',
    summary: 'Direct arrival at Singapore Food Agency (SFA) cold-dock inspection gateway. Automatic electronic TradeNet import permit verification without manual paper bottleneck. Rapid cryogenic offloading directly into temperature-buffered transfer bays.',
    wastePreventionMeasure: 'Automated digital pre-clearance reduces port apron dwell time from 16 hours to under 45 minutes, saving over 3 full days of retail freshness and eliminating tarmac spoilage.',
    telemetryMetrics: [
      { label: 'SFA TradeNet Status', value: 'Green Lane Approved' },
      { label: 'Apron Dwell Time', value: '38 Minutes' },
      { label: 'TVB-N Freshness', value: '10.2 mg N/100g' }
    ]
  },
  {
    step: 5,
    title: 'Singapore Premier Dining & 0% Waste Distribution',
    icon: UtensilsCrossed,
    location: 'Marina Bay Sands, Clarke Quay, & Jurong Wholesale Hub, Singapore',
    tempRange: '0.0°C Flake Ice / +3.0°C Aerated Display',
    duration: '7 to 14 Days Shelf Life Guarantee',
    summary: 'Delivered in immaculate condition to Singapore top seafood restaurants, hotels, and retail supermarts. Diners can scan QR code on the menu or packaging to inspect the full Indonesian catch origin, vessel journey, temperature log, and zero-waste verification.',
    wastePreventionMeasure: 'Zero wholesale markdowns and zero restaurant kitchen spoilage. Unbroken cold chain guarantees 100% salable yield with pristine culinary taste profile.',
    telemetryMetrics: [
      { label: 'Final QIM Score', value: '1.2 (Pristine)' },
      { label: 'Averted Food Waste', value: '100% Commercial Yield' },
      { label: 'Traceability Hash', value: 'Verified Ocean-to-Plate' }
    ]
  }
];

export const SeafoodJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const currentStage = STAGES[activeStep];

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % STAGES.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + STAGES.length) % STAGES.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            Indonesia ⇄ Singapore Bilateral Seafood Corridor
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            The Zero-Waste Seafood Journey
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Trace fresh seafood from Indonesian fishing ports (Batam, Jakarta, Medan, Bali) across the Malacca & Singapore Straits into Singapore commercial kitchens with zero food waste.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? 'Pause Story' : 'Auto Play'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Step Timeline */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={stage.step}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 flex flex-col items-center text-center p-2.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-teal-50 border border-teal-300 shadow-xs ring-1 ring-teal-500/20'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                  isSelected ? 'bg-teal-600 text-white shadow-sm' :
                  isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-bold block">
                  STAGE 0{stage.step}
                </span>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px] mt-0.5">
                  {stage.title.split(' ')[0]} {stage.title.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feature Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Visual Media Backdrop */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 min-h-[380px] bg-slate-900 flex flex-col justify-between p-6 text-white shadow-md">
          <img
            src={heroImage}
            alt="Cold-chain vessel"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

          {/* Top Stage Indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-mono font-semibold">
              Indonesia ⇄ Singapore · Stage 0{currentStage.step} of 05
            </span>
            <span className="text-xs text-teal-300 font-mono font-bold bg-slate-900/60 px-2 py-0.5 rounded">
              {currentStage.tempRange}
            </span>
          </div>

          {/* Bottom Headline */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-teal-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="uppercase">{currentStage.location}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentStage.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              {currentStage.summary}
            </p>
          </div>
        </div>

        {/* Right: Telemetry & Waste Prevention Analytics */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stage 0{currentStage.step} Bilateral Telemetry & Standards
              </span>
              <span className="text-xs font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                Transit: {currentStage.duration}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              {currentStage.telemetryMetrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block truncate">{m.label}</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 block mt-0.5 truncate">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Waste Prevention Impact Callout */}
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-1.5">
              <span className="font-bold text-emerald-900 uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SereSeaShip Guard Waste Prevention Impact</span>
              </span>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                {currentStage.wastePreventionMeasure}
              </p>
            </div>

            <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200/80 text-[11px] text-sky-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                Verified under Indonesia BKIPM sanitary protocol & Singapore Food Agency (SFA) import guidelines.
              </span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Previous Stage
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Next: Stage {((activeStep + 1) % STAGES.length) + 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

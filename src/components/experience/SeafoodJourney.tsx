import React, { useState } from 'react';
import { Anchor, Snowflake, Truck, Building2, UtensilsCrossed, CheckCircle2, ChevronRight, Play, Pause } from 'lucide-react';
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
    title: 'Vessel Catch & Slurry Pre-Chilling',
    icon: Anchor,
    location: 'Norwegian Sea (FAO 27.2a)',
    tempRange: '-0.5°C to 0.5°C',
    duration: '0-2 Hours Post-Harvest',
    summary: 'Atlantic salmon harvested humanely via certified RSW (Refrigerated Sea Water) systems. Core body temperature reduced rapidly from 9°C to 0°C within 45 minutes.',
    wastePreventionMeasure: 'Immediate enzymatic arrest prevents rigor-induced muscle gaping, retaining 100% sashimi-grade tensile integrity.',
    telemetryMetrics: [
      { label: 'RSW Temp', value: '-0.8°C' },
      { label: 'Harvest Log', value: 'FAO Verified' },
      { label: 'QIM Baseline', value: '0.0 (Primacy)' }
    ]
  },
  {
    step: 2,
    title: 'Harbor Automated Cold Processing',
    icon: Snowflake,
    location: 'Bergen Processing Terminal',
    tempRange: '0.0°C to 1.5°C',
    duration: '6 Hours',
    summary: 'Robotic filleting, pin-bone extraction, and vacuum skin packaging in chilled sterile cleanrooms. Digital catch certificates cryptographically minted.',
    wastePreventionMeasure: 'Optical AI grading detects flesh micro-bruises early, sorting sub-prime cuts for curing rather than discard.',
    telemetryMetrics: [
      { label: 'Ambient Room', value: '2.1°C' },
      { label: 'Microbial Count', value: '<10 CFU/g' },
      { label: 'QR Batch Hash', value: '8f92...b4' }
    ]
  },
  {
    step: 3,
    title: 'Maritime Reefer Intermodal Crossing',
    icon: Truck,
    location: 'North Sea Maritime Corridor',
    tempRange: '0.0°C ±0.3°C',
    duration: '36 Hours',
    summary: 'Transport inside 40ft High-Cube smart reefer container with dual redundant compressor circuits and satellite IoT sensors.',
    wastePreventionMeasure: 'Continuous IoT telemetry monitors temperature drift every 60 seconds; auxiliary chiller automatically kicks in if delta exceeds 1.5°C.',
    telemetryMetrics: [
      { label: 'Container ID', value: 'MRKU-781923' },
      { label: 'Internal Temp', value: '+0.8°C' },
      { label: 'Door Integrity', value: 'Sealed (0 breaches)' }
    ]
  },
  {
    step: 4,
    title: 'Port Gateway Customs & Cold Hub',
    icon: Building2,
    location: 'Rotterdam Gateway Cold Terminal',
    tempRange: '0.5°C Chilled Buffer',
    duration: '4-8 Hours',
    summary: 'Electronic green-lane customs clearance with digital veterinary certificates. Zero dwell time on sunlit asphalt.',
    wastePreventionMeasure: 'AI pre-clearance reduces port dwell time from 48h to under 4h, saving 4 valuable days of prime retail shelf-life.',
    telemetryMetrics: [
      { label: 'Customs Gate', value: 'Clear Lane 3' },
      { label: 'Dock Dwell Time', value: '2.8 Hours' },
      { label: 'TVB-N Level', value: '11.8 mg N/100g' }
    ]
  },
  {
    step: 5,
    title: 'Commercial Kitchen & Retail Display',
    icon: UtensilsCrossed,
    location: 'Michelin Restaurant & Gourmet Grocer',
    tempRange: '0.0°C on Crushed Flake Ice',
    duration: '14 Days Remaining Shelf-Life',
    summary: 'Delivered in pristine condition with 14 full days of guaranteed culinary shelf-life. Customer scans QR code to verify ocean-to-plate provenance.',
    wastePreventionMeasure: 'Long shelf-life buffer allows zero retail shrinkage and zero restaurant discard at end-of-week service.',
    telemetryMetrics: [
      { label: 'Final QIM Score', value: '2.0 (Superb)' },
      { label: 'Waste Avoided', value: '14,200 kg (100%)' },
      { label: 'Customer Trust', value: '5.0 / 5.0' }
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
            Cold-Chain Traceability Story
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            The Zero-Waste Seafood Journey
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Follow a 14-ton Norwegian Atlantic Salmon catch from Arctic waters to European commercial kitchens.
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
        <div className="flex items-center justify-between min-w-[600px] gap-2">
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
                    ? 'bg-teal-50 border border-teal-300 shadow-xs'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                  isSelected ? 'bg-teal-600 text-white' :
                  isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-bold block">
                  STAGE 0{stage.step}
                </span>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[110px] mt-0.5">
                  {stage.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feature Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Visual Media Backdrop */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 min-h-[360px] bg-slate-900 flex flex-col justify-between p-6 text-white shadow-md">
          <img
            src={heroImage}
            alt="Cold-chain vessel"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Stage Indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-mono font-semibold">
              Stage 0{currentStage.step} of 05
            </span>
            <span className="text-xs text-teal-300 font-mono font-bold">
              {currentStage.tempRange}
            </span>
          </div>

          {/* Bottom Headline */}
          <div className="relative z-10 space-y-2">
            <span className="text-xs font-mono text-teal-300 block uppercase">
              {currentStage.location}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentStage.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              {currentStage.summary}
            </p>
          </div>
        </div>

        {/* Right: Telemetry & Waste Prevention Analytics */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Stage 0{currentStage.step} Environmental Telemetry
              </span>
              <span className="text-xs font-mono text-slate-400">
                Duration: {currentStage.duration}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              {currentStage.telemetryMetrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block truncate">{m.label}</span>
                  <span className="font-mono font-bold text-sm text-slate-900 block mt-0.5">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Waste Prevention Impact Callout */}
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-1.5">
              <span className="font-bold text-emerald-900 uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>SereSeaShip Guard Waste Prevention Impact</span>
              </span>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                {currentStage.wastePreventionMeasure}
              </p>
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

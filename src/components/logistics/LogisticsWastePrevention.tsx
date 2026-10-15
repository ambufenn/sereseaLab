import React, { useState } from 'react';
import { Leaf, DollarSign, TrendingUp, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const LogisticsWastePrevention: React.FC = () => {
  const [divertNotice, setDivertNotice] = useState<string | null>(null);

  const handleDivert = (consignment: string, channel: string) => {
    setDivertNotice(`Consignment ${consignment} successfully scheduled for salvage through ${channel}. Zero landfill waste achieved.`);
    setTimeout(() => setDivertNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Food Waste Prevention & Salvage Recovery
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Automated diversion protocols preventing loss of commercial seafood through dynamic rerouting and secondary processing.
        </p>
      </div>

      {divertNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{divertNotice}</span>
        </div>
      )}

      {/* 4 Waste Prevention Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Seafood Waste Prevented"
          value="42.6 MT"
          subValue="Metric tons saved YTD"
          trend={{ direction: 'up', text: '+28% vs previous year' }}
          icon={Leaf}
          accentColor="emerald"
        />
        <StatCard
          label="Direct Economic Value Saved"
          value="$482,400"
          subValue="Consignment loss averted"
          trend={{ direction: 'up', text: 'Avg $11.32/kg recovered' }}
          icon={DollarSign}
          accentColor="teal"
        />
        <StatCard
          label="Avoided CO2e Emissions"
          value="184.2 MT"
          subValue="Equivalent to 40 vehicles/yr"
          trend={{ direction: 'up', text: 'Certified carbon offset' }}
          icon={TrendingUp}
          accentColor="sky"
        />
        <StatCard
          label="Salvage Route Success Rate"
          value="98.2%"
          subValue="18 of 19 salvages completed"
          trend={{ direction: 'neutral', text: 'Optimal recovery' }}
          icon={ShieldCheck}
          accentColor="emerald"
        />
      </div>

      {/* Dynamic Salvage Protocols */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Active Salvage Channels & Secondary Market Matching
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant matchmaking for seafood consignments with minor shelf-life compression
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            3 Ready Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                Channel 1: Rapid Blast Freezer
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">
                Cryogenic Flash-Freeze Hub
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Immediately arrests enzymatic breakdown at -40°C. Converts chilled fillets into stable IQF (Individually Quick Frozen) inventory for retail distribution.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-700">92% Value Retained</span>
              <button
                onClick={() => handleDivert('CMAU-452109-1 (Tuna)', 'Cryogenic Flash-Freeze Hub')}
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Divert
              </button>
            </div>
          </div>

          {/* Option 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
                Channel 2: Secondary Culinary Market
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">
                Regional Commercial Smokeries
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ideal for prime salmon and tuna with reduced raw-sushi shelf-life. Cured and hot/cold smoked within 24 hours of landing.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-700">85% Value Retained</span>
              <button
                onClick={() => handleDivert('SHP-9021 (Salmon)', 'Regional Commercial Smokeries')}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Divert
              </button>
            </div>
          </div>

          {/* Option 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Channel 3: Ready-Meal Processing
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">
                Canning & Value-Add Kitchens
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Repurposes whole round and loins into soups, chowders, and canned pantry goods. Completely avoids spoilage dumping.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-700">74% Value Retained</span>
              <button
                onClick={() => handleDivert('SHP-9104 (Prawns)', 'Canning & Value-Add Kitchens')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Divert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

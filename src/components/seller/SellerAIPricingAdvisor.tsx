import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Sparkles,
  Calculator,
  Ship,
  Scale,
  Award,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { CatchBatch } from '../../types';

interface SellerAIPricingAdvisorProps {
  batches: CatchBatch[];
}

export const SellerAIPricingAdvisor: React.FC<SellerAIPricingAdvisorProps> = ({ batches }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<'Yellowfin Tuna' | 'Red Snapper' | 'Tiger Prawn' | 'Mud Crab'>('Yellowfin Tuna');
  const [volumeKg, setVolumeKg] = useState<number>(1200);
  const [targetQualityGrade, setTargetQualityGrade] = useState<'A+' | 'A' | 'B'>('A+');
  const [transitSpeed, setTransitSpeed] = useState<'express_barge' | 'standard_cargo'>('express_barge');

  // Pricing benchmarks
  const benchmarks = {
    'Yellowfin Tuna': { idHarvestCost: 14.5, sgWholesaleAvg: 22.5, sgPremiumAuction: 26.8, unit: 'USD/kg' },
    'Red Snapper': { idHarvestCost: 9.8, sgWholesaleAvg: 16.2, sgPremiumAuction: 19.5, unit: 'USD/kg' },
    'Tiger Prawn': { idHarvestCost: 12.0, sgWholesaleAvg: 21.0, sgPremiumAuction: 24.5, unit: 'USD/kg' },
    'Mud Crab': { idHarvestCost: 18.0, sgWholesaleAvg: 31.0, sgPremiumAuction: 36.0, unit: 'USD/kg' }
  }[selectedSpecies];

  // Logistics calculations
  const freightCostPerKg = transitSpeed === 'express_barge' ? 1.4 : 0.85; // USD/kg Batam to Jurong Port
  const certificationHandlingCost = 150; // USD fixed per consignment
  const qualityMultiplier = targetQualityGrade === 'A+' ? 1.15 : targetQualityGrade === 'A' ? 1.05 : 0.95;
  const estimatedSgSalePrice = benchmarks.sgWholesaleAvg * qualityMultiplier;

  const totalGrossRevenue = volumeKg * estimatedSgSalePrice;
  const totalHarvestCost = volumeKg * benchmarks.idHarvestCost;
  const totalFreightCost = (volumeKg * freightCostPerKg) + certificationHandlingCost;
  const totalEstimatedProfit = totalGrossRevenue - totalHarvestCost - totalFreightCost;
  const marginPercentage = (totalEstimatedProfit / totalGrossRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cross-Strait Market Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Serenade Data AI Pricing & Export Margin Optimizer
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time arbitrage forecasting between Indonesian landing ports (Batam/Natuna) and Singapore wholesale markets (Jurong & Senoko).
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Live SFA & Jurong Port Price Stream</span>
        </div>
      </div>

      {/* Main Grid: Calculator & AI Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input parameters */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">Export Parameter Simulator</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Seafood Species
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Yellowfin Tuna', 'Red Snapper', 'Tiger Prawn', 'Mud Crab'] as const).map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecies(spec)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                    selectedSpecies === spec
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Planned Export Volume</span>
              <span className="font-mono text-sky-600 font-black">{volumeKg.toLocaleString()} kg</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={volumeKg}
              onChange={e => setVolumeKg(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>200 kg (LCL)</span>
              <span>2,500 kg (Half 20ft)</span>
              <span>5,000 kg (Full 20ft Reefer)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Quality & Freshness Tier (QIM / Traceability)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['A+', 'A', 'B'] as const).map(grd => (
                <button
                  key={grd}
                  onClick={() => setTargetQualityGrade(grd)}
                  className={`py-2 text-center text-xs font-bold rounded-xl border transition-all ${
                    targetQualityGrade === grd
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Grade {grd}
                  <span className="block text-[9px] font-normal opacity-85">
                    {grd === 'A+' ? '+15% Premium' : grd === 'A' ? '+5% Normal' : '-5% Discount'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Maritime Corridor Routing
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setTransitSpeed('express_barge')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs ${
                  transitSpeed === 'express_barge'
                    ? 'border-sky-500 bg-sky-50/60 font-semibold text-sky-950'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-sky-600" />
                  <div>
                    <div>Fast Barge (Batam ➔ Jurong Port)</div>
                    <div className="text-[10px] text-slate-500 font-normal">2.5 hrs transit • Sub-zero reefer</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-sky-700">$1.40/kg</span>
              </label>

              <label
                onClick={() => setTransitSpeed('standard_cargo')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs ${
                  transitSpeed === 'standard_cargo'
                    ? 'border-sky-500 bg-sky-50/60 font-semibold text-sky-950'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-slate-500" />
                  <div>
                    <div>Standard Feeder Barge</div>
                    <div className="text-[10px] text-slate-500 font-normal">5.0 hrs transit • Scheduled weekly</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-600">$0.85/kg</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Projections & Serenade Data Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue & Margin Card */}
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
              <div>
                <span className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                  Projected Financial Net
                </span>
                <h3 className="text-2xl font-black mt-1">
                  ${Math.round(totalEstimatedProfit).toLocaleString()}{' '}
                  <span className="text-sm font-normal text-slate-300">Net Profit</span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  +{marginPercentage.toFixed(1)}% Net Margin
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
                  ${estimatedSgSalePrice.toFixed(2)}/kg SG Target
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Gross Revenue (SG Sale)</span>
                <span className="text-base font-bold text-white mt-1 block">
                  ${Math.round(totalGrossRevenue).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">At {volumeKg} kg consignment</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Harvest Cost (Indonesia)</span>
                <span className="text-base font-bold text-amber-300 mt-1 block">
                  ${Math.round(totalHarvestCost).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">${benchmarks.idHarvestCost}/kg base landed</span>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cold Freight & Port Dues</span>
                <span className="text-base font-bold text-sky-300 mt-1 block">
                  ${Math.round(totalFreightCost).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Incl. BKIPM & SFA fees</span>
              </div>
            </div>
          </div>

          {/* Serenade Data AI Market Insights */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Serenade Data Autonomous Recommendation
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Calculated by Serenade Data Market Predictive Engine v4.2
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                Optimal Window: Friday Early Morning
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Timing Recommendation:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Singapore fine-dining and Japanese restaurants place weekend procurement bids on Friday between 03:00 - 06:00 SGT. Dispatching on the Thursday 22:00 Batam fast-barge yields an average <strong>+12% spot price premium</strong> over weekday deliveries.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">ATIGA Tariff Exemption Active:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Under the ASEAN Trade in Goods Agreement (ATIGA Form D), your {selectedSpecies} qualifies for <strong>0% import tariff</strong> entering Singapore via Jurong Fishery Port, saving approximately $1,150 USD in customs duties compared to non-ASEAN shipments.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Traceability Certification Advantage:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                    Providing unbroken IoT cold-chain telemetry with Serenade Data cryptoseal unlocks Singapore Michelin-star and premium supermarket tiering, preventing wholesale liquidation discounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

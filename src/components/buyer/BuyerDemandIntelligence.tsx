import React, { useState } from 'react';
import { DEMAND_FORECASTS } from '../../data/mockData';
import { DemandForecastItem } from '../../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck, Sparkles, Filter, Check } from 'lucide-react';

interface BuyerDemandIntelligenceProps {
  onInitiateOrder?: (species: string) => void;
}

export const BuyerDemandIntelligence: React.FC<BuyerDemandIntelligenceProps> = ({ onInitiateOrder }) => {
  const [filter, setFilter] = useState<'all' | 'increase' | 'maintain' | 'defer'>('all');
  const [selectedForecast, setSelectedForecast] = useState<DemandForecastItem>(DEMAND_FORECASTS[0]);
  const [orderSuccessSpecies, setOrderSuccessSpecies] = useState<string | null>(null);

  const filteredItems = DEMAND_FORECASTS.filter(item => {
    if (filter === 'increase') return item.recommendedStockAction === 'increase_order';
    if (filter === 'maintain') return item.recommendedStockAction === 'maintain';
    if (filter === 'defer') return item.recommendedStockAction === 'defer_purchase';
    return true;
  });

  const handleOrder = (species: string) => {
    setOrderSuccessSpecies(species);
    setTimeout(() => setOrderSuccessSpecies(null), 3000);
    if (onInitiateOrder) onInitiateOrder(species);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Seafood Demand Intelligence & Forecasting
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Predictive species demand, market price trends, and AI procurement recommendations for Q4 2026.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Species
          </button>
          <button
            onClick={() => setFilter('increase')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'increase' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Increase Order
          </button>
          <button
            onClick={() => setFilter('maintain')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'maintain' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maintain
          </button>
          <button
            onClick={() => setFilter('defer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'defer' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Defer Purchase
          </button>
        </div>
      </div>

      {orderSuccessSpecies && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-teal-600" />
            Purchase draft created for {orderSuccessSpecies}! Route forwarded to Supplier Matching.
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Species Forecast Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filteredItems.map((item) => {
            const isSelected = selectedForecast.id === item.id;
            const isIncrease = item.trendPct > 0;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedForecast(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {item.species}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="font-mono text-xs text-slate-500">
                        ${item.avgMarketPricePerKg.toFixed(2)}/kg
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                      {item.reasoning}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`flex items-center justify-end gap-1 font-mono font-bold text-sm ${
                      isIncrease ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isIncrease ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      <span>{item.trendPct > 0 ? `+${item.trendPct}%` : `${item.trendPct}%`}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Forecast Confidence: {item.confidenceScore}%
                    </span>
                  </div>
                </div>

                {/* Progress bar comparison */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span>Current: <strong className="text-slate-800 font-mono">{item.currentDemandKg.toLocaleString()} kg</strong></span>
                    <span>Projected: <strong className="text-teal-700 font-mono">{item.projectedDemandKg.toLocaleString()} kg</strong></span>
                  </div>
                  <span className={`font-semibold capitalize text-[11px] ${
                    item.recommendedStockAction === 'increase_order' ? 'text-teal-700' :
                    item.recommendedStockAction === 'defer_purchase' ? 'text-amber-700' : 'text-sky-700'
                  }`}>
                    {item.recommendedStockAction.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Forecast Deep Dive & Action */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                AI Demand Deep-Dive
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedForecast.species}
              </h3>
            </div>
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Baseline Demand</span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {selectedForecast.currentDemandKg.toLocaleString()} kg
              </span>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
              <span className="text-[11px] text-teal-700 block">Target Q4 Allocation</span>
              <span className="text-base font-bold text-teal-900 font-mono">
                {selectedForecast.projectedDemandKg.toLocaleString()} kg
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Market Factor Breakdown
            </h4>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p>• <strong>Demand Velocity:</strong> {selectedForecast.trendPct > 0 ? 'Accelerating due to institutional wholesale buyers' : 'Moderate deceleration in cold storage reserves'}.</p>
              <p>• <strong>Pricing Sensitivity:</strong> High elasticity around ${selectedForecast.avgMarketPricePerKg.toFixed(2)}/kg benchmark.</p>
              <p>• <strong>Supply Risk:</strong> Maritime logistics port dwell times currently average 18h at key hub terminals.</p>
            </div>
          </div>

          <div className="p-4 bg-teal-900 text-white rounded-xl space-y-2">
            <span className="text-[11px] text-teal-300 font-semibold block uppercase">
              Recommended Procurement Strategy
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedForecast.reasoning}
            </p>
            <button
              onClick={() => handleOrder(selectedForecast.species)}
              className="w-full mt-2 py-2.5 px-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Initiate Order for {selectedForecast.species}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

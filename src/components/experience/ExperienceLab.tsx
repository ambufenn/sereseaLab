import React, { useState } from 'react';
import { ReeferTetris } from './ReeferTetris';
import { SeafoodJourney } from './SeafoodJourney';
import { ColdChainSimulator } from './ColdChainSimulator';
import { SupplyChainDiagramDemo } from './SupplyChainDiagramDemo';
import { Gamepad2, Compass, AlertTriangle, Workflow } from 'lucide-react';

export const ExperienceLab: React.FC<{ initialTab?: 'tetris' | 'journey' | 'simulator' | 'diagram' }> = ({ initialTab = 'diagram' }) => {
  const [activeTab, setActiveTab] = useState<'tetris' | 'journey' | 'simulator' | 'diagram'>(initialTab);

  return (
    <div className="space-y-6">
      {/* Experience Lab Header with Sub-Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interactive Demonstrations & Simulations
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            SereSeaShip Guard Experience Lab
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hands-on interactive tools demonstrating reefer container packing, ocean-to-plate traceability, interactive flow diagram, and emergency failovers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'diagram' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-teal-600" />
            <span>Flow Simulation Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'journey' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Seafood Journey</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-sky-600" />
            <span>Cold-Chain Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('tetris')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'tetris' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reefer Tetris</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'diagram' && <SupplyChainDiagramDemo />}
        {activeTab === 'journey' && <SeafoodJourney />}
        {activeTab === 'simulator' && <ColdChainSimulator />}
        {activeTab === 'tetris' && <ReeferTetris />}
      </div>
    </div>
  );
};

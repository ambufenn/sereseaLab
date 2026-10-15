import React from 'react';
import { UserRole } from '../../types';
import { X, Sliders, Shield, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  tempUnit: 'C' | 'F';
  onTempUnitChange: (unit: 'C' | 'F') => void;
  onResetDemoData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  tempUnit,
  onTempUnitChange,
  onResetDemoData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">SereSeaShip Guard Platform Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Persona */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Active Persona Workspace
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onRoleChange('buyer')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  currentRole === 'buyer'
                    ? 'border-teal-600 bg-teal-50/50 text-teal-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Seafood Buyer
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('logistics')}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  currentRole === 'logistics'
                    ? 'border-sky-600 bg-sky-50/50 text-sky-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Logistics & Fleet
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              Switching workspaces dynamically updates navigation, operational views, and telemetry controls.
            </p>
          </div>

          {/* Temperature Units */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Temperature Standard
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onTempUnitChange('C')}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  tempUnit === 'C'
                    ? 'border-slate-800 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Celsius (°C) — Maritime Standard
              </button>
              <button
                type="button"
                onClick={() => onTempUnitChange('F')}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  tempUnit === 'F'
                    ? 'border-slate-800 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* AI Engine Status */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600" />
                AI Inference Engine
              </span>
              <span className="text-emerald-700 font-mono">Gemini 2.5 Flash Connected</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Domain intelligence models evaluate QIM decay equations, container sensor telemetry, and FAO catch certification veracity.
            </p>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-700">Reset Demo State</span>
              <span className="text-[11px] text-slate-400">Restore default shipments and orders</span>
            </div>
            <button
              onClick={() => {
                onResetDemoData();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

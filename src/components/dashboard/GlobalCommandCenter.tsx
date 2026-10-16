import React, { useState, useEffect } from 'react';
import { Shipment } from '../../types';
import {
  Activity,
  Compass,
  Snowflake,
  ShieldAlert,
  Radio,
  Maximize2,
  MapPin,
  Anchor,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import isometricImg from '../../assets/images/isometric_fleet_command_1792074563330.jpg';

interface GlobalCommandCenterProps {
  shipments: Shipment[];
  role: 'buyer' | 'logistics';
  onSelectShipment?: (shipment: Shipment) => void;
  compact?: boolean;
}

export const GlobalCommandCenter: React.FC<GlobalCommandCenterProps> = ({
  shipments,
  role,
  onSelectShipment,
}) => {
  const [selectedCorridorIdx, setSelectedCorridorIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'map' | 'telemetry' | 'fleet3d'>('telemetry');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-SG', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        now.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
        ' SGT / WIB'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Indonesia to Singapore specific maritime corridors
  const maritimeCorridors = [
    {
      id: 'COR-01',
      code: 'BTM-SIN-01',
      title: 'Batam (Batu Ampar) → Singapore (Jurong Fishery Port)',
      vesselName: 'KM Samudera Seafresh 09',
      carrier: 'Batam Fast Reefer Lines',
      species: 'Live Cantang Grouper & Mud Crabs (Kerapu & Kepiting)',
      cargoVolume: '6,800 kg',
      cargoValueUSD: 84000,
      origin: 'Batam (Pelabuhan Batu Ampar), Indonesia',
      dest: 'Singapore (Jurong Fishery Port Pier 2)',
      distanceNm: 22,
      transitDuration: '2h 45m',
      eta: 'Today, 18:30 SGT (35 mins to dock)',
      progressPct: 84,
      speedKts: 14.8,
      heading: '315° NW (Selat Singapura)',
      coords: '1.22°N, 103.85°E',
      temp: 3.2,
      targetTemp: 3.0,
      tempStandard: '+3.0°C Aerated Seawater',
      status: 'Approaching Jurong Pier',
      riskLevel: 'normal',
      color: '#10b981', // emerald
      chartPoints: [2.8, 2.9, 3.0, 3.1, 3.1, 3.2, 3.2, 3.2, 3.2, 3.1, 3.2, 3.2]
    },
    {
      id: 'COR-02',
      code: 'JKT-SIN-02',
      title: 'Jakarta (Tanjung Priok) → Singapore (Pasir Panjang Terminal)',
      vesselName: 'KM Nusantara Reefer 18',
      carrier: 'Samudera Indonesia Cold Logistics',
      species: 'Yellowfin Tuna Sashimi AAA (Muara Baru Harvest)',
      cargoVolume: '12,500 kg',
      cargoValueUSD: 245000,
      origin: 'Jakarta (Pelabuhan Tanjung Priok), Indonesia',
      dest: 'Singapore (Pasir Panjang Reefer Terminal 4)',
      distanceNm: 520,
      transitDuration: '32 Hours',
      eta: 'Tomorrow, 06:00 SGT (Selat Karimata)',
      progressPct: 58,
      speedKts: 19.4,
      heading: '345° NNW (Laut Jawa / Selat Karimata)',
      coords: '0.85°S, 105.12°E',
      temp: -16.2,
      targetTemp: -20.0,
      tempStandard: '-20.0°C Ultra-Deep Freeze',
      status: 'Compressor Excursion Alert',
      riskLevel: 'critical',
      color: '#f43f5e', // rose
      chartPoints: [-20.0, -19.6, -19.2, -18.4, -17.8, -17.2, -16.6, -16.2, -16.2, -16.3, -16.2, -16.2]
    },
    {
      id: 'COR-03',
      code: 'MDN-SIN-03',
      title: 'Medan (Belawan Port) → Singapore (Jurong Cold Logistics Hub)',
      vesselName: 'KM Selat Malaka Express',
      carrier: 'Malacca Straits Reefer Feeder',
      species: 'Black Tiger Prawns & Red Snapper (Udang & Kakap)',
      cargoVolume: '18,400 kg',
      cargoValueUSD: 198000,
      origin: 'Medan (Pelabuhan Belawan, Sumatra), Indonesia',
      dest: 'Singapore (Jurong Cold Logistics Gate 3)',
      distanceNm: 340,
      transitDuration: '19 Hours',
      eta: 'Oct 16, 04:00 SGT (SFA Quarantine Check)',
      progressPct: 72,
      speedKts: 17.2,
      heading: '135° SE (Selat Malaka Corridor)',
      coords: '2.65°N, 101.42°E',
      temp: -21.4,
      targetTemp: -22.0,
      tempStandard: '-22.0°C Deep Chilled Frozen',
      status: 'Customs Pre-Clearance (SFA / BKIPM)',
      riskLevel: 'moderate',
      color: '#06b6d4', // cyan
      chartPoints: [-21.8, -21.7, -21.6, -21.5, -21.4, -21.4, -21.5, -21.4, -21.4, -21.4, -21.4, -21.4]
    },
    {
      id: 'COR-04',
      code: 'DPS-SIN-04',
      title: 'Bali (Benoa) via Surabaya → Singapore (Changi Coolport & Jurong)',
      vesselName: 'SQ Cargo Coolport Line',
      carrier: 'Coolport Air-Sea Express',
      species: 'Fresh Bigeye Tuna Loins & Barramundi (Benoa Harvest)',
      cargoVolume: '5,200 kg',
      cargoValueUSD: 142000,
      origin: 'Bali (Pelabuhan Benoa) via Surabaya, Indonesia',
      dest: 'Singapore (Changi Airport Coolport & Jurong)',
      distanceNm: 910,
      transitDuration: '14 Hours (Air-Sea Intermodal)',
      eta: 'Tomorrow, 14:00 SGT (Coolport Inbound)',
      progressPct: 45,
      speedKts: 22.0,
      heading: '305° NW (Intermodal Cool Flight & Fast Feeder)',
      coords: '4.82°S, 110.15°E',
      temp: 0.8,
      targetTemp: 0.0,
      tempStandard: '0.0°C Slurry Ice / Chilled',
      status: 'In Transit Normal (Coolport Sync)',
      riskLevel: 'normal',
      color: '#38bdf8', // sky blue
      chartPoints: [0.4, 0.5, 0.6, 0.7, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]
    }
  ];

  const currentCorridor = maritimeCorridors[selectedCorridorIdx];

  return (
    <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Top Command Bar */}
      <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white uppercase font-mono">
                Indonesia ⇄ Singapore Maritime Cold-Chain Command
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE CORRIDOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Batam · Jakarta · Medan ⇄ Singapore Ports · {currentTime || 'Live SGT / WIB'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry & Dials</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>ID ⇄ SG Sea Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('fleet3d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'fleet3d'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>3D Terminal Hub</span>
          </button>
        </div>
      </div>

      {/* Corridor Quick Switcher Bar */}
      <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-mono text-slate-400 uppercase text-[10px] shrink-0 font-bold">
          Active Sea Corridors:
        </span>
        {maritimeCorridors.map((corridor, idx) => {
          const isSelected = selectedCorridorIdx === idx;
          return (
            <button
              key={corridor.id}
              onClick={() => setSelectedCorridorIdx(idx)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                corridor.riskLevel === 'critical' ? 'bg-rose-500' :
                corridor.riskLevel === 'moderate' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span>{corridor.code}: {corridor.origin.split(' ')[0]} → SG</span>
            </button>
          );
        })}
      </div>

      {/* Main View Area */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* TAB 1: TELEMETRY & CIRCULAR DIALS (matching user reference) */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Graph: TEMPERATURE OVERVIEW | Last 24 Hours */}
            <div className="lg:col-span-8 bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>TEMPERATURE OVERVIEW | Indonesia ⇄ Singapore Export Corridors</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Real-time IoT data loggers tracking cold-chain integrity across Java Sea & Malacca Strait
                    </p>
                  </div>

                  {/* Route Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Batam → Jurong (+3.2°C Live)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Jakarta → Pasir Panjang (-16.2°C Alert)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span>Medan → Jurong (-21.4°C Frozen)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                      <span>Bali → Changi (+0.8°C Fresh)</span>
                    </span>
                  </div>
                </div>

                {/* SVG Graph Canvas */}
                <div className="relative h-64 w-full bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-4 grid grid-rows-4 pointer-events-none opacity-20">
                    <div className="border-b border-slate-600" />
                    <div className="border-b border-slate-600" />
                    <div className="border-b border-slate-600" />
                    <div className="border-b border-slate-600" />
                  </div>

                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                    {/* Route 1 Line (Batam to Singapore: Live Chilled Seawater at +3.2°C) */}
                    <path
                      d="M 0,70 Q 70,72 140,71 T 280,73 T 420,74 T 560,73 T 700,74"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />

                    {/* Route 2 Line (Jakarta to Singapore: Yellowfin Tuna with compressor excursion spike) */}
                    <path
                      d="M 0,165 Q 80,162 160,158 T 320,135 T 400,110 T 520,105 T 620,107 T 700,108"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      className="filter drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                    />

                    {/* Route 3 Line (Medan to Singapore: Deep Frozen Tiger Prawns at -21.4°C) */}
                    <path
                      d="M 0,175 Q 80,175 160,174 T 320,175 T 480,175 T 640,174 T 700,175"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                    />

                    {/* Route 4 Line (Bali via Surabaya to Singapore: Fresh Tuna Loins at +0.8°C) */}
                    <path
                      d="M 0,82 Q 70,80 140,79 T 280,78 T 420,77 T 560,76 T 700,75"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                    />

                    {/* Data Point on Jakarta Route Excursion */}
                    <circle cx="400" cy="110" r="5" fill="#f43f5e" className="animate-ping opacity-75" />
                    <circle cx="400" cy="110" r="4.5" fill="#f43f5e" />
                    <text x="410" y="105" fill="#fca5a5" fontSize="10" fontFamily="monospace">
                      Selat Karimata Excursion (-16.2°C)
                    </text>
                  </svg>

                  {/* Horizontal Time Ticks */}
                  <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>00:00 SGT</span>
                    <span>04:00</span>
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                    <span>Live Docking</span>
                  </div>
                </div>
              </div>

              {/* Selected Corridor Live Status HUD */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">Active Corridor Vessel</span>
                  <span className="font-mono font-bold text-teal-400 text-sm truncate block mt-0.5">
                    {currentCorridor.vesselName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{currentCorridor.species.split('(')[0]}</span>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">Route Progress & Speed</span>
                  <span className="font-mono font-bold text-white text-sm block mt-0.5">
                    {currentCorridor.progressPct}% · {currentCorridor.speedKts} knots
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{currentCorridor.distanceNm} NM corridor</span>
                </div>

                <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">Cargo Cold Value</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm block mt-0.5">
                    ${currentCorridor.cargoValueUSD.toLocaleString()} USD
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{currentCorridor.cargoVolume}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Circular Radial Gauges for Indonesia ⇄ Singapore Corridors */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
              {maritimeCorridors.map((corridor, idx) => {
                const isSelected = selectedCorridorIdx === idx;
                const isWarning = corridor.riskLevel === 'critical';

                return (
                  <div
                    key={corridor.id}
                    onClick={() => setSelectedCorridorIdx(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="max-w-[170px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-white">
                          Corridor {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[11px] text-teal-400 font-mono font-bold">{corridor.code}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-200 block truncate">
                        {corridor.species.split(' ')[0]} {corridor.species.split(' ')[1]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">
                        {corridor.origin.split('(')[0]} → SG
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded inline-block mt-1 ${
                        isWarning ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {corridor.status.split('(')[0]}
                      </span>
                    </div>

                    {/* Circular Radial Gauge */}
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {/* Background Ring */}
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="3.5"
                        />
                        {/* Progress Arc */}
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={corridor.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${corridor.progressPct}, 100`}
                          className="filter drop-shadow-[0_0_4px_currentColor]"
                        />
                      </svg>
                      {/* Centered Temp Value */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-mono font-bold text-xs leading-none text-white">
                          {corridor.temp > 0 ? `+${corridor.temp}°C` : `${corridor.temp}°C`}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase leading-tight mt-0.5">
                          {corridor.targetTemp}°C Set
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INDONESIA ⇄ SINGAPORE MARITIME MAP */}
        {activeTab === 'map' && (
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span>Indonesia ⇄ Singapore Maritime Radar & Shipping Corridors</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live tracking across Selat Malaka, Selat Karimata, Laut Jawa, and Singapore Port anchorage.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>3 Maritime Vessels Active on Fairways</span>
              </div>
            </div>

            {/* Indonesia ⇄ Singapore Stylized Radar Map Canvas */}
            <div className="relative h-[420px] w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Radar Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px), radial-gradient(#0ea5e9 1px, transparent 1px)`,
                  backgroundSize: `28px 28px`,
                  backgroundPosition: `0 0, 14px 14px`
                }}
              />

              {/* Geographic Coastline SVG for Sumatra, Batam, Singapore, and Java */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 420">
                {/* Sumatra Mainland East Coast */}
                <path
                  d="M 50,20 Q 150,80 250,150 T 350,260 T 450,380"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                />
                <text x="180" y="240" fill="#64748b" fontSize="13" fontFamily="monospace" fontWeight="bold">
                  SUMATRA (INDONESIA)
                </text>

                {/* Java Island Coast (North Shore - Jakarta) */}
                <path
                  d="M 380,390 Q 550,380 750,390"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                />
                <text x="560" y="410" fill="#64748b" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  JAVA SEA / JAKARTA
                </text>

                {/* Singapore Island & Straits */}
                <path
                  d="M 520,110 Q 550,105 570,115 T 580,125 T 530,130 Z"
                  fill="#1e293b"
                  stroke="#0284c7"
                  strokeWidth="2"
                />
                <text x="540" y="98" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  SINGAPORE (JURONG / PASIR PANJANG)
                </text>

                {/* Batam & Bintan Islands */}
                <path
                  d="M 540,150 Q 570,145 580,165 T 550,185 Z"
                  fill="#1e293b"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
                <text x="590" y="170" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  BATAM (KEPRI)
                </text>

                {/* Corridors Shipping Fairways */}
                {/* Corridor 1: Batam -> Jurong (Very Short, High Frequency) */}
                <path
                  d="M 550,155 L 535,125"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="filter drop-shadow-[0_0_6px_#10b981]"
                />

                {/* Corridor 2: Jakarta -> Pasir Panjang (Through Selat Karimata & Selat Riau) */}
                <path
                  d="M 520,380 Q 580,280 550,135"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                  className="filter drop-shadow-[0_0_8px_#f43f5e]"
                />

                {/* Corridor 3: Medan Belawan -> Jurong (Through Malacca Strait) */}
                <path
                  d="M 160,80 Q 340,100 525,120"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                  className="filter drop-shadow-[0_0_6px_#06b6d4]"
                />

                {/* Corridor 4: Bali Benoa via Surabaya -> Singapore */}
                <path
                  d="M 750,380 Q 660,260 560,130"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                  className="filter drop-shadow-[0_0_6px_#38bdf8]"
                />
              </svg>

              {/* Waypoint 1: Batam Batu Ampar */}
              <div className="absolute left-[61%] top-[39%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Pelabuhan Batu Ampar
                </span>
              </div>

              {/* Waypoint 2: Singapore Jurong */}
              <div className="absolute left-[58%] top-[26%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-sky-400 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-sky-500/30">
                  Jurong Fishery Port
                </span>
              </div>

              {/* Waypoint 3: Jakarta Tanjung Priok */}
              <div className="absolute left-[58%] top-[90%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-slate-300 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
                  Tanjung Priok / Muara Baru
                </span>
              </div>

              {/* Waypoint 4: Medan Belawan */}
              <div className="absolute left-[18%] top-[18%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  Pelabuhan Belawan
                </span>
              </div>

              {/* Waypoint 5: Bali Benoa / Surabaya */}
              <div className="absolute left-[82%] top-[86%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-sky-400 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-sky-500/30">
                  Benoa (Bali) / Surabaya
                </span>
              </div>

              {/* Vessel 1: Batam to Singapore (Active Crossing) */}
              <div
                onClick={() => setSelectedCorridorIdx(0)}
                className="absolute left-[60%] top-[33%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center relative shadow-lg shadow-emerald-500/50">
                    <Navigation className="w-2.5 h-2.5 text-slate-950 fill-current transform -rotate-45" />
                  </div>
                </div>
                <div className="absolute left-7 -top-3 bg-slate-900/95 border border-emerald-500/80 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[180px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold block">
                    KM SAMUDERA SEAFRESH 09
                  </span>
                  <span className="font-bold text-xs text-white block">Live Cantang Grouper</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 mt-1">
                    <span>Temp: +3.2°C</span>
                    <span>·</span>
                    <span>14.8 kts</span>
                    <span>·</span>
                    <span className="text-emerald-400">ETA 35m</span>
                  </div>
                </div>
              </div>

              {/* Vessel 2: Jakarta to Singapore (Warning Excursion in Selat Karimata) */}
              <div
                onClick={() => setSelectedCorridorIdx(1)}
                className="absolute left-[62%] top-[62%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-rose-500 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-6 h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center relative shadow-lg shadow-rose-500/50">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="absolute right-8 -top-3 bg-slate-900/95 border border-rose-500/80 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[190px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-rose-400 font-bold block">
                    KM NUSANTARA REEFER 18 · ALERT
                  </span>
                  <span className="font-bold text-xs text-white block">Yellowfin Tuna Sashimi AAA</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-rose-300 mt-1 font-bold">
                    <span>Temp: -16.2°C (Warning)</span>
                    <span>·</span>
                    <span>19.4 kts</span>
                  </div>
                </div>
              </div>

              {/* Vessel 3: Medan to Singapore in Malacca Strait */}
              <div
                onClick={() => setSelectedCorridorIdx(2)}
                className="absolute left-[38%] top-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-cyan-400 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center relative shadow-lg shadow-cyan-400/50">
                    <Navigation className="w-2.5 h-2.5 text-slate-950 fill-current transform rotate-45" />
                  </div>
                </div>
                <div className="absolute left-7 -top-3 bg-slate-900/95 border border-cyan-500/80 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[180px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold block">
                    KM SELAT MALAKA EXPRESS
                  </span>
                  <span className="font-bold text-xs text-white block">Black Tiger Prawns</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 mt-1">
                    <span>Temp: -21.4°C</span>
                    <span>·</span>
                    <span>17.2 kts</span>
                  </div>
                </div>
              </div>

              {/* Vessel 4: Bali to Singapore */}
              <div
                onClick={() => setSelectedCorridorIdx(3)}
                className="absolute left-[70%] top-[54%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-sky-400 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-5 h-5 rounded-full bg-sky-400 border-2 border-white flex items-center justify-center relative shadow-lg shadow-sky-400/50">
                    <Navigation className="w-2.5 h-2.5 text-slate-950 fill-current transform -rotate-12" />
                  </div>
                </div>
                <div className="absolute right-8 -top-3 bg-slate-900/95 border border-sky-500/80 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[180px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-sky-400 font-bold block">
                    SQ CARGO COOLPORT
                  </span>
                  <span className="font-bold text-xs text-white block">Bigeye Tuna & Barramundi</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 mt-1">
                    <span>Temp: +0.8°C</span>
                    <span>·</span>
                    <span>22.0 kts</span>
                    <span>·</span>
                    <span className="text-sky-400">ETA Tomorrow</span>
                  </div>
                </div>
              </div>

              {/* Floating Radar Telemetry HUD */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs font-mono space-y-1 backdrop-blur-md">
                <span className="text-slate-400 block text-[10px]">CORRIDOR RADAR HUD</span>
                <span className="text-teal-300 font-bold block">{currentCorridor.title}</span>
                <span className="text-slate-300 block">Vessel: {currentCorridor.vesselName}</span>
                <span className="text-slate-400 block">Coords: {currentCorridor.coords} · Speed: {currentCorridor.speedKts} kts</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 3D TERMINAL HUB */}
        {activeTab === 'fleet3d' && (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[380px]">
            <img
              src={isometricImg}
              alt="Cold-chain terminal 3D fleet"
              className="w-full h-full object-cover max-h-[480px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

            <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-teal-500/40 p-4 rounded-xl max-w-sm shadow-xl text-xs space-y-1.5">
              <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">
                Batam - Singapore Dedicated Reefer Pier
              </span>
              <h4 className="text-sm font-bold text-white">Batu Ampar & Jurong Intermodal Cold Gate</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Direct short-sea barge logistics transfers live grouper aerated tanks and frozen tuna containers under uninterrupted power supply, cutting dwell time at Singapore customs to under 30 minutes.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[10px] text-teal-300">
                <span>Fast Dwell: 28 mins</span>
                <span>BKIPM ⇄ SFA Validated</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Quick Metrics Bar */}
        <div className="pt-2 border-t border-slate-850 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Indonesia ⇄ SG Reefer Fleet</span>
              <span className="font-mono text-xl font-bold text-white block mt-0.5">38 Containers Active</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              100% Online
            </span>
          </div>

          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Malacca & Riau Strait Status</span>
              <span className="font-mono text-xl font-bold text-white block mt-0.5">99.1% On-Time</span>
            </div>
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">
              BKIPM-SFA Green
            </span>
          </div>

          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Selat Karimata Incident</span>
              <span className="font-mono text-xl font-bold text-rose-400 block mt-0.5">1 Compressor Alert</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/20 px-2 py-1 rounded border border-rose-500/30">
              NSTR-452109-8
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

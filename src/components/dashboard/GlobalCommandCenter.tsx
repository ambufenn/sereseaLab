import React, { useState, useEffect } from 'react';
import { Shipment } from '../../types';
import {
  Activity,
  Compass,
  Snowflake,
  ShieldAlert,
  Radio,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  MapPin,
  ChevronRight,
  TrendingUp,
  AlertCircle
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
  compact = false
}) => {
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);
  const [simulatedHour, setSimulatedHour] = useState<number>(14);
  const [isLiveAnimating, setIsLiveAnimating] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'map' | 'telemetry' | 'fleet3d'>('telemetry');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
        ' UTC'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Vessel routes for live tracking
  const liveRoutes = [
    {
      id: 'R-01',
      vesselName: 'Arctic Voyager (IMO 982143)',
      species: 'Atlantic Salmon',
      origin: 'Bergen, NO',
      dest: 'Rotterdam, NL',
      progressPct: 78,
      speedKts: 18.4,
      heading: '194° S',
      coords: '54.21°N, 3.44°E',
      temp: 0.8,
      targetTemp: 0.0,
      minTemp: -0.2,
      maxTemp: 1.1,
      status: 'Optimal',
      color: '#10b981', // emerald
      chartPoints: [0.2, 0.4, 0.5, 0.7, 0.6, 0.8, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8]
    },
    {
      id: 'R-02',
      vesselName: 'Ocean Phoenix III (IMO 941092)',
      species: 'Yellowfin Tuna Sashimi',
      origin: 'Mindanao, PH',
      dest: 'Tokyo Toyosu, JP',
      progressPct: 62,
      speedKts: 21.2,
      heading: '034° NE',
      coords: '24.12°N, 131.85°E',
      temp: -16.2,
      targetTemp: -20.0,
      minTemp: -20.4,
      maxTemp: -16.0,
      status: 'Warning (Duty Cycle)',
      color: '#f43f5e', // rose
      chartPoints: [-20.1, -19.8, -19.2, -18.4, -17.5, -16.8, -16.4, -16.2, -16.2, -16.3, -16.2, -16.2]
    },
    {
      id: 'R-03',
      vesselName: 'Hapag Cold Express (IMO 973341)',
      species: 'Black Tiger Prawns',
      origin: 'Surat Thani, TH',
      dest: 'Hamburg Gate, DE',
      progressPct: 88,
      speedKts: 16.8,
      heading: '280° W',
      coords: '53.11°N, 8.92°E',
      temp: -21.4,
      targetTemp: -22.0,
      minTemp: -22.5,
      maxTemp: -21.2,
      status: 'Customs Gate Hold',
      color: '#06b6d4', // cyan
      chartPoints: [-21.8, -21.7, -21.6, -21.5, -21.4, -21.4, -21.5, -21.4, -21.4, -21.4, -21.4, -21.4]
    }
  ];

  const activeRoute = liveRoutes[selectedRouteIdx];

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
                Global Cold-Chain Command & Live Tracking
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Live Status: <span className="text-emerald-400 font-semibold">Active Monitoring</span> · {currentTime || 'Synchronizing UTC...'}
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
            <span>Global Fleet Map</span>
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
                      <span>TEMPERATURE OVERVIEW | Multi-Route Sensors (Last 24 Hours)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sub-minute sampling from reefer IoT dataloggers via Inmarsat FleetBroadband
                    </p>
                  </div>

                  {/* Route Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Route A (0°C to 1°C)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Route B (-20°C Sashimi)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span>Route C (-22°C Frozen)</span>
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
                    {/* Route A Line (Chilled Salmon: around 0.8°C) */}
                    <path
                      d="M 0,80 Q 70,85 140,82 T 280,78 T 420,70 T 560,75 T 700,72"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />

                    {/* Route B Line (Yellowfin Tuna with temperature excursion spike) */}
                    <path
                      d="M 0,160 Q 70,158 140,155 T 280,140 T 360,115 T 480,105 T 600,108 T 700,110"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3.5"
                      className="filter drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                    />

                    {/* Route C Line (Tiger Prawns: solid constant -21.4°C) */}
                    <path
                      d="M 0,175 Q 80,175 160,174 T 320,175 T 480,175 T 640,174 T 700,175"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                    />

                    {/* Data Points on Route B Excursion */}
                    <circle cx="360" cy="115" r="4.5" fill="#f43f5e" className="animate-ping opacity-75" />
                    <circle cx="360" cy="115" r="4.5" fill="#f43f5e" />
                    <text x="370" y="110" fill="#fca5a5" fontSize="10" fontFamily="monospace">
                      Compressor Trip (-16.2°C)
                    </text>
                  </svg>

                  {/* Horizontal Time Ticks */}
                  <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>00:00</span>
                    <span>04:00</span>
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                    <span>Now (Live)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Mini-Strip */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">Chilled Setpoint Variance</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">Δ +0.3°C (Nominal)</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">Deep-Freeze Compliance</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">Δ +3.8°C (Intervene)</span>
                </div>
                <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">Frozen Storage Envelope</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">Δ +0.6°C (Secure)</span>
                </div>
              </div>
            </div>

            {/* Right Side: Circular Radial Gauges (as seen in user image) */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
              {liveRoutes.map((route, idx) => {
                const isSelected = selectedRouteIdx === idx;
                const isWarning = route.status.includes('Warning');

                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteIdx(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs text-white">
                          Route {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-300 font-semibold">{route.species.split(' ')[0]}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                        {route.vesselName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {route.origin} → {route.dest}
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
                          stroke={route.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${route.progressPct}, 100`}
                          className="filter drop-shadow-[0_0_4px_currentColor]"
                        />
                      </svg>
                      {/* Centered Temp Value */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-mono font-bold text-xs leading-none text-white">
                          {route.temp > 0 ? `+${route.temp}°C` : `${route.temp}°C`}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase leading-tight mt-0.5">
                          {route.status.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL FLEET MAP (Interactive Real Tracking) */}
        {activeTab === 'map' && (
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span>Real-Time Maritime & Intermodal Vessel Tracking Map</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click on any vessel waypoint to inspect real-time reefer temperature telemetry, GPS coordinates, and speed.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>3 Maritime Vessels In Radar Range</span>
              </div>
            </div>

            {/* Simulated Maritime Vector Map Container */}
            <div className="relative h-96 w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Stylized Dark Grid Map Canvas */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#0ea5e9 1px, transparent 1px)`,
                  backgroundSize: `32px 32px`,
                  backgroundPosition: `0 0, 16px 16px`
                }}
              />

              {/* Ocean Waypoints & Route Vectors */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 400">
                {/* World Coastline Outlines (Stylized) */}
                <path
                  d="M 120,80 Q 200,60 280,110 T 380,140 T 450,110 T 520,70 T 640,110 T 780,90"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 180,240 Q 260,260 380,220 T 520,260 T 680,240 T 820,290"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Route 1: North Sea (Bergen -> Rotterdam) */}
                <path
                  d="M 440,70 Q 435,110 430,150"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />

                {/* Route 2: Western Pacific (Mindanao -> Tokyo) */}
                <path
                  d="M 680,270 Q 710,210 740,140"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />

                {/* Route 3: Indian Ocean / Suez / Europe */}
                <path
                  d="M 620,250 Q 520,210 460,190 T 420,150"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />
              </svg>

              {/* Interactive Vessel Pins */}
              {/* Vessel 1: North Sea */}
              <div
                onClick={() => setSelectedRouteIdx(0)}
                className="absolute left-[47%] top-[25%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center relative shadow-lg shadow-emerald-500/50" />
                </div>
                <div className="absolute left-6 -top-2 bg-slate-900/95 border border-emerald-500/60 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[160px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold block">
                    MV ARCTIC VOYAGER
                  </span>
                  <span className="font-bold text-xs text-white block">Norwegian Salmon</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 mt-1">
                    <span>Temp: +0.8°C</span>
                    <span>·</span>
                    <span>18.4 kts</span>
                  </div>
                </div>
              </div>

              {/* Vessel 2: Western Pacific (Warning) */}
              <div
                onClick={() => setSelectedRouteIdx(1)}
                className="absolute left-[78%] top-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-rose-500 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center relative shadow-lg shadow-rose-500/50">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="absolute right-7 -top-2 bg-slate-900/95 border border-rose-500/80 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[170px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-rose-400 font-bold block">
                    OCEAN PHOENIX III · ALERT
                  </span>
                  <span className="font-bold text-xs text-white block">Yellowfin Tuna Loins</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-rose-300 mt-1 font-bold">
                    <span>Temp: -16.2°C (Excursion)</span>
                    <span>·</span>
                    <span>21.2 kts</span>
                  </div>
                </div>
              </div>

              {/* Vessel 3: Approaching Europe */}
              <div
                onClick={() => setSelectedRouteIdx(2)}
                className="absolute left-[54%] top-[38%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center relative shadow-lg shadow-cyan-400/50" />
                </div>
                <div className="absolute left-6 -top-2 bg-slate-900/95 border border-cyan-500/60 p-2.5 rounded-lg shadow-xl text-left whitespace-nowrap min-w-[160px] pointer-events-none group-hover:pointer-events-auto">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold block">
                    HAPAG COLD EXPRESS
                  </span>
                  <span className="font-bold text-xs text-white block">Black Tiger Prawns</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 mt-1">
                    <span>Temp: -21.4°C</span>
                    <span>·</span>
                    <span>16.8 kts</span>
                  </div>
                </div>
              </div>

              {/* Floating Map HUD */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-xs font-mono space-y-1 backdrop-blur-md">
                <span className="text-slate-400 block text-[10px]">SELECTED VESSEL HUD</span>
                <span className="text-teal-300 font-bold block">{activeRoute.vesselName}</span>
                <span className="text-slate-300 block">Position: {activeRoute.coords}</span>
                <span className="text-slate-400 block">Speed: {activeRoute.speedKts} kts · Heading: {activeRoute.heading}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 3D TERMINAL HUB (matching user reference isometric visual) */}
        {activeTab === 'fleet3d' && (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[380px]">
            <img
              src={isometricImg}
              alt="Cold-chain terminal 3D fleet"
              className="w-full h-full object-cover max-h-[480px]"
              referrerPolicy="no-referrer"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Telemetry Cards Overlaid on 3D Render */}
            <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md border border-teal-500/40 p-4 rounded-xl max-w-xs shadow-xl text-xs space-y-1.5">
              <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">
                Integrated Reefer Terminal
              </span>
              <h4 className="text-sm font-bold text-white">Rotterdam Gateway Cold Pier 4</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Automated cold storage gantry cranes transferring reefers directly from vessels to continuous electric-chill semi-trucks without breaking cold chain.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-mono text-[10px] text-teal-300">
                <span>Active Cranes: 4</span>
                <span>Chamber: -24°C</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Quick Metrics Bar (matching user reference) */}
        <div className="pt-2 border-t border-slate-850 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Reefer Fleet</span>
              <span className="font-mono text-xl font-bold text-white block mt-0.5">78 Units Monitored</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              100% Online
            </span>
          </div>

          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Global Cold-Chain Status</span>
              <span className="font-mono text-xl font-bold text-white block mt-0.5">98.2% Nominal</span>
            </div>
            <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">
              HACCP Up
            </span>
          </div>

          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Incidents</span>
              <span className="font-mono text-xl font-bold text-rose-400 block mt-0.5">1 Critical Alert</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/20 px-2 py-1 rounded border border-rose-500/30">
              CMAU-452109-1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

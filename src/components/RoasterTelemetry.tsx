import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Gauge, Clock, Activity, Globe2, Sparkles, Award } from 'lucide-react';

export default function RoasterTelemetry() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'origins' | 'curve'>('telemetry');
  const [drumTemp, setDrumTemp] = useState(208.4);
  const [airFlow, setAirFlow] = useState(84);
  const [secondsOffRoast, setSecondsOffRoast] = useState(14820); // ~4 hours 7 mins

  useEffect(() => {
    const timer = setInterval(() => {
      // Gentle realistic sensor fluctuation
      setDrumTemp((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setAirFlow((prev) => +(prev + (Math.random() * 0.6 - 0.3)).toFixed(1));
      setSecondsOffRoast((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const origins = [
    { name: 'Ethiopia Yirgacheffe G1', altitude: '2,200m ASL', process: 'Anaerobic Natural', notes: 'Bergamot, Jasmine, White Peach', cuppingScore: 93.5 },
    { name: 'Colombia Huila Geisha', altitude: '1,950m ASL', process: 'Washed Extended Ferment', notes: 'Papaya, Orange Blossom, Cane Sugar', cuppingScore: 92.8 },
    { name: 'Guatemala Antigua San Sebastian', altitude: '1,800m ASL', process: 'Honey Process', notes: 'Milk Chocolate, Candied Pecan, Plum', cuppingScore: 91.5 },
    { name: 'Sumatra Mandheling Vintage', altitude: '1,600m ASL', process: 'Wet-Hulled Giling Basah', notes: 'Cedar, Dark Cacao, Molasses', cuppingScore: 90.5 },
  ];

  return (
    <div className="mt-16 bg-[#14100b]/90 border border-[#c9a25e]/30 p-6 sm:p-8 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c9a25e]/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9ed9a3] animate-pulse" />
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a25e] font-semibold">
              Live Instrumentation • 1928 Probat Cast-Iron Drum
            </p>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#faf5ea] mt-1">Roastery Telemetry & Origins</h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#0d0a07] border border-[#c9a25e]/20">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
              activeTab === 'telemetry'
                ? 'bg-[#c9a25e] text-[#0d0a07] font-medium'
                : 'text-[#f3ead9]/60 hover:text-[#e8c98a]'
            }`}
          >
            Roast Dials
          </button>
          <button
            onClick={() => setActiveTab('origins')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
              activeTab === 'origins'
                ? 'bg-[#c9a25e] text-[#0d0a07] font-medium'
                : 'text-[#f3ead9]/60 hover:text-[#e8c98a]'
            }`}
          >
            Bean Atlas
          </button>
          <button
            onClick={() => setActiveTab('curve')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition ${
              activeTab === 'curve'
                ? 'bg-[#c9a25e] text-[#0d0a07] font-medium'
                : 'text-[#f3ead9]/60 hover:text-[#e8c98a]'
            }`}
          >
            Roast Curve
          </button>
        </div>
      </div>

      {/* Tab 1: Live Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0d0a07] border border-[#c9a25e]/20 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]/80">
              <Flame size={14} /> Drum Temp
            </div>
            <p className="font-serif text-3xl sm:text-4xl text-[#faf5ea] mt-2">{drumTemp}°C</p>
            <p className="text-[10px] text-[#f3ead9]/40 mt-1">Target: 210.0°C</p>
          </div>

          <div className="bg-[#0d0a07] border border-[#c9a25e]/20 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]/80">
              <Gauge size={14} /> Air Velocity
            </div>
            <p className="font-serif text-3xl sm:text-4xl gold-text mt-2">{airFlow}%</p>
            <p className="text-[10px] text-[#f3ead9]/40 mt-1">Laminar Flow</p>
          </div>

          <div className="bg-[#0d0a07] border border-[#c9a25e]/20 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]/80">
              <Clock size={14} /> Dawn Freshness
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-[#faf5ea] mt-2 font-mono">{formatElapsedTime(secondsOffRoast)}</p>
            <p className="text-[10px] text-[#f3ead9]/40 mt-1">Peak degas window</p>
          </div>

          <div className="bg-[#0d0a07] border border-[#c9a25e]/20 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]/80">
              <Activity size={14} /> Current Batch
            </div>
            <p className="font-serif text-2xl sm:text-3xl text-[#e8c98a] mt-2">#MN-892</p>
            <p className="text-[10px] text-[#f3ead9]/40 mt-1">Yirgacheffe Heirloom</p>
          </div>
        </div>
      )}

      {/* Tab 2: Bean Atlas */}
      {activeTab === 'origins' && (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {origins.map((o) => (
            <div key={o.name} className="bg-[#0d0a07] border border-[#c9a25e]/20 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-lg text-[#faf5ea]">{o.name}</h4>
                  <p className="text-[11px] text-[#c9a25e]">{o.altitude} • {o.process}</p>
                </div>
                <span className="flex items-center gap-1 text-xs gold-text font-serif bg-[#c9a25e]/10 border border-[#c9a25e]/30 px-2 py-0.5">
                  <Award size={12} /> {o.cuppingScore}
                </span>
              </div>
              <p className="text-xs text-[#f3ead9]/60 font-light">
                <span className="text-[#f3ead9]/40 uppercase text-[10px] tracking-wider mr-1.5">Aromatics:</span>
                {o.notes}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Roast Curve Graph (SVG Visualizer) */}
      {activeTab === 'curve' && (
        <div className="mt-6 bg-[#0d0a07] border border-[#c9a25e]/20 p-5 space-y-3">
          <div className="flex justify-between items-center text-xs text-[#c9a25e]">
            <span>Rate of Rise (RoR) & Temperature Curve</span>
            <span>Batch Duration: 11m 45s</span>
          </div>

          {/* SVG Visualizer */}
          <div className="h-36 w-full relative">
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9a25e" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#e8c98a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c9a25e" stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#c9a25e" strokeOpacity="0.1" strokeDasharray="4" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#c9a25e" strokeOpacity="0.1" strokeDasharray="4" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#c9a25e" strokeOpacity="0.1" strokeDasharray="4" />

              {/* Curve path */}
              <path
                d="M 10,110 Q 80,115 140,85 T 300,45 T 480,18"
                fill="none"
                stroke="url(#curveGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Milestones */}
              <circle cx="140" cy="85" r="4" fill="#c9a25e" />
              <text x="140" y="105" fill="#f3ead9" opacity="0.6" fontSize="9" textAnchor="middle">Dry End (4:30)</text>

              <circle cx="300" cy="45" r="4" fill="#e8c98a" />
              <text x="300" y="32" fill="#e8c98a" fontSize="9" textAnchor="middle">First Crack (9:15)</text>

              <circle cx="480" cy="18" r="4" fill="#faf5ea" />
              <text x="450" y="10" fill="#faf5ea" fontSize="9" textAnchor="middle">Drop (210°C)</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Gauge, Clock, Activity, Globe2, Sparkles, Award, Wind, Compass, ChevronRight, Check } from 'lucide-react';

export default function RoasterTelemetry() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'origins' | 'curve'>('telemetry');
  const [drumTemp, setDrumTemp] = useState(208.4);
  const [airFlow, setAirFlow] = useState(84);
  const [gasPressure, setGasPressure] = useState(2.8);
  const [drumRpm, setDrumRpm] = useState(52);
  const [secondsOffRoast, setSecondsOffRoast] = useState(14820); // ~4 hours 7 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setDrumTemp((prev) => +(prev + (Math.random() * 0.3 - 0.15)).toFixed(1));
      setAirFlow((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setGasPressure((prev) => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setSecondsOffRoast((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const origins = [
    {
      name: 'Ethiopia Yirgacheffe G1 Heirloom',
      estate: 'Konga Micro-Lot • Gedeo Zone',
      altitude: '2,200m ASL',
      process: 'Anaerobic Slow Natural (72h)',
      notes: 'Bergamot, Night Jasmine, Ripe White Peach & Honeycomb',
      cuppingScore: 93.5,
      harvest: 'Vintage Nov 2025'
    },
    {
      name: 'Panama Boquete Geisha Grand Cru',
      estate: 'Hacienda La Esmeralda • Cañas Verdes',
      altitude: '1,950m ASL',
      process: 'Double-Washed Mountain Spring',
      notes: 'Orange Blossom, Meyer Lemon, Starfruit & Sweet Tea',
      cuppingScore: 94.2,
      harvest: 'Limited Lot 04'
    },
    {
      name: 'Colombia Huila Pink Bourbon',
      estate: 'Finca El Paraiso • San Adolfo',
      altitude: '1,900m ASL',
      process: 'Extended Thermal Shock Fermentation',
      notes: 'Wild Strawberry, Guava, Pink Champagne & Turbinado Sugar',
      cuppingScore: 92.8,
      harvest: 'Micro-Lot Selection'
    },
    {
      name: 'Sumatra Mandheling Vintage Lot',
      estate: 'Lake Toba Volcanic Slopes',
      altitude: '1,600m ASL',
      process: 'Traditional Wet-Hulled (Giling Basah)',
      notes: 'Dark Valrhona Cacao, Aged Cedar, Dark Raisin & Pipe Tobacco',
      cuppingScore: 91.5,
      harvest: 'Aged Reserve'
    },
  ];

  return (
    <div className="mt-16 bg-[#14100b]/95 border-2 border-[#c9a25e]/40 p-6 sm:p-10 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a25e]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#c9a25e]/25 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9ed9a3] animate-pulse" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a25e] font-semibold">
              Live Roaster Instrumentation • 1928 Probat UG-22 Cast-Iron Drum
            </p>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#faf5ea] mt-1.5">
            Roastery Telemetry, Bean Atlas & Roast Curve
          </h3>
          <p className="text-xs text-[#f3ead9]/60 font-light mt-1">
            Real-time sensory telemetry calibrated at our Mayfair Atelier for peak extraction and caramelization.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#0d0a07] border border-[#c9a25e]/30 shrink-0">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition font-medium ${
              activeTab === 'telemetry'
                ? 'bg-[#c9a25e] text-[#0d0a07] shadow-sm'
                : 'text-[#f3ead9]/70 hover:text-[#e8c98a]'
            }`}
          >
            Roast Dials
          </button>
          <button
            onClick={() => setActiveTab('origins')}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition font-medium ${
              activeTab === 'origins'
                ? 'bg-[#c9a25e] text-[#0d0a07] shadow-sm'
                : 'text-[#f3ead9]/70 hover:text-[#e8c98a]'
            }`}
          >
            Bean Atlas
          </button>
          <button
            onClick={() => setActiveTab('curve')}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition font-medium ${
              activeTab === 'curve'
                ? 'bg-[#c9a25e] text-[#0d0a07] shadow-sm'
                : 'text-[#f3ead9]/70 hover:text-[#e8c98a]'
            }`}
          >
            Roast Curve
          </button>
        </div>
      </div>

      {/* Tab 1: Live Telemetry Dials */}
      {activeTab === 'telemetry' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Drum Temperature Dial Card */}
            <div className="bg-gradient-to-b from-[#18130e] to-[#0d0a07] border border-[#c9a25e]/30 p-5 text-center relative overflow-hidden group hover:border-[#c9a25e] transition">
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]">
                <Flame size={15} /> Drum Temperature
              </div>
              <p className="font-serif text-3xl sm:text-5xl text-[#faf5ea] mt-3 font-medium">
                {drumTemp}<span className="text-xl text-[#c9a25e]">°C</span>
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#f3ead9]/50 border-t border-[#c9a25e]/15 pt-2">
                <span>Target: 210.0°C</span>
                <span className="text-[#9ed9a3]">● Nominal</span>
              </div>
            </div>

            {/* Laminar Air Flow Card */}
            <div className="bg-gradient-to-b from-[#18130e] to-[#0d0a07] border border-[#c9a25e]/30 p-5 text-center relative overflow-hidden group hover:border-[#c9a25e] transition">
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]">
                <Wind size={15} /> Laminar Air Velocity
              </div>
              <p className="font-serif text-3xl sm:text-5xl gold-text mt-3 font-medium">
                {airFlow}<span className="text-xl text-[#e8c98a]">%</span>
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#f3ead9]/50 border-t border-[#c9a25e]/15 pt-2">
                <span>Draft: Clean Convection</span>
                <span className="text-[#9ed9a3]">● Optimal</span>
              </div>
            </div>

            {/* Dawn Freshness Degas Window */}
            <div className="bg-gradient-to-b from-[#18130e] to-[#0d0a07] border border-[#c9a25e]/30 p-5 text-center relative overflow-hidden group hover:border-[#c9a25e] transition">
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]">
                <Clock size={15} /> Dawn Freshness
              </div>
              <p className="font-mono text-2xl sm:text-3xl text-[#faf5ea] mt-3 tracking-wide">
                {formatElapsedTime(secondsOffRoast)}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#f3ead9]/50 border-t border-[#c9a25e]/15 pt-2">
                <span>Peak Degas Window</span>
                <span className="text-[#e8c98a]">Day 01</span>
              </div>
            </div>

            {/* Current Active Batch */}
            <div className="bg-gradient-to-b from-[#18130e] to-[#0d0a07] border border-[#c9a25e]/30 p-5 text-center relative overflow-hidden group hover:border-[#c9a25e] transition">
              <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c9a25e]">
                <Activity size={15} /> Active Roast Batch
              </div>
              <p className="font-serif text-3xl sm:text-4xl text-[#e8c98a] mt-3">
                #MN-892
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#f3ead9]/50 border-t border-[#c9a25e]/15 pt-2">
                <span>Yirgacheffe Heirloom</span>
                <span className="text-[#9ed9a3]">18.5 kg Cast Iron</span>
              </div>
            </div>
          </div>

          {/* Secondary Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#0d0a07] border border-[#c9a25e]/20 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c9a25e]/70 block">Burner Gas Pressure</span>
              <span className="text-[#faf5ea] font-mono font-medium">{gasPressure} mbar</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c9a25e]/70 block">Drum Rotation Speed</span>
              <span className="text-[#faf5ea] font-mono font-medium">{drumRpm} RPM (Constant)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c9a25e]/70 block">Exhaust Chaff Trap</span>
              <span className="text-[#faf5ea] font-mono font-medium">99.2% Separation</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c9a25e]/70 block">Roast Master on Duty</span>
              <span className="text-[#faf5ea] font-serif">Henri Laurent (Q-Grader)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Bean Atlas */}
      {activeTab === 'origins' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 grid sm:grid-cols-2 gap-5"
        >
          {origins.map((o) => (
            <div
              key={o.name}
              className="bg-gradient-to-b from-[#18130e] to-[#0d0a07] border border-[#c9a25e]/30 hover:border-[#c9a25e] p-6 space-y-3 transition duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[#c9a25e] font-medium block">
                    {o.estate} • {o.harvest}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#faf5ea] mt-0.5">{o.name}</h4>
                  <p className="text-xs text-[#e8c98a] font-light mt-1">
                    Elevation: <strong className="font-normal text-[#faf5ea]">{o.altitude}</strong> • Process: <strong className="font-normal text-[#faf5ea]">{o.process}</strong>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-sm gold-text font-serif bg-[#c9a25e]/15 border border-[#c9a25e]/40 px-3 py-1 font-semibold">
                    <Award size={14} className="text-[#c9a25e]" /> SCA {o.cuppingScore}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#c9a25e]/15">
                <p className="text-xs text-[#f3ead9]/75 font-light leading-relaxed">
                  <span className="text-[#c9a25e] uppercase text-[10px] tracking-wider font-medium mr-2">Sensory Notes:</span>
                  {o.notes}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Tab 3: Roast Curve Graph (SVG Visualizer) */}
      {activeTab === 'curve' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 bg-[#0d0a07] border border-[#c9a25e]/30 p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#c9a25e]/20 pb-4">
            <div>
              <h4 className="font-serif text-xl text-[#faf5ea]">Thermal RoR & Development Curve</h4>
              <p className="text-xs text-[#f3ead9]/60 font-light mt-0.5">
                Rate-of-Rise (RoR) progression from Charge (200°C) through Maillard to Drop (210°C).
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-[#c9a25e]">
              <span>Batch Duration: 11m 45s</span>
              <span>Development Time Ratio (DTR): 16.8%</span>
            </div>
          </div>

          {/* SVG Visualizer */}
          <div className="h-56 w-full relative">
            <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="roastAreaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9a25e" stopOpacity="0.15" />
                  <stop offset="60%" stopColor="#e8c98a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#c9a25e" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="curveLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8a6d3b" />
                  <stop offset="45%" stopColor="#c9a25e" />
                  <stop offset="80%" stopColor="#e8c98a" />
                  <stop offset="100%" stopColor="#faf5ea" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="600" y2="30" stroke="#c9a25e" strokeOpacity="0.12" strokeDasharray="4" />
              <line x1="0" y1="75" x2="600" y2="75" stroke="#c9a25e" strokeOpacity="0.12" strokeDasharray="4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#c9a25e" strokeOpacity="0.12" strokeDasharray="4" />

              {/* Phase Background Shading */}
              <rect x="0" y="0" width="160" height="150" fill="#c9a25e" fillOpacity="0.03" />
              <rect x="160" y="0" width="230" height="150" fill="#e8c98a" fillOpacity="0.05" />
              <rect x="390" y="0" width="210" height="150" fill="#c9a25e" fillOpacity="0.08" />

              {/* Phase Labels */}
              <text x="80" y="15" fill="#c9a25e" fillOpacity="0.5" fontSize="10" textAnchor="middle" letterSpacing="0.2em">I. DRYING PHASE</text>
              <text x="275" y="15" fill="#c9a25e" fillOpacity="0.6" fontSize="10" textAnchor="middle" letterSpacing="0.2em">II. MAILLARD REACTION</text>
              <text x="495" y="15" fill="#e8c98a" fillOpacity="0.8" fontSize="10" textAnchor="middle" letterSpacing="0.2em">III. CARAMELIZATION & DROP</text>

              {/* Main Bean Temp Curve */}
              <path
                d="M 10,140 Q 60,150 110,120 T 220,80 T 390,45 T 570,22"
                fill="none"
                stroke="url(#curveLineGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* RoR Derivative Secondary Curve */}
              <path
                d="M 10,60 Q 80,45 160,75 T 320,105 T 570,135"
                fill="none"
                stroke="#c9a25e"
                strokeWidth="1.8"
                strokeDasharray="3"
                strokeOpacity="0.6"
              />

              {/* Milestones */}
              <circle cx="110" cy="120" r="4.5" fill="#c9a25e" />
              <text x="110" y="105" fill="#f3ead9" fontSize="10" textAnchor="middle">Turning Point (1:15)</text>

              <circle cx="220" cy="80" r="4.5" fill="#e8c98a" />
              <text x="220" y="65" fill="#e8c98a" fontSize="10" textAnchor="middle">Dry End (4:30)</text>

              <circle cx="390" cy="45" r="5" fill="#faf5ea" />
              <text x="390" y="32" fill="#faf5ea" fontSize="10" textAnchor="middle" fontWeight="bold">First Crack (9:15)</text>

              <circle cx="570" cy="22" r="5.5" fill="#c9a25e" />
              <text x="540" y="14" fill="#faf5ea" fontSize="10" textAnchor="middle" fontWeight="bold">Drop: 210°C (11:45)</text>
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}

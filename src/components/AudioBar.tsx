import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Disc3, CloudRain, Coffee, Sparkles, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Gramophone from './Gramophone';

export default function AudioBar() {
  const { isAudioOn, toggleAudio, audioMode, setAudioMode } = useShop();
  const [expanded, setExpanded] = useState(false);

  const modes: { id: 'vinyl' | 'espresso' | 'rain'; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'vinyl', label: 'Vintage Vinyl Jazz', icon: Disc3, desc: 'Continuous 1960s vinyl crackle & warm jazz chords' },
    { id: 'espresso', label: 'Roastery Slow Bar', icon: Coffee, desc: 'Gentle espresso bar resonance & steam notes' },
    { id: 'rain', label: 'Rain on Stained Glass', icon: CloudRain, desc: 'Soothing rain & mellow ambient piano' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Control Box */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-84 bg-[#14100b]/98 backdrop-blur-2xl border border-[#c9a25e]/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-[#f3ead9]"
          >
            <div className="flex items-center justify-between border-b border-[#c9a25e]/25 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <Gramophone isPlaying={isAudioOn} size={28} />
                <div>
                  <span className="font-serif text-lg text-[#faf5ea] block leading-tight">Gramophone Soundscape</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a25e]">
                    {isAudioOn ? '● Playing in Continuous Loop' : '○ Paused'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-[#f3ead9]/50 hover:text-[#e8c98a] p-1 transition"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#f3ead9]/70 font-light mb-4 leading-relaxed">
              Ambient acoustic jazz generated live via Web Audio API. Loops indefinitely during your stay.
            </p>

            <div className="space-y-2 mb-4">
              {modes.map((m) => {
                const Icon = m.icon;
                const isCurrent = audioMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setAudioMode(m.id)}
                    className={`w-full flex items-start gap-3 p-2.5 text-left border transition ${
                      isCurrent
                        ? 'bg-[#c9a25e]/20 border-[#c9a25e] text-[#faf5ea] shadow-[0_0_12px_rgba(201,162,94,0.2)]'
                        : 'border-[#c9a25e]/15 hover:border-[#c9a25e]/40 text-[#f3ead9]/70'
                    }`}
                  >
                    <Icon size={18} className={`mt-0.5 shrink-0 ${isCurrent ? 'text-[#c9a25e]' : 'text-[#f3ead9]/50'}`} />
                    <div>
                      <p className="text-xs tracking-wider uppercase font-medium">{m.label}</p>
                      <p className="text-[10px] text-[#f3ead9]/50 mt-0.5">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={toggleAudio}
              className={`w-full py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 transition ${
                isAudioOn
                  ? 'bg-[#c9a25e] text-[#0d0a07] hover:bg-[#e8c98a] font-semibold'
                  : 'border border-[#c9a25e]/50 text-[#e8c98a] hover:bg-[#c9a25e]/10'
              }`}
            >
              {isAudioOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
              {isAudioOn ? 'Mute Gramophone' : 'Resume Gramophone'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill with Rotating Clockwise Gramophone */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
          isAudioOn
            ? 'bg-[#1a130c]/95 border-[#c9a25e] text-[#e8c98a] shadow-[0_0_25px_rgba(201,162,94,0.4)]'
            : 'bg-[#0d0a07]/90 border-[#c9a25e]/30 text-[#f3ead9]/70 hover:border-[#c9a25e]'
        }`}
        aria-label="Gramophone ambient soundscape"
      >
        {/* Gramophone Component that rotates clockwise continuously */}
        <Gramophone isPlaying={isAudioOn} size={26} />

        <div className="text-left hidden sm:block">
          <span className="text-[11px] tracking-[0.18em] uppercase font-semibold block leading-tight text-[#faf5ea]">
            {isAudioOn ? 'Vinyl Jazz' : 'Muted'}
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#c9a25e]/80 block">
            {isAudioOn ? 'Continuous Loop' : 'Click to Play'}
          </span>
        </div>
      </motion.button>
    </div>
  );
}

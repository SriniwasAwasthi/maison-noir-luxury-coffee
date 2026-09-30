import { motion } from 'framer-motion';
import { ChevronDown, Star, Award, Leaf, Compass, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Gramophone from './Gramophone';

export default function Hero() {
  const { setIsSommelierOpen, isAudioOn, toggleAudio } = useShop();

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* Background Video & Gradients */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline poster="/images/hero.jpg" className="w-full h-full object-cover scale-105">
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a07]/80 via-[#0d0a07]/60 to-[#0d0a07]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,10,7,0.6)_100%)]" />
      </div>

      <div className="relative z-10 text-center px-5 sm:px-8 max-w-5xl mx-auto pt-36 pb-20">
        {/* Status Badge & Rotating Gramophone trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          <span className="hairline w-8 sm:w-16 hidden sm:block" />
          <div className="flex items-center gap-2 bg-[#14100b]/80 border border-[#c9a25e]/35 px-3.5 py-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#9ed9a3] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#e8c98a]">
              Est. 1998 • Single Origin Roastery
            </span>
          </div>

          {/* Quick Gramophone Soundtrack Button */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border px-3.5 py-1.5 backdrop-blur-md transition ${
              isAudioOn
                ? 'bg-[#1e1610]/90 border-[#c9a25e] text-[#e8c98a] shadow-[0_0_15px_rgba(201,162,94,0.3)]'
                : 'bg-[#0d0a07]/60 border-[#c9a25e]/25 text-[#f3ead9]/70 hover:border-[#c9a25e]'
            }`}
            aria-label="Toggle Gramophone Music"
          >
            <Gramophone isPlaying={isAudioOn} size={18} />
            <span>{isAudioOn ? 'Vinyl Jazz Playing' : 'Gramophone Muted'}</span>
          </button>
          <span className="hairline w-8 sm:w-16 hidden sm:block" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-serif text-[12vw] sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.95] text-[#faf5ea]"
        >
          Where Coffee<br />Becomes <em className="gold-text italic">Ceremony</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg md:text-xl font-light tracking-wide text-[#f3ead9]/80 max-w-2xl mx-auto leading-relaxed"
        >
          Rare single-origin micro-lots, roasted before dawn in our vintage cast-iron drum and poured tableside by master baristas.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#reserve"
            className="w-full sm:w-auto px-9 py-4 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.24em] uppercase font-medium hover:bg-[#e8c98a] transition-all duration-300 shadow-[0_10px_40px_rgba(201,162,94,0.35)]"
          >
            Reserve Your Table
          </a>

          <button
            onClick={() => setIsSommelierOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-[#14100b]/80 border border-[#c9a25e]/60 text-[#e8c98a] text-[12px] tracking-[0.22em] uppercase hover:bg-[#c9a25e]/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <Compass size={16} className="text-[#c9a25e]" />
            <span>Flavor Sommelier Dial</span>
          </button>

          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-4 border border-[#f3ead9]/30 text-[#f3ead9] text-[12px] tracking-[0.24em] uppercase hover:border-[#c9a25e] hover:text-[#e8c98a] transition-all duration-300 backdrop-blur-sm"
          >
            Explore Menu
          </a>
        </motion.div>

        {/* Accolades */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-[#f3ead9]/70"
        >
          <span className="flex items-center gap-2"><Award size={15} className="text-[#c9a25e]" /> Best Cafe 2025 • City Roast Awards</span>
          <span className="flex items-center gap-2"><Leaf size={15} className="text-[#c9a25e]" /> 100% Direct-Trade Micro-Lots</span>
          <span className="flex items-center gap-2"><Star size={15} className="text-[#c9a25e] fill-[#c9a25e]" /> 4.9 • 2,400+ Verified Reviews</span>
        </motion.div>
      </div>

      {/* Scroll Down Cue */}
      <motion.a
        href="#story"
        aria-label="Scroll down"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#c9a25e]/80 hover:text-[#e8c98a]"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase">Discover</span>
        <ChevronDown size={22} />
      </motion.a>
    </section>
  );
}

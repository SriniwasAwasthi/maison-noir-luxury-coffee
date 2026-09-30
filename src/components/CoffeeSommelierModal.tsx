import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Compass, Flame, Droplets, Moon, Sun, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useShop, MenuItem } from '../context/ShopContext';

export default function CoffeeSommelierModal() {
  const { isSommelierOpen, setIsSommelierOpen, setSelectedItemForDetail, addToCart, formatPrice } = useShop();

  const [roastPref, setRoastPref] = useState<'Light & Floral' | 'Medium Caramel' | 'Dark & Smoky'>('Light & Floral');
  const [flavorNote, setFlavorNote] = useState<'Jasmine & Peach' | 'Dark Chocolate & Truffle' | 'Saffron & Spiced Cardamom' | 'Bourbon Vanilla & Oak'>('Jasmine & Peach');
  const [intensity, setIntensity] = useState<number>(3); // 1 to 5
  const [timeOfDay, setTimeOfDay] = useState<'Morning Dawn' | 'Afternoon Focus' | 'Evening Vinyl Lounge'>('Morning Dawn');

  if (!isSommelierOpen) return null;

  // Compute recommendation based on selections
  const getRecommendation = () => {
    if (roastPref === 'Light & Floral' || flavorNote === 'Jasmine & Peach') {
      return {
        id: 3,
        name: 'Velvet Siphon Pour',
        category: 'Signature Brews',
        price: 14.0,
        description: 'Geisha variety brewed tableside via Japanese vacuum pot. Delicate floral jasmine aromatics, peach nectar finish, and crystalline clarity.',
        image_url: '/images/menu-latte.jpg',
        is_featured: true,
        badge: 'Sommelier Match: 99%',
        matchReason: 'Perfect pairing for light floral aromatics and refined morning clarity.',
      };
    }
    if (flavorNote === 'Saffron & Spiced Cardamom' || timeOfDay === 'Evening Vinyl Lounge') {
      return {
        id: 4,
        name: 'Saffron Golden Latte',
        category: 'Signature Brews',
        price: 9.5,
        description: 'Kashmiri saffron, raw honeycomb, cardamom-spiced espresso and micro-foamed organic almond cream.',
        image_url: '/images/menu-latte.jpg',
        is_featured: false,
        badge: 'Sommelier Match: 98%',
        matchReason: 'Warm ceremonial spice notes crafted specifically for unhurried evening relaxation.',
      };
    }
    if (roastPref === 'Dark & Smoky' || flavorNote === 'Dark Chocolate & Truffle') {
      return {
        id: 2,
        name: 'Truffle Smoked Cortado',
        category: 'Espresso',
        price: 8.0,
        description: 'Equal parts ristretto and silky steamed oat milk, infused with black winter truffle and smoked sea salt.',
        image_url: '/images/menu-espresso.jpg',
        is_featured: false,
        badge: 'Sommelier Match: 97%',
        matchReason: 'Bold, deep extraction with savoury undertones and dense crema.',
      };
    }
    return {
      id: 6,
      name: '24-Hour Kyoto Slow Drip',
      category: 'Cold & Iced',
      price: 11.0,
      description: 'Cold filtered water dripped drop-by-drop through dark roasted Sumatran beans for a syrupy, liqueur-like body.',
      image_url: '/images/menu-coldbrew.jpg',
      is_featured: true,
      badge: 'Sommelier Match: 96%',
      matchReason: 'Unmatched velvety texture with intense chocolate complexity.',
    };
  };

  const rec = getRecommendation();

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[88] bg-[#0d0a07]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={() => setIsSommelierOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#14100b] border border-[#c9a25e]/40 shadow-[0_25px_70px_rgba(0,0,0,0.8)] p-6 sm:p-10 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close */}
          <button
            onClick={() => setIsSommelierOpen(false)}
            className="absolute top-5 right-5 text-[#f3ead9]/50 hover:text-[#e8c98a] p-2 transition"
            aria-label="Close sommelier"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full border border-[#c9a25e]/40 flex items-center justify-center bg-[#c9a25e]/10 mx-auto mb-3 text-[#c9a25e]">
              <Compass size={24} />
            </div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a25e] mb-1">Maison Noir Interactive Sommelier</p>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#faf5ea]">Discover Your <em className="gold-text">Signature Pour</em></h3>
            <p className="mt-2 text-xs text-[#f3ead9]/65 font-light">
              Adjust your sensory preferences below to reveal your bespoke cup match.
            </p>
          </div>

          {/* Sensory Dials */}
          <div className="mt-8 space-y-6">
            {/* 1. Roast Preference */}
            <div>
              <label className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90 mb-2.5">
                <Flame size={14} /> 1. Roast Profile
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {(['Light & Floral', 'Medium Caramel', 'Dark & Smoky'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoastPref(r)}
                    className={`py-2.5 px-3 text-xs border text-center transition ${
                      roastPref === r
                        ? 'border-[#c9a25e] bg-[#c9a25e]/15 text-[#faf5ea] font-medium'
                        : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Flavor Notes */}
            <div>
              <label className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90 mb-2.5">
                <Sparkles size={14} /> 2. Dominant Aromatics
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {([
                  'Jasmine & Peach',
                  'Dark Chocolate & Truffle',
                  'Saffron & Spiced Cardamom',
                  'Bourbon Vanilla & Oak',
                ] as const).map((note) => (
                  <button
                    key={note}
                    onClick={() => setFlavorNote(note)}
                    className={`py-2.5 px-3 text-xs border text-left flex items-center justify-between transition ${
                      flavorNote === note
                        ? 'border-[#c9a25e] bg-[#c9a25e]/15 text-[#faf5ea] font-medium'
                        : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/50'
                    }`}
                  >
                    <span>{note}</span>
                    {flavorNote === note && <CheckCircle2 size={14} className="text-[#c9a25e]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Intensity Slider / Meter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90">
                  <Droplets size={14} /> 3. Body & Extraction Intensity
                </label>
                <span className="text-xs gold-text font-serif">Level {intensity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-[#c9a25e] cursor-pointer bg-[#0d0a07]"
              />
              <div className="flex justify-between text-[10px] text-[#f3ead9]/40 tracking-wider uppercase mt-1">
                <span>Delicate & Crisp</span>
                <span>Balanced</span>
                <span>Deep & Syrupy</span>
              </div>
            </div>

            {/* 4. Time of Day */}
            <div>
              <label className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90 mb-2.5">
                <Sun size={14} /> 4. Setting & Mood
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {(['Morning Dawn', 'Afternoon Focus', 'Evening Vinyl Lounge'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeOfDay(t)}
                    className={`py-2.5 px-3 text-xs border text-center transition ${
                      timeOfDay === t
                        ? 'border-[#c9a25e] bg-[#c9a25e]/15 text-[#faf5ea] font-medium'
                        : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Match Card Result */}
          <div className="mt-8 p-5 bg-[#0d0a07] border border-[#c9a25e]/40 relative">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img
                src={rec.image_url}
                alt={rec.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover shrink-0 border border-[#c9a25e]/30"
              />
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block bg-[#c9a25e] text-[#0d0a07] text-[9px] tracking-[0.25em] uppercase px-2.5 py-0.5 font-semibold mb-1">
                  {rec.badge}
                </span>
                <h4 className="font-serif text-2xl text-[#faf5ea]">{rec.name}</h4>
                <p className="text-xs gold-text font-serif mt-0.5">{formatPrice(rec.price)}</p>
                <p className="text-xs text-[#f3ead9]/65 font-light mt-1.5 line-clamp-2 leading-relaxed">
                  {rec.matchReason}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c9a25e]/20 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  addToCart(rec as MenuItem);
                  setIsSommelierOpen(false);
                }}
                className="flex-1 py-3 bg-[#c9a25e] text-[#0d0a07] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#e8c98a] transition flex items-center justify-center gap-1.5"
              >
                <span>Add Recommended Pour to Tray</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  setSelectedItemForDetail(rec as MenuItem);
                  setIsSommelierOpen(false);
                }}
                className="px-4 py-3 border border-[#c9a25e]/40 text-[#e8c98a] text-xs tracking-[0.18em] uppercase hover:bg-[#c9a25e]/10 transition"
              >
                Inspect Dial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

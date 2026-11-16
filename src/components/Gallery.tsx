import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Expand, ChevronLeft, ChevronRight, Camera, Sparkles, Eye } from 'lucide-react';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    alt: 'The Grand Velvet Salon',
    category: 'Salon',
    subtitle: 'Plush velvet banquettes & candlelit chandeliers in Mayfair',
    curation: 'Mayfair Atelier · Zone I'
  },
  {
    src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
    alt: 'Signature 24k Gold Crema Art',
    category: 'Barista Art',
    subtitle: 'Triple-origin ristretto crowned with edible 24k gold leaf flakes',
    curation: 'Barista Reserve'
  },
  {
    src: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1200&q=85',
    alt: 'Tableside Siphon & Cezve Rituals',
    category: 'Slow Bar',
    subtitle: 'Japanese vacuum pot extraction over glowing halogen flame',
    curation: 'Ceremonial Bar'
  },
  {
    src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85',
    alt: 'Dawn Laminated Patisserie',
    category: 'Patisserie',
    subtitle: 'Artisanal 72-layer French croissants baked fresh every morning',
    curation: 'Dawn Bakery'
  },
  {
    src: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1200&q=85',
    alt: 'Micro-Foamed Saffron Cappuccino',
    category: 'Barista Art',
    subtitle: 'Kashmiri saffron threads infused into silky organic oat velvet',
    curation: 'Specialty Latte'
  },
  {
    src: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85',
    alt: 'Evening Cellar Tasting Flights',
    category: 'Salon',
    subtitle: 'Vintage vinyl jazz salon & rare cold drip tasting flights',
    curation: 'The Cellar Lounge'
  },
  {
    src: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=1200&q=85',
    alt: 'Single-Origin 9-Bar Extraction',
    category: 'Slow Bar',
    subtitle: 'High-elevation Ethiopian Geisha pulled on custom lever machine',
    curation: 'Espresso Bar'
  },
  {
    src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    alt: 'Valrhona Chocolate & Pistachio Tarts',
    category: 'Patisserie',
    subtitle: 'Sicilian pistachio ganache & dark Grand Cru Valrhona chocolate',
    curation: 'Haute Confection'
  },
];

const galleryCategories = ['All', 'Salon', 'Barista Art', 'Slow Bar', 'Patisserie'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = activeCategory === 'All'
    ? photos
    : photos.filter((p) => p.category === activeCategory);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  return (
    <section id="gallery" className="bg-[#0d0a07] py-24 md:py-36 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#c9a25e]/25 pb-8">
          <div>
            <p className="text-[11px] tracking-[0.45em] uppercase text-[#c9a25e] mb-3 font-medium">Visual Atmosphere</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea]">
              Step Inside <em className="gold-text">the Glow</em>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#f3ead9]/65 font-light">
              An architectural and culinary tour of our Mayfair salon, Slow Bar ceremonies, and dawn patisserie.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-widest uppercase border transition font-medium ${
                  activeCategory === cat
                    ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] shadow-[0_4px_15px_rgba(201,162,94,0.3)]'
                    : 'border-[#c9a25e]/25 text-[#f3ead9]/70 hover:border-[#c9a25e] hover:text-[#e8c98a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((p, i) => (
              <motion.button
                key={p.alt}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxIndex(i)}
                className="group relative overflow-hidden text-left h-80 sm:h-96 border border-[#c9a25e]/30 hover:border-[#c9a25e] transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.6s] ease-out"
                />
                
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07] via-[#0d0a07]/30 to-transparent opacity-85 group-hover:opacity-90 transition" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 bg-[#0d0a07]/80 backdrop-blur border border-[#c9a25e]/40 text-[#c9a25e] font-medium">
                    {p.curation}
                  </span>
                </div>

                {/* Bottom Content Card */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#e8c98a] block font-medium">
                      {p.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-[#faf5ea] leading-tight group-hover:text-[#e8c98a] transition">
                      {p.alt}
                    </h3>
                    <p className="text-[11px] text-[#f3ead9]/60 font-light line-clamp-1">
                      {p.subtitle}
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full border border-[#c9a25e]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-[#0d0a07]/80 backdrop-blur shrink-0 ml-2 shadow-lg">
                    <Expand size={15} className="text-[#e8c98a]" />
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[95] bg-[#0d0a07]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10 select-none"
          >
            {/* Top Toolbar */}
            <div className="absolute top-6 inset-x-6 sm:inset-x-10 flex items-center justify-between z-20">
              <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#c9a25e]">
                <Camera size={18} />
                <span>{filteredPhotos[lightboxIndex].category} • {filteredPhotos[lightboxIndex].curation}</span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="text-[#e8c98a] p-2.5 border border-[#c9a25e]/40 hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Previous Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#c9a25e]/40 bg-[#0d0a07]/80 hover:bg-[#c9a25e] hover:text-[#0d0a07] text-[#e8c98a] transition flex items-center justify-center shadow-2xl"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#c9a25e]/40 bg-[#0d0a07]/80 hover:bg-[#c9a25e] hover:text-[#0d0a07] text-[#e8c98a] transition flex items-center justify-center shadow-2xl"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>

            {/* Center High-Res Photo Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[82vh] overflow-hidden border-2 border-[#c9a25e]/60 shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
            >
              <img
                src={filteredPhotos[lightboxIndex].src}
                alt={filteredPhotos[lightboxIndex].alt}
                className="w-full h-full max-h-[75vh] object-contain bg-black"
              />
              <div className="p-5 bg-[#0d0a07] border-t border-[#c9a25e]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-2xl text-[#faf5ea]">
                    {filteredPhotos[lightboxIndex].alt}
                  </h3>
                  <p className="text-xs text-[#f3ead9]/70 font-light mt-0.5">
                    {filteredPhotos[lightboxIndex].subtitle}
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a25e] font-mono">
                  EXHIBITION {lightboxIndex + 1} OF {filteredPhotos.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

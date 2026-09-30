import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Expand, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const photos = [
  { src: '/images/gallery-1.jpg', alt: 'The Grand Velvet Salon', category: 'Salon' },
  { src: '/images/gallery-2.jpg', alt: 'Signature 24k Gold Crema Art', category: 'Barista Art' },
  { src: '/images/gallery-3.jpg', alt: 'Tableside Siphon & Cezve Rituals', category: 'Slow Bar' },
  { src: '/images/gallery-4.jpg', alt: 'Dawn Laminated Patisserie', category: 'Patisserie' },
  { src: '/images/menu-latte.jpg', alt: 'Micro-Foamed Saffron Cappuccino', category: 'Barista Art' },
  { src: '/images/experience.jpg', alt: 'Evening Cellar Tasting Flights', category: 'Salon' },
  { src: '/images/menu-espresso.jpg', alt: 'Single-Origin 9-Bar Extraction', category: 'Slow Bar' },
  { src: '/images/menu-pastry.jpg', alt: 'Valrhona Chocolate Croissant & Tarts', category: 'Patisserie' },
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
    <section id="gallery" className="bg-[#0d0a07] py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#c9a25e]/20 pb-8">
          <div>
            <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-3">Visual Atmosphere</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea]">
              Step Inside <em className="gold-text">the Glow</em>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-wider uppercase border transition ${
                  activeCategory === cat
                    ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-medium'
                    : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/50 hover:text-[#e8c98a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((p, i) => (
              <motion.button
                key={p.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxIndex(i)}
                className="group relative overflow-hidden text-left h-72 sm:h-80 border border-[#c9a25e]/20"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.4s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07]/90 via-[#0d0a07]/20 to-transparent opacity-80 group-hover:opacity-95 transition" />

                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e] block mb-1">
                      {p.category}
                    </span>
                    <p className="font-serif text-lg text-[#faf5ea] leading-snug">{p.alt}</p>
                  </div>
                  <span className="w-9 h-9 rounded-full border border-[#e8c98a]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-[#0d0a07]/60 backdrop-blur shrink-0 ml-2">
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
            className="fixed inset-0 z-[95] bg-[#0d0a07]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
          >
            {/* Top Toolbar */}
            <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20">
              <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#c9a25e]">
                <Camera size={16} />
                <span>{filteredPhotos[lightboxIndex].category} • {filteredPhotos[lightboxIndex].alt}</span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="text-[#e8c98a] p-2 border border-[#c9a25e]/40 hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#c9a25e]/40 bg-[#0d0a07]/80 flex items-center justify-center text-[#e8c98a] hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
              aria-label="Previous photograph"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-[#c9a25e]/40 bg-[#0d0a07]/80 flex items-center justify-center text-[#e8c98a] hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
              aria-label="Next photograph"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Lightbox Image */}
            <div
              className="relative max-h-[82vh] max-w-4xl w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={filteredPhotos[lightboxIndex].src}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={filteredPhotos[lightboxIndex].src}
                alt={filteredPhotos[lightboxIndex].alt}
                className="max-h-[75vh] max-w-full object-contain border border-[#c9a25e]/40 shadow-2xl"
              />

              {/* Caption & Counter */}
              <div className="mt-4 flex items-center justify-between w-full text-xs text-[#f3ead9]/70 px-2">
                <p className="font-serif text-lg text-[#faf5ea]">{filteredPhotos[lightboxIndex].alt}</p>
                <span className="font-mono text-[#c9a25e]">
                  {lightboxIndex + 1} / {filteredPhotos.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Flame, HandHeart, Globe2, Sparkles } from 'lucide-react';
import RoasterTelemetry from './RoasterTelemetry';

const stats = [
  { value: '28', label: 'Years of Craft' },
  { value: '14', label: 'Single Origins' },
  { value: '9', label: 'Master Baristas' },
  { value: '120k', label: 'Cups Poured Yearly' },
];

const pillars = [
  {
    icon: Flame,
    title: 'Roasted at Dawn',
    text: 'Every single lot is roasted in our 1928 cast-iron drum roaster before sunrise, so no bean served is ever more than 24 hours off roast.',
  },
  {
    icon: Globe2,
    title: 'Direct-Trade Origins',
    text: 'We buy from fourteen multi-generation family estates across Ethiopia, Colombia, Guatemala and Sumatra - paying 2x fair-trade premiums.',
  },
  {
    icon: HandHeart,
    title: 'Poured with Ritual',
    text: 'Slow bars, Japanese siphon brewing and tableside ceremonies turn each cup into an unhurried performance of aroma, temperature, and craft.',
  },
];

export default function Story() {
  return (
    <section id="story" className="relative bg-[#0d0a07] py-24 md:py-36 overflow-hidden">
      <span className="pointer-events-none select-none absolute -top-6 left-1/2 -translate-x-1/2 font-serif italic text-[22vw] md:text-[14rem] leading-none text-[#c9a25e]/[0.04] whitespace-nowrap">
        Heritage
      </span>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left Column: Visuals with floating accents */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative rounded-sm overflow-hidden border border-[#c9a25e]/20">
              <img
                src="/images/story.jpg"
                alt="Barista pouring latte art"
                className="w-full h-[480px] md:h-[580px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07]/80 via-transparent to-transparent" />
            </div>

            {/* Floating Bean Photo */}
            <div className="absolute -bottom-8 -right-2 sm:right-6 md:-right-6 w-44 sm:w-56 border-4 border-[#0d0a07] shadow-2xl overflow-hidden animate-float-slow">
              <img
                src="/images/story-beans.jpg"
                alt="Fresh roasted coffee beans"
                className="w-full h-40 sm:h-52 object-cover"
              />
            </div>

            {/* Roastery Seal */}
            <div className="absolute -top-5 -left-2 sm:left-6 bg-[#c9a25e] text-[#0d0a07] px-5 py-3 shadow-2xl">
              <p className="font-serif text-3xl leading-none font-bold">1998</p>
              <p className="text-[10px] tracking-[0.3em] uppercase mt-1">Est. Roastery</p>
            </div>
          </motion.div>

          {/* Right Column: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-4">Our Story</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-[#faf5ea]">
              A Century-Old Room,<br />
              <em className="gold-text">Rebuilt Around the Bean</em>
            </h2>

            <p className="mt-6 text-[#f3ead9]/75 font-light leading-relaxed text-base md:text-lg">
              Maison Noir began in 1998 within the arched stone cellars of an Old Roastery spice merchant. Today, it stands as the city's benchmark for bespoke coffee luxury. Velvet booths, brass slow-bars and the warm aroma of our dawn roast create a haven where every pour is honored as an art form.
            </p>

            <div className="mt-8 space-y-6">
              {pillars.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <span className="shrink-0 w-12 h-12 rounded-full border border-[#c9a25e]/40 flex items-center justify-center bg-[#c9a25e]/10">
                    <p.icon size={20} className="text-[#c9a25e]" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-[#faf5ea]">{p.title}</h3>
                    <p className="text-sm text-[#f3ead9]/65 font-light leading-relaxed mt-1">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Roaster Telemetry & Bean Atlas Widget */}
        <RoasterTelemetry />

        {/* Heritage Stats Strip */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 border-y border-[#c9a25e]/20 divide-x divide-[#c9a25e]/20">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="py-8 md:py-10 text-center px-2"
            >
              <p className="font-serif text-4xl md:text-5xl gold-text">{s.value}</p>
              <p className="mt-2 text-[11px] tracking-[0.3em] uppercase text-[#f3ead9]/70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

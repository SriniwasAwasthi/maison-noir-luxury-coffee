import { motion } from 'framer-motion';
import { Bean, CupSoda, CakeSlice, Music4, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const steps = [
  {
    icon: Bean,
    num: '01',
    title: 'The Origin Flight',
    text: 'Three rare single origins - Ethiopia Yirgacheffe, Colombia Huila, Sumatra Mandheling - poured side by side with cupping notes from your barista.',
  },
  {
    icon: CupSoda,
    num: '02',
    title: 'The Slow Bar Ritual',
    text: 'Choose your extraction method: Japanese siphon vacuum, ceramic V60, Chemex or antique Turkish cezve. Brewed tableside over seven unhurried minutes.',
  },
  {
    icon: CakeSlice,
    num: '03',
    title: 'The Golden Pairing',
    text: 'Warm almond croissant, Valrhona dark-chocolate fondant or saffron cardamom bun - matched specifically to your cup’s acidity by our patisserie chef.',
  },
  {
    icon: Music4,
    num: '04',
    title: 'The Vinyl Hour',
    text: 'Every evening from 7 PM, vintage jazz vinyl, candlelight and complimentary 24-hour Kyoto cold drip affogato tastings in the cellar lounge.',
  },
];

export default function Experience() {
  const { formatPrice, setIsSommelierOpen } = useShop();

  return (
    <section id="experience" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/experience.jpg" alt="Coffee tasting" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d0a07]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a07] via-transparent to-[#0d0a07]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-4">The Sensory Journey</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea]">
            An Evening at <em className="gold-text">Maison Noir</em>
          </h2>
          <p className="mt-4 text-[#f3ead9]/70 font-light leading-relaxed">
            Not merely coffee - an immersive four-act tasting ritual. Experience the entire journey tableside or savor individual acts at the slow bar.
          </p>
        </div>

        {/* 4-Step Journey Grid */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              className="group relative bg-[#14100b]/85 backdrop-blur border border-[#c9a25e]/20 hover:border-[#c9a25e]/60 p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(201,162,94,0.15)] flex flex-col justify-between"
            >
              <div>
                <span className="font-serif italic text-6xl text-[#c9a25e]/15 group-hover:text-[#c9a25e]/35 transition">
                  {s.num}
                </span>
                <span className="mt-4 flex w-12 h-12 rounded-full bg-[#c9a25e]/10 border border-[#c9a25e]/30 items-center justify-center">
                  <s.icon size={20} className="text-[#e8c98a]" />
                </span>
                <h3 className="mt-5 font-serif text-2xl text-[#faf5ea]">{s.title}</h3>
                <p className="mt-3 text-xs sm:text-sm font-light text-[#f3ead9]/65 leading-relaxed">{s.text}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#c9a25e]/15 text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/70 flex items-center justify-between">
                <span>Act {s.num}</span>
                <span className="opacity-0 group-hover:opacity-100 transition">Tableside Service</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Experience Actions */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a
            href="#reserve"
            className="w-full sm:w-auto px-10 py-4 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.24em] uppercase font-medium hover:bg-[#e8c98a] transition-all duration-300 shadow-[0_10px_35px_rgba(201,162,94,0.3)]"
          >
            Book the Full Tasting Journey • {formatPrice(48)} / guest
          </a>

          <button
            onClick={() => setIsSommelierOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-[#14100b]/80 border border-[#c9a25e]/40 text-[#e8c98a] text-[12px] tracking-[0.22em] uppercase hover:bg-[#c9a25e]/15 transition flex items-center justify-center gap-2"
          >
            <Compass size={15} /> Find Your Custom Flight
          </button>
        </div>
      </div>
    </section>
  );
}

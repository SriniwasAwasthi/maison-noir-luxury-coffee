import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Menu as MenuIcon, X, MapPin, Clock, Phone, ShoppingBag, Compass, ChevronDown, Sparkles } from 'lucide-react';
import { useShop, Currency } from '../context/ShopContext';

const links = [
  { label: 'Story', href: '#story', id: 'story' },
  { label: 'Menu', href: '#menu', id: 'menu' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Gallery', href: '#gallery', id: 'gallery' },
  { label: 'Reviews', href: '#reviews', id: 'reviews' },
  { label: 'Visit', href: '#visit', id: 'visit' },
];

const currencies: { code: Currency; label: string; symbol: string }[] = [
  { code: 'INR', label: 'INR (₹)', symbol: '₹' },
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { code: 'AED', label: 'AED (د.إ)', symbol: 'AED' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const { currency, setCurrency, cartCount, setIsCartOpen, setIsSommelierOpen } = useShop();

  // Scroll detection for navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ascending Section Scroll Spy with Glowing Active Indicator
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      const sectionElements = links.map((l) => ({
        id: l.id,
        el: document.getElementById(l.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const top = item.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <>
      {/* Top Banner with operating hours and Rupees/Currency Switcher at Top Right */}
      <div className="hidden md:flex fixed top-0 inset-x-0 z-[60] items-center justify-between bg-[#0d0a07]/95 backdrop-blur border-b border-[#c9a25e]/20 text-[11px] tracking-[0.18em] uppercase text-[#c9a25e]/90 py-2 px-8">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2">
            <MapPin size={12} /> 128 Ember Lane, Old Roastery District
          </span>
          <span className="hidden lg:flex items-center gap-2">
            <Clock size={12} /> Mon - Sun, 7:00 AM - 11:00 PM
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Phone size={12} /> +1 (415) 555-0182
          </span>

          {/* Currency Switcher on Top Right */}
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 text-[#e8c98a] hover:text-[#faf5ea] transition bg-[#14100b] px-3 py-1 border border-[#c9a25e]/40 shadow-[0_0_10px_rgba(201,162,94,0.15)] rounded-xs"
              aria-label="Change currency"
            >
              <span className="font-semibold">{currency}</span>
              <span className="text-[#c9a25e]">
                ({currencies.find((c) => c.code === currency)?.symbol})
              </span>
              <ChevronDown size={11} />
            </button>

            {currencyOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-32 bg-[#14100b] border border-[#c9a25e]/50 shadow-2xl py-1 z-[70] backdrop-blur-xl"
                onMouseLeave={() => setCurrencyOpen(false)}
              >
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-[11px] tracking-wider transition flex items-center justify-between ${
                      currency === c.code
                        ? 'bg-[#c9a25e] text-[#0d0a07] font-bold shadow-[0_0_10px_rgba(201,162,94,0.4)]'
                        : 'text-[#f3ead9]/80 hover:bg-[#c9a25e]/15 hover:text-[#e8c98a]'
                    }`}
                  >
                    <span>{c.label}</span>
                    {currency === c.code && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Floating Header */}
      <header
        className={
          'fixed inset-x-0 top-0 md:top-[33px] z-50 transition-all duration-500 ' +
          (scrolled
            ? 'bg-[#0d0a07]/92 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-b border-[#c9a25e]/20'
            : 'bg-transparent')
        }
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3 group">
            <span className="w-11 h-11 rounded-full border border-[#c9a25e]/50 flex items-center justify-center bg-[#14100b]/70 group-hover:bg-[#c9a25e]/15 transition shadow-[0_0_15px_rgba(201,162,94,0.15)]">
              <Coffee size={20} className="text-[#c9a25e]" />
            </span>
            <span className="leading-none">
              <span className="block font-serif text-2xl tracking-wide text-[#faf5ea]">
                MAISON <span className="gold-text italic font-bold">NOIR</span>
              </span>
              <span className="block text-[10px] tracking-[0.42em] uppercase text-[#c9a25e]/80 mt-1">
                Cafe • Roastery • Bar
              </span>
            </span>
          </a>

          {/* Nav Links with Glowing Active Section Highlighting */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {links.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`text-[12px] tracking-[0.22em] uppercase px-3 py-1.5 transition-all duration-300 relative rounded-sm ${
                    isActive
                      ? 'text-[#faf5ea] font-semibold bg-[#c9a25e]/20 border border-[#c9a25e] shadow-[0_0_16px_rgba(201,162,94,0.45)]'
                      : 'text-[#f3ead9]/75 hover:text-[#e8c98a] border border-transparent hover:border-[#c9a25e]/30'
                  }`}
                >
                  <span className={isActive ? 'gold-text' : ''}>{l.label}</span>
                </a>
              );
            })}

            {/* Sommelier Modal Trigger */}
            <button
              onClick={() => setIsSommelierOpen(true)}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#e8c98a] border border-[#c9a25e]/40 px-3.5 py-2 hover:bg-[#c9a25e]/15 transition shadow-[0_0_12px_rgba(201,162,94,0.15)]"
            >
              <Compass size={14} className="text-[#c9a25e]" />
              <span>Sommelier</span>
            </button>

            {/* Tasting Tray Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2.5 text-[#e8c98a] hover:text-[#faf5ea] transition bg-[#14100b]/80 border border-[#c9a25e]/40 shadow-[0_0_12px_rgba(201,162,94,0.15)]"
              aria-label="View tasting tray"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c9a25e] text-[#0d0a07] text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_#e8c98a]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Reserve CTA */}
            <a
              href="#reserve"
              className="px-5 py-2.5 text-[11px] tracking-[0.24em] uppercase border border-[#c9a25e]/60 bg-[#c9a25e] text-[#0d0a07] font-medium hover:bg-[#e8c98a] transition-all duration-300 shadow-[0_4px_20px_rgba(201,162,94,0.3)]"
            >
              Reserve Table
            </a>
          </nav>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {/* Mobile Currency Pill */}
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="px-2 py-1 bg-[#14100b] border border-[#c9a25e]/40 text-[#e8c98a] text-[10px] font-bold"
            >
              {currency} ({currencies.find((c) => c.code === currency)?.symbol})
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#e8c98a] border border-[#c9a25e]/30"
              aria-label="View tasting tray"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c9a25e] text-[#0d0a07] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setOpen(true)}
              className="text-[#e8c98a] p-2"
              aria-label="Open menu"
            >
              <MenuIcon size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer with Active Glow Section links */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#0d0a07]/98 backdrop-blur-2xl flex flex-col justify-between p-6"
          >
            <div className="flex items-center justify-between h-[60px]">
              <span className="font-serif text-2xl text-[#faf5ea]">
                MAISON <span className="gold-text italic">NOIR</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-[#e8c98a] p-2 border border-[#c9a25e]/30"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col items-center justify-center gap-3 py-6">
              {links.map((l, i) => {
                const isActive = activeSection === l.id;
                return (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className={`font-serif text-3xl py-1.5 px-6 rounded-sm transition ${
                      isActive
                        ? 'gold-text bg-[#c9a25e]/20 border border-[#c9a25e] shadow-[0_0_20px_rgba(201,162,94,0.4)]'
                        : 'text-[#f3ead9] hover:text-[#e8c98a]'
                    }`}
                  >
                    {l.label}
                  </motion.a>
                );
              })}

              <motion.button
                onClick={() => {
                  setOpen(false);
                  setIsSommelierOpen(true);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 flex items-center gap-2 px-8 py-3 text-xs tracking-[0.22em] uppercase border border-[#c9a25e] text-[#e8c98a]"
              >
                <Compass size={16} /> Flavor Sommelier
              </motion.button>

              <motion.a
                href="#reserve"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 px-10 py-3.5 text-[12px] tracking-[0.24em] uppercase bg-[#c9a25e] text-[#0d0a07] font-medium"
              >
                Reserve a Table
              </motion.a>
            </nav>

            <div className="text-center pt-4 border-t border-[#c9a25e]/20 space-y-3">
              <div className="flex justify-center flex-wrap gap-2">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`px-2.5 py-1 text-[11px] border ${
                      currency === c.code
                        ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-bold'
                        : 'border-[#c9a25e]/20 text-[#f3ead9]/60'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a25e]/70">
                128 Ember Lane • 7 AM to 11 PM
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

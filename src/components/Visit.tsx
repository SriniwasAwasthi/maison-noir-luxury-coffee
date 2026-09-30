import { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Send, Loader2, CheckCircle2, Instagram, Facebook, Twitter, Copy, Check } from 'lucide-react';

const hours = [
  ['Monday - Thursday', '7:00 AM - 10:00 PM'],
  ['Friday - Saturday', '7:00 AM - 11:00 PM'],
  ['Sunday', '8:00 AM - 9:00 PM'],
  ['Vinyl Hour (Daily)', '7:00 PM - 9:00 PM'],
];

export default function Visit() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Subscription failed');
      setStatus('ok');
      setMsg(data.message === 'Already subscribed' ? 'You are already on the list - see you soon.' : 'Welcome to the inner circle. First pour is on us.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('128 Ember Lane, Old Roastery District');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyHandle = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('@maisonnoir.cafe');
    setCopiedSocial(true);
    setTimeout(() => setCopiedSocial(false), 2000);
  };

  return (
    <section id="visit" className="bg-[#0d0a07] pt-24 md:pt-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-4">Location & Hours</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea]">
              In the Heart of the <em className="gold-text">Old Roastery District</em>
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-[#c9a25e] shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-[#faf5ea] font-serif text-lg">128 Ember Lane, Old Roastery District</p>
                    <button
                      onClick={copyAddress}
                      className="text-[#c9a25e] hover:text-[#e8c98a] text-[10px] uppercase tracking-wider flex items-center gap-1 border border-[#c9a25e]/30 px-2 py-0.5"
                    >
                      {copiedAddress ? <Check size={11} /> : <Copy size={11} />}
                      {copiedAddress ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-[#f3ead9]/60 font-light mt-0.5">
                    Two doors from the brass clock tower • Valet parking after 6 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone size={20} className="text-[#c9a25e] shrink-0 mt-1" />
                <div>
                  <a href="tel:+14155550182" className="text-[#faf5ea] font-serif text-lg hover:text-[#e8c98a] transition">
                    +1 (415) 555-0182
                  </a>
                  <p className="text-xs text-[#f3ead9]/60 font-light mt-0.5">
                    Reservations, sommelier flights and private cellar events
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail size={20} className="text-[#c9a25e] shrink-0 mt-1" />
                <div>
                  <a href="mailto:bonjour@maisonnoir.cafe" className="text-[#faf5ea] font-serif text-lg hover:text-[#e8c98a] transition">
                    bonjour@maisonnoir.cafe
                  </a>
                  <p className="text-xs text-[#f3ead9]/60 font-light mt-0.5">
                    We reply promptly, 7 AM - 11 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours Table */}
            <div className="mt-8 border border-[#c9a25e]/25 bg-[#14100b]/70 p-6">
              <p className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#c9a25e] mb-4">
                <Clock size={14} /> Hours of Pour & Siphon
              </p>
              <div className="space-y-3">
                {hours.map(([d, h]) => (
                  <div key={d} className="flex items-baseline justify-between gap-4 text-xs sm:text-sm">
                    <span className="text-[#f3ead9]/80">{d}</span>
                    <span className="flex-1 border-b border-dotted border-[#c9a25e]/25 -translate-y-1" />
                    <span className="text-[#e8c98a] font-light">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Map & Newsletter */}
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden border border-[#c9a25e]/25 h-72 sm:h-80">
              <iframe
                title="Maison Noir location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4312%2C37.7735%2C-122.4112%2C37.7835&layer=mapnik&marker=37.7785%2C-122.4212"
                className="w-full h-full grayscale invert-[0.92] contrast-[0.9] opacity-90"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-[#0d0a07]/90 border border-[#c9a25e]/40 px-5 py-3 backdrop-blur">
                <p className="font-serif text-lg text-[#faf5ea]">Maison Noir</p>
                <p className="text-[10px] text-[#c9a25e] tracking-[0.2em] uppercase">128 Ember Lane</p>
              </div>
            </div>

            <div className="border border-[#c9a25e]/25 bg-gradient-to-br from-[#1e1610] to-[#14100b] p-6 sm:p-8">
              <h3 className="font-serif text-3xl text-[#faf5ea]">
                Join the <em className="gold-text">Inner Circle</em>
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#f3ead9]/65 font-light leading-relaxed">
                First taste of rare seasonal micro-lots, private vinyl nights and invitation-only tastings. One dispatch a month, never more.
              </p>

              <form onSubmit={subscribe} className="mt-5 flex flex-col sm:flex-row gap-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your private email address"
                  type="email"
                  className="flex-1 bg-[#0d0a07] border border-[#c9a25e]/25 px-4 py-3.5 text-xs outline-none focus:border-[#c9a25e] transition placeholder:text-[#f3ead9]/30 text-[#f3ead9]"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-7 py-3.5 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.22em] uppercase font-medium hover:bg-[#e8c98a] transition disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {status === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  <span>Subscribe</span>
                </button>
              </form>

              {msg && (
                <p className={`mt-3 text-xs flex items-center gap-2 ${status === 'ok' ? 'text-[#9ed9a3]' : 'text-[#e8a08a]'}`}>
                  {status === 'ok' && <CheckCircle2 size={15} />} {msg}
                </p>
              )}

              <div className="mt-6 flex items-center gap-3">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button
                    key={i}
                    onClick={copyHandle}
                    aria-label="Social handle copy"
                    className="w-10 h-10 rounded-full border border-[#c9a25e]/35 flex items-center justify-center text-[#e8c98a] hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                  >
                    <Icon size={16} />
                  </button>
                ))}
                <span className="ml-2 text-xs tracking-[0.25em] uppercase text-[#f3ead9]/50">
                  {copiedSocial ? 'Handle copied to clipboard!' : '@maisonnoir.cafe'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#c9a25e]/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full border border-[#c9a25e]/50 flex items-center justify-center bg-[#14100b]">
              <span className="font-serif italic text-lg gold-text font-bold">N</span>
            </span>
            <div className="leading-tight">
              <p className="font-serif text-lg text-[#faf5ea]">MAISON <span className="gold-text italic">NOIR</span></p>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a25e]/70">Cafe • Roastery • Bar</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-[11px] tracking-[0.22em] uppercase text-[#f3ead9]/60">
            <a href="#story" className="hover:text-[#e8c98a] transition">Story</a>
            <a href="#menu" className="hover:text-[#e8c98a] transition">Menu</a>
            <a href="#experience" className="hover:text-[#e8c98a] transition">Experience</a>
            <a href="#gallery" className="hover:text-[#e8c98a] transition">Gallery</a>
            <a href="#reserve" className="hover:text-[#e8c98a] transition">Reserve</a>
          </nav>

          <p className="text-xs text-[#f3ead9]/45 font-light">
            © 2026 Maison Noir. Crafted with crema and candlelight.
          </p>
        </div>
      </footer>
    </section>
  );
}

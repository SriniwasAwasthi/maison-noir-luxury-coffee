import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Loader2, CheckCircle2, Users, Clock, Sparkles, Copy, Check, Download, Armchair } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const timeSlots = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];

const seatingZones = [
  { id: 'salon', name: 'Velvet Salon', desc: 'Plush booths & low candlelight' },
  { id: 'slowbar', name: 'The Slow Bar', desc: 'Front-row view of siphon brewing' },
  { id: 'cellar', name: 'The Cellar Lounge', desc: 'Vintage vinyl & fireplace glow' },
  { id: 'courtyard', name: 'Courtyard Garden', desc: 'Heated lanterns & night air' },
];

type Conf = {
  id: number;
  name: string;
  guests: number;
  reservation_date: string;
  reservation_time: string;
  occasion?: string;
  zone?: string;
  siphonRitual?: boolean;
};

export default function Reservation() {
  const { formatPrice } = useShop();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    reservation_date: '',
    reservation_time: '18:30',
    occasion: 'Casual Visit',
    notes: '',
  });

  const [selectedZone, setSelectedZone] = useState('Velvet Salon');
  const [addSiphonRitual, setAddSiphonRitual] = useState(false);
  const [addPastryPairing, setAddPastryPairing] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Conf | null>(null);
  const [copied, setCopied] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.reservation_date || !form.reservation_time) {
      setError('Please complete name, email, date and time.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        guests: Number(form.guests),
        notes: `[Zone: ${selectedZone}] ${addSiphonRitual ? '[+Tableside Siphon Masterclass] ' : ''}${addPastryPairing ? '[+Chef Pastry Pairing] ' : ''}${form.notes}`.trim(),
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not complete your reservation');

      setConfirmation({
        ...data,
        zone: selectedZone,
        siphonRitual: addSiphonRitual,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyBookingDetails = () => {
    if (!confirmation) return;
    const text = `Maison Noir Reservation #MN-${String(confirmation.id).padStart(5, '0')}\nName: ${confirmation.name}\nGuests: ${confirmation.guests}\nDate: ${confirmation.reservation_date} at ${confirmation.reservation_time}\nZone: ${confirmation.zone || selectedZone}\nAddress: 128 Ember Lane, Old Roastery District`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCalendarFile = () => {
    if (!confirmation) return;
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Maison Noir//Coffee Reservation//EN
BEGIN:VEVENT
SUMMARY:Maison Noir Tasting Reservation
DESCRIPTION:Table reservation for ${confirmation.guests} guests in the ${confirmation.zone || selectedZone}.
LOCATION:128 Ember Lane, Old Roastery District
DTSTART:${confirmation.reservation_date.replace(/-/g, '')}T${confirmation.reservation_time.replace(':', '')}00
DURATION:PT2H
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Maison_Noir_Reservation_${confirmation.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputCls = 'w-full bg-[#0d0a07] border border-[#c9a25e]/25 px-4 py-3 text-xs text-[#f3ead9] outline-none focus:border-[#c9a25e] transition placeholder:text-[#f3ead9]/30';
  const labelCls = 'text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/85';

  return (
    <section id="reserve" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0d0a07]/90" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-5 gap-10 items-stretch">
        {/* Left Column info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2 flex flex-col justify-center"
        >
          <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-4">Table Service</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea] leading-tight">
            Your Table<br />is <em className="gold-text">Waiting</em>
          </h2>

          <p className="mt-5 text-[#f3ead9]/70 font-light leading-relaxed">
            Evenings fill quickly - especially vinyl hours and weekend siphon rituals. Reserve ahead and arrive to candlelight, warm crema and your bespoke flight prepared.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 border border-[#c9a25e]/20 bg-[#14100b]/70 p-4">
              <Users size={22} className="text-[#c9a25e] shrink-0" />
              <p className="text-xs sm:text-sm text-[#f3ead9]/70 font-light">
                Parties of 7+? Call <span className="text-[#e8c98a]">+1 (415) 555-0182</span> for the private spice cellar room.
              </p>
            </div>

            <div className="flex items-center gap-4 border border-[#c9a25e]/20 bg-[#14100b]/70 p-4">
              <Clock size={22} className="text-[#c9a25e] shrink-0" />
              <p className="text-xs sm:text-sm text-[#f3ead9]/70 font-light">
                Tables are held for 15 minutes past scheduled arrival time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column Reservation Form / Confirmation */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-3 bg-[#14100b]/95 backdrop-blur-xl border border-[#c9a25e]/30 p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        >
          {confirmation ? (
            /* Success State */
            <div className="text-center py-6">
              <CheckCircle2 size={56} className="mx-auto text-[#9ed9a3]" />
              <h3 className="mt-5 font-serif text-3xl sm:text-4xl text-[#faf5ea]">
                Reserved, {confirmation.name.split(' ')[0]}.
              </h3>
              <p className="mt-2 text-xs text-[#f3ead9]/70 font-light">
                Confirmation <span className="text-[#e8c98a] font-mono">#MN-{String(confirmation.id).padStart(5, '0')}</span> — a formal confirmation has been registered.
              </p>

              {/* Ticket Card */}
              <div className="mt-6 border border-[#c9a25e]/35 bg-[#0d0a07] p-6 text-left space-y-2">
                <div className="flex justify-between text-[10px] tracking-widest uppercase text-[#c9a25e]">
                  <span>RESERVATION PASS</span>
                  <span>{confirmation.zone || selectedZone}</span>
                </div>
                <p className="font-serif text-2xl text-[#faf5ea]">
                  {confirmation.guests} Guest{confirmation.guests > 1 ? 's' : ''} • {confirmation.reservation_date}
                </p>
                <p className="font-serif text-2xl gold-text">
                  {confirmation.reservation_time}
                </p>
                {confirmation.siphonRitual && (
                  <p className="text-xs text-[#e8c98a] flex items-center gap-1.5 pt-2 border-t border-[#c9a25e]/20">
                    <Sparkles size={13} /> Tableside Siphon Masterclass Included
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={copyBookingDetails}
                  className="flex-1 py-3 border border-[#c9a25e]/40 text-[#e8c98a] text-xs uppercase tracking-wider hover:bg-[#c9a25e]/10 transition flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied to Clipboard' : 'Copy Booking Details'}
                </button>

                <button
                  onClick={downloadCalendarFile}
                  className="flex-1 py-3 border border-[#c9a25e]/40 text-[#e8c98a] text-xs uppercase tracking-wider hover:bg-[#c9a25e]/10 transition flex items-center justify-center gap-2"
                >
                  <Download size={15} />
                  <span>Add to Calendar (.ics)</span>
                </button>
              </div>

              <div>
                <button
                  onClick={() => {
                    setConfirmation(null);
                    setForm({
                      name: '',
                      email: '',
                      phone: '',
                      guests: '2',
                      reservation_date: '',
                      reservation_time: '18:30',
                      occasion: 'Casual Visit',
                      notes: '',
                    });
                  }}
                  className="mt-6 text-xs tracking-widest uppercase text-[#f3ead9]/50 hover:text-[#e8c98a] transition underline underline-offset-4"
                >
                  Book Another Table
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Booking Form */
            <form onSubmit={submit} className="space-y-5">
              {/* Guest & Contact */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alexandra Moreau"
                    className={`${inputCls} mt-1.5`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`${inputCls} mt-1.5`}
                  />
                </div>
              </div>

              {/* Phone, Guests, Occasion */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (415)..."
                    className={`${inputCls} mt-1.5`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Guests *</label>
                  <select
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className={`${inputCls} mt-1.5`}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Occasion</label>
                  <select
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className={`${inputCls} mt-1.5`}
                  >
                    {[
                      'Casual Visit',
                      'Tasting Journey',
                      'Anniversary',
                      'Business Meeting',
                      'Birthday',
                      'Date Night',
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Zone Selector */}
              <div>
                <label className={labelCls}>Atmosphere & Seating Zone</label>
                <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {seatingZones.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setSelectedZone(z.name)}
                      className={`p-2.5 text-left border transition ${
                        selectedZone === z.name
                          ? 'border-[#c9a25e] bg-[#c9a25e]/15 text-[#faf5ea]'
                          : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/50'
                      }`}
                    >
                      <p className="text-[11px] font-medium tracking-wider">{z.name}</p>
                      <p className="text-[9px] text-[#f3ead9]/50 mt-0.5">{z.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time Slots */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date *</label>
                  <input
                    type="date"
                    min={today}
                    value={form.reservation_date}
                    onChange={(e) => setForm({ ...form, reservation_date: e.target.value })}
                    className={`${inputCls} mt-1.5`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Time Slot *</label>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {timeSlots.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setForm({ ...form, reservation_time: t })}
                        className={`px-2.5 py-1 text-[11px] border transition ${
                          form.reservation_time === t
                            ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-semibold'
                            : 'border-[#c9a25e]/20 text-[#f3ead9]/70 hover:border-[#c9a25e]/60'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* VIP Ritual Add-ons */}
              <div className="space-y-2 pt-1 border-t border-[#c9a25e]/15">
                <label className={labelCls}>Optional Tableside Enhancements</label>

                <div className="grid sm:grid-cols-2 gap-2">
                  <div
                    onClick={() => setAddSiphonRitual(!addSiphonRitual)}
                    className={`p-2.5 border cursor-pointer flex items-center justify-between transition ${
                      addSiphonRitual
                        ? 'border-[#c9a25e] bg-[#c9a25e]/15'
                        : 'border-[#c9a25e]/20 bg-[#0d0a07]/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-[#faf5ea]">Tableside Siphon Ritual</p>
                      <p className="text-[10px] text-[#f3ead9]/50">Vacuum pot masterclass</p>
                    </div>
                    <span className="text-xs gold-text font-serif">+{formatPrice(14)}</span>
                  </div>

                  <div
                    onClick={() => setAddPastryPairing(!addPastryPairing)}
                    className={`p-2.5 border cursor-pointer flex items-center justify-between transition ${
                      addPastryPairing
                        ? 'border-[#c9a25e] bg-[#c9a25e]/15'
                        : 'border-[#c9a25e]/20 bg-[#0d0a07]/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-[#faf5ea]">Chef Pastry Flight</p>
                      <p className="text-[10px] text-[#f3ead9]/50">3 warm signature pairings</p>
                    </div>
                    <span className="text-xs gold-text font-serif">+{formatPrice(12)}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className={labelCls}>Special Requests / Dietary Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Window booth, decaf tasting flight, candle for anniversary..."
                  className={`${inputCls} mt-1.5 resize-none`}
                />
              </div>

              {error && <p className="text-xs text-[#e8a08a]">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.24em] uppercase font-medium hover:bg-[#e8c98a] transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(201,162,94,0.3)]"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
                {submitting ? 'Confirming Reservation...' : 'Confirm Table Reservation'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Loader2, PenLine, X, CheckCircle2, Filter, Sparkles, Award } from 'lucide-react';

type Review = {
  id: number;
  name: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
};

function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= value ? 'fill-[#c9a25e] text-[#c9a25e]' : 'text-[#c9a25e]/30'}
        />
      ))}
    </span>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = ratingFilter === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === ratingFilter);

  useEffect(() => {
    if (filteredReviews.length < 2 || showForm) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % filteredReviews.length), 6500);
    return () => clearInterval(t);
  }, [filteredReviews.length, showForm]);

  const avg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    if (!form.name.trim() || !form.comment.trim()) {
      setFormError('Please share your name and a few words about your visit.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save your review');
      setSuccess('Thank you - your review is now part of our story.');
      setForm({ name: '', rating: 5, title: '', comment: '' });
      fetchReviews();
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const current = filteredReviews[index % (filteredReviews.length || 1)];

  return (
    <section id="reviews" className="relative bg-[#14100b] py-24 md:py-36 grain overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-4">Guest Book</p>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea]">
          Loved, <em className="gold-text">Loudly</em>
        </h2>

        {!loading && reviews.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-[#0d0a07] border border-[#c9a25e]/30 px-4 py-1.5">
              <Stars value={Math.round(avg)} size={16} />
              <span className="font-serif text-xl gold-text">{avg.toFixed(1)}</span>
              <span className="text-xs text-[#f3ead9]/50">• {reviews.length} Verified Entries</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => { setRatingFilter('all'); setIndex(0); }}
                className={`px-3 py-1 border transition uppercase tracking-wider text-[10px] ${
                  ratingFilter === 'all'
                    ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-semibold'
                    : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/40'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setRatingFilter(5); setIndex(0); }}
                className={`px-3 py-1 border transition uppercase tracking-wider text-[10px] ${
                  ratingFilter === 5
                    ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-semibold'
                    : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/40'
                }`}
              >
                5 Stars
              </button>
            </div>
          </div>
        )}

        {/* Testimonial Box */}
        <div className="mt-12 min-h-[300px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-[#c9a25e]">
              <Loader2 className="animate-spin" size={30} />
              <p className="text-xs tracking-[0.3em] uppercase text-[#f3ead9]/50">Opening the guest book...</p>
            </div>
          ) : !current ? (
            <p className="text-[#f3ead9]/60">No reviews found for this rating filter.</p>
          ) : (
            <div className="relative w-full">
              <Quote size={64} className="mx-auto text-[#c9a25e]/15 fill-[#c9a25e]/10 mb-2" />
              <AnimatePresence mode="wait">
                <motion.figure
                  key={current.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45 }}
                >
                  <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl leading-snug text-[#faf5ea] max-w-3xl mx-auto">
                    &ldquo;{current.comment}&rdquo;
                  </blockquote>

                  {current.title && (
                    <p className="mt-4 text-xs tracking-[0.25em] uppercase text-[#c9a25e] font-medium">
                      {current.title}
                    </p>
                  )}

                  <figcaption className="mt-3 flex items-center justify-center gap-3">
                    <Stars value={current.rating} />
                    <span className="text-sm text-[#f3ead9]/75 font-light">— {current.name}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              {filteredReviews.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIndex((index - 1 + filteredReviews.length) % filteredReviews.length)}
                    aria-label="Previous review"
                    className="w-10 h-10 rounded-full border border-[#c9a25e]/40 flex items-center justify-center text-[#e8c98a] hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs tracking-[0.3em] text-[#f3ead9]/50">
                    {String((index % filteredReviews.length) + 1).padStart(2, '0')} / {String(filteredReviews.length).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => setIndex((index + 1) % filteredReviews.length)}
                    aria-label="Next review"
                    className="w-10 h-10 rounded-full border border-[#c9a25e]/40 flex items-center justify-center text-[#e8c98a] hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 border border-[#c9a25e]/50 text-[#e8c98a] text-[12px] tracking-[0.24em] uppercase hover:bg-[#c9a25e] hover:text-[#0d0a07] transition shadow-[0_4px_20px_rgba(201,162,94,0.15)]"
        >
          <PenLine size={15} /> Write a Review
        </button>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#0d0a07]/90 backdrop-blur flex items-center justify-center p-5"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#14100b] border border-[#c9a25e]/40 p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-[#f3ead9]/50 hover:text-[#e8c98a]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h3 className="font-serif text-3xl text-[#faf5ea]">Share Your Experience</h3>
              <p className="text-xs text-[#f3ead9]/60 mt-1 font-light">Your words keep our roaster warm.</p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/80">Your Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sophia Laurent"
                    className="mt-1.5 w-full bg-[#0d0a07] border border-[#c9a25e]/25 px-4 py-3 text-xs outline-none focus:border-[#c9a25e] transition placeholder:text-[#f3ead9]/30 text-[#f3ead9]"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/80">Rating *</label>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setForm({ ...form, rating: s })}
                        aria-label={`${s} stars`}
                      >
                        <Star
                          size={24}
                          className={s <= form.rating ? 'fill-[#c9a25e] text-[#c9a25e]' : 'text-[#c9a25e]/30 hover:text-[#c9a25e]/60'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/80">Headline</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. The tableside siphon is unmatched"
                    className="mt-1.5 w-full bg-[#0d0a07] border border-[#c9a25e]/25 px-4 py-3 text-xs outline-none focus:border-[#c9a25e] transition placeholder:text-[#f3ead9]/30 text-[#f3ead9]"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/80">Your Words *</label>
                  <textarea
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    rows={4}
                    placeholder="Tell us what you loved..."
                    className="mt-1.5 w-full bg-[#0d0a07] border border-[#c9a25e]/25 px-4 py-3 text-xs outline-none focus:border-[#c9a25e] transition placeholder:text-[#f3ead9]/30 text-[#f3ead9] resize-none"
                  />
                </div>

                {formError && <p className="text-xs text-[#e8a08a]">{formError}</p>}
                {success && (
                  <p className="flex items-center gap-2 text-xs text-[#9ed9a3]">
                    <CheckCircle2 size={16} /> {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.24em] uppercase font-medium hover:bg-[#e8c98a] transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Publishing Review...' : 'Publish Entry'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

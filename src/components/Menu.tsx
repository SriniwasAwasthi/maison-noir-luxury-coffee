import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Coffee, Loader2, Wine, Croissant, Snowflake, Eye, Plus, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { useShop, MenuItem } from '../context/ShopContext';

const categories = [
  { name: 'All', icon: Coffee },
  { name: 'Espresso', icon: Coffee },
  { name: 'Signature Brews', icon: Wine },
  { name: 'Cold & Iced', icon: Snowflake },
  { name: 'Pastries', icon: Croissant },
];

const categoryImages: Record<string, string> = {
  Espresso: '/images/menu-espresso.jpg',
  'Signature Brews': '/images/menu-latte.jpg',
  'Cold & Iced': '/images/menu-coldbrew.jpg',
  Pastries: '/images/menu-pastry.jpg',
};

export default function Menu() {
  const { formatPrice, setSelectedItemForDetail, addToCart, setIsSommelierOpen } = useShop();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Direct-Trade' | 'Vegan' | 'Gluten-Free'>('All');
  const [addedItemNotice, setAddedItemNotice] = useState<number | null>(null);

  const fetchItems = async (cat: string, q: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (cat !== 'All') params.set('category', cat);
      if (q.trim()) params.set('search', q.trim());
      const res = await fetch('/api/menu-items?' + params.toString());
      if (!res.ok) throw new Error('Failed to load menu');
      const data = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Could not load the menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(category, query);
  }, [category, query]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredItems = useMemo(() => {
    if (dietaryFilter === 'All') return items;
    if (dietaryFilter === 'Direct-Trade') return items.filter((i) => i.category !== 'Pastries');
    if (dietaryFilter === 'Vegan') return items.filter((i) => !i.name.toLowerCase().includes('croissant') && !i.name.toLowerCase().includes('bun'));
    if (dietaryFilter === 'Gluten-Free') return items.filter((i) => i.category !== 'Pastries');
    return items;
  }, [items, dietaryFilter]);

  const featured = useMemo(() => filteredItems.filter((i) => i.is_featured).slice(0, 3), [filteredItems]);
  const rest = useMemo(() => filteredItems.filter((i) => !featured.some((f) => f.id === i.id)), [filteredItems, featured]);
  const showFeatured = category === 'All' && !query && dietaryFilter === 'All' && featured.length > 0;
  const listItems = showFeatured ? rest : filteredItems;

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart(item);
    setAddedItemNotice(item.id);
    setTimeout(() => setAddedItemNotice(null), 1500);
  };

  return (
    <section id="menu" className="relative bg-[#14100b] py-24 md:py-36 grain">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.42em] uppercase text-[#c9a25e] mb-4">The Curated Menu</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#faf5ea]">
            Composed Like <em className="gold-text">Fine Dining</em>
          </h2>
          <p className="mt-4 text-[#f3ead9]/70 font-light leading-relaxed">
            Direct-trade micro-lots, tableside siphon extractions and fresh patisserie baked hourly. Click any offering to inspect its cupping dial or customize your pour.
          </p>

          <button
            onClick={() => setIsSommelierOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d0a07] border border-[#c9a25e]/40 text-[#e8c98a] text-xs tracking-[0.2em] uppercase hover:bg-[#c9a25e]/15 transition"
          >
            <Sparkles size={14} className="text-[#c9a25e]" /> Not sure what to choose? Ask the Sommelier
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-[11px] sm:text-[12px] tracking-[0.18em] uppercase border transition-all duration-300 ${
                  category === c.name
                    ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-medium'
                    : 'border-[#c9a25e]/25 text-[#f3ead9]/75 hover:border-[#c9a25e] hover:text-[#e8c98a]'
                }`}
              >
                <c.icon size={14} /> {c.name}
              </button>
            ))}
          </div>

          {/* Search & Dietary Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Dietary Filter Pill */}
            <div className="flex items-center gap-1 bg-[#0d0a07] border border-[#c9a25e]/20 p-1 w-full sm:w-auto overflow-x-auto">
              {(['All', 'Direct-Trade', 'Vegan', 'Gluten-Free'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDietaryFilter(d)}
                  className={`px-2.5 py-1 text-[10px] tracking-wider uppercase whitespace-nowrap transition ${
                    dietaryFilter === d
                      ? 'bg-[#c9a25e]/20 text-[#e8c98a] border border-[#c9a25e]/40'
                      : 'text-[#f3ead9]/50 hover:text-[#e8c98a]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9a25e]/70" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the cellar..."
                className="w-full bg-[#0d0a07] border border-[#c9a25e]/25 pl-10 pr-4 py-2.5 text-xs text-[#f3ead9] placeholder:text-[#f3ead9]/35 outline-none focus:border-[#c9a25e] transition"
              />
            </div>
          </div>
        </div>

        {/* Loading / Error / Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4 text-[#c9a25e]">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-xs tracking-[0.3em] uppercase text-[#f3ead9]/60">Brewing the cellar menu...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-[#e8a08a]">{error}</p>
            <button
              onClick={() => fetchItems(category, query)}
              className="mt-4 px-6 py-2.5 border border-[#c9a25e]/50 text-[#e8c98a] text-xs tracking-[0.2em] uppercase hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
            >
              Try again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-24 text-center">
            <Coffee size={36} className="mx-auto text-[#c9a25e]/40" />
            <p className="mt-4 font-serif text-2xl text-[#f3ead9]/80">No offerings match your search</p>
            <p className="text-xs text-[#f3ead9]/50 mt-1">Try resetting the dietary filter or craving keywords.</p>
            <button
              onClick={() => {
                setSearch('');
                setDietaryFilter('All');
                setCategory('All');
              }}
              className="mt-4 px-5 py-2 border border-[#c9a25e]/40 text-[#e8c98a] text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Chef's Signature Feature Cards */}
            {showFeatured && (
              <div className="mt-14">
                <p className="flex items-center gap-2 text-[11px] tracking-[0.35em] uppercase text-[#e8c98a] mb-6 font-medium">
                  <Star size={13} className="fill-[#c9a25e] text-[#c9a25e]" /> Chef's Signature Extractions
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {featured.map((item, i) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      onClick={() => setSelectedItemForDetail(item)}
                      className="group relative overflow-hidden bg-[#0d0a07] gold-border hover:border-[#c9a25e] transition-all duration-500 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={item.image_url || categoryImages[item.category] || '/images/menu-latte.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07] via-transparent to-transparent" />
                          {item.badge && (
                            <span className="absolute top-4 left-4 bg-[#c9a25e] text-[#0d0a07] text-[10px] tracking-[0.25em] uppercase px-3 py-1 font-medium">
                              {item.badge}
                            </span>
                          )}
                          <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition bg-[#0d0a07]/80 backdrop-blur border border-[#c9a25e]/40 text-[#e8c98a] text-[10px] uppercase tracking-wider px-2.5 py-1 flex items-center gap-1">
                            <Eye size={12} /> Inspect Dial
                          </span>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-serif text-2xl text-[#faf5ea] group-hover:text-[#e8c98a] transition">
                              {item.name}
                            </h3>
                            <p className="font-serif text-2xl gold-text whitespace-nowrap">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="mt-2 text-xs sm:text-sm font-light text-[#f3ead9]/65 leading-relaxed">
                            {item.description}
                          </p>
                          <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-[#c9a25e]/70">
                            {item.category} • Cupping: 92+
                          </p>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="p-6 pt-0 flex gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(e, item)}
                          className="w-full py-2.5 bg-[#c9a25e]/15 border border-[#c9a25e]/40 hover:bg-[#c9a25e] hover:text-[#0d0a07] text-[#e8c98a] text-xs tracking-[0.2em] uppercase font-medium transition flex items-center justify-center gap-1.5"
                        >
                          {addedItemNotice === item.id ? (
                            <>
                              <Check size={14} /> Added to Tray
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> Add to Tasting Tray
                            </>
                          )}
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}

            {/* Menu List */}
            <div className={`grid sm:grid-cols-2 gap-x-12 gap-y-2 ${showFeatured ? 'mt-14' : 'mt-10'}`}>
              <AnimatePresence mode="popLayout">
                {listItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedItemForDetail(item)}
                    className="group flex gap-4 py-5 border-b border-[#c9a25e]/15 hover:border-[#c9a25e]/50 transition cursor-pointer"
                  >
                    <div className="hidden sm:block w-16 h-16 shrink-0 overflow-hidden border border-[#c9a25e]/20 relative">
                      <img
                        src={item.image_url || categoryImages[item.category] || '/images/menu-latte.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3">
                        <h4 className="font-serif text-xl text-[#faf5ea] group-hover:text-[#e8c98a] transition truncate">
                          {item.name}
                        </h4>
                        <span className="flex-1 border-b border-dotted border-[#c9a25e]/30 -translate-y-1" />
                        <p className="font-serif text-xl gold-text whitespace-nowrap">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <p className="mt-1 text-xs sm:text-[13px] font-light text-[#f3ead9]/60 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/70">
                            {item.category}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] tracking-[0.2em] uppercase text-[#0d0a07] bg-[#c9a25e]/90 px-2 py-0.5 font-medium">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(e, item)}
                          className="opacity-90 sm:opacity-0 group-hover:opacity-100 text-[#e8c98a] hover:text-[#faf5ea] transition text-[11px] tracking-wider uppercase flex items-center gap-1 border border-[#c9a25e]/30 px-2 py-0.5 bg-[#0d0a07]"
                        >
                          <Plus size={11} /> Add to Tray
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

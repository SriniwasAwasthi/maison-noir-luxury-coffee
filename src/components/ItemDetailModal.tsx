import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Minus, Check, Coffee, Flame, Droplets, Wind, HeartHandshake } from 'lucide-react';
import { useShop, MenuItem } from '../context/ShopContext';

export default function ItemDetailModal() {
  const { selectedItemForDetail, setSelectedItemForDetail, addToCart, formatPrice } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<'Hot' | 'Iced' | 'Tableside Siphon'>('Hot');
  const [milkOption, setMilkOption] = useState<'None / Black' | 'Organic Whole Milk' | 'Oat Milk' | 'Almond Cream' | 'Pistachio Foam'>('Organic Whole Milk');
  const [grindOption, setGrindOption] = useState<'Whole Bean (Pack)' | 'Standard Pour' | 'Chemex Coarse' | 'Espresso Fine'>('Standard Pour');
  const [addGoldLeaf, setAddGoldLeaf] = useState(false);

  if (!selectedItemForDetail) return null;
  const item = selectedItemForDetail;

  const isDrink = item.category !== 'Pastries';
  const goldPrice = addGoldLeaf ? 3.5 : 0;
  const itemTotal = (item.price + goldPrice) * quantity;

  // Sensory defaults
  const roastLevel = item.roastLevel || (item.category === 'Espresso' ? 4 : item.category === 'Cold & Iced' ? 5 : 3);
  const acidity = item.acidity || (item.name.includes('Yirgacheffe') || item.category === 'Signature Brews' ? 4 : 2);
  const sweetness = item.sweetness || (item.category === 'Pastries' ? 5 : 3);
  const body = item.body || (item.category === 'Cold & Iced' ? 5 : 4);
  const aroma = item.aroma || 5;

  const handleAddToCart = () => {
    addToCart(item, {
      quantity,
      temperature: isDrink ? temperature : 'Hot',
      milkOption: isDrink ? milkOption : 'None / Black',
      grindOption: isDrink ? grindOption : 'Standard Pour',
      addGoldLeaf,
    });
    setSelectedItemForDetail(null);
    setQuantity(1);
    setAddGoldLeaf(false);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[85] bg-[#0d0a07]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        onClick={() => setSelectedItemForDetail(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#14100b] border border-[#c9a25e]/40 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedItemForDetail(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#0d0a07]/80 border border-[#c9a25e]/30 flex items-center justify-center text-[#f3ead9] hover:text-[#e8c98a] hover:border-[#c9a25e] transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Left Column: Image & Sensory Meters */}
          <div className="md:w-5/12 bg-[#0d0a07] border-b md:border-b-0 md:border-r border-[#c9a25e]/20 flex flex-col">
            <div className="relative h-56 md:h-64 overflow-hidden">
              <img
                src={item.image_url || '/images/menu-latte.jpg'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07] via-transparent to-transparent" />
              {item.badge && (
                <span className="absolute top-4 left-4 bg-[#c9a25e] text-[#0d0a07] text-[10px] tracking-[0.25em] uppercase px-3 py-1 font-medium">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Sensory Meters */}
            <div className="p-5 flex-1 flex flex-col justify-center space-y-3.5 bg-[#0d0a07]/90">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#c9a25e]/80 flex items-center gap-1.5 font-medium">
                <Sparkles size={12} /> Sensory Dial & Cupping
              </p>

              {/* Meter items */}
              <div>
                <div className="flex justify-between text-[11px] text-[#f3ead9]/70 mb-1">
                  <span className="flex items-center gap-1.5"><Flame size={12} className="text-[#c9a25e]" /> Roast Depth</span>
                  <span className="text-[#e8c98a]">{roastLevel} / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e1610] rounded-full overflow-hidden border border-[#c9a25e]/20">
                  <div className="h-full bg-gradient-to-r from-[#c9a25e] to-[#8a5f3c]" style={{ width: `${(roastLevel / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#f3ead9]/70 mb-1">
                  <span className="flex items-center gap-1.5"><Droplets size={12} className="text-[#c9a25e]" /> Acidity / Brightness</span>
                  <span className="text-[#e8c98a]">{acidity} / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e1610] rounded-full overflow-hidden border border-[#c9a25e]/20">
                  <div className="h-full bg-gradient-to-r from-[#f4dfa8] to-[#c9a25e]" style={{ width: `${(acidity / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#f3ead9]/70 mb-1">
                  <span className="flex items-center gap-1.5"><Coffee size={12} className="text-[#c9a25e]" /> Body & Texture</span>
                  <span className="text-[#e8c98a]">{body} / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e1610] rounded-full overflow-hidden border border-[#c9a25e]/20">
                  <div className="h-full bg-gradient-to-r from-[#c9a25e] to-[#6a4220]" style={{ width: `${(body / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#f3ead9]/70 mb-1">
                  <span className="flex items-center gap-1.5"><Wind size={12} className="text-[#c9a25e]" /> Aroma Complexity</span>
                  <span className="text-[#e8c98a]">{aroma} / 5</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e1610] rounded-full overflow-hidden border border-[#c9a25e]/20">
                  <div className="h-full bg-gradient-to-r from-[#e8c98a] to-[#c9a25e]" style={{ width: `${(aroma / 5) * 100}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-[#c9a25e]/15 flex items-center justify-between text-[10px] text-[#f3ead9]/50 uppercase tracking-widest">
                <span>Direct Trade Lot</span>
                <span>Cupping: 92+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Order Action */}
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a25e]">{item.category}</p>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#faf5ea] mt-1">{item.name}</h3>
              <p className="font-serif text-2xl gold-text mt-2">{formatPrice(item.price)}</p>

              <p className="mt-3 text-sm font-light text-[#f3ead9]/75 leading-relaxed">
                {item.description}
              </p>

              {/* Customization Options for Drinks */}
              {isDrink && (
                <div className="mt-6 space-y-4 pt-4 border-t border-[#c9a25e]/20">
                  {/* Temperature */}
                  <div>
                    <label className="block text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90 mb-2">
                      Temperature & Pour Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Hot', 'Iced', 'Tableside Siphon'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTemperature(t)}
                          className={`py-2 px-2 text-xs tracking-wider border transition text-center ${
                            temperature === t
                              ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-medium'
                              : 'border-[#c9a25e]/25 text-[#f3ead9]/70 hover:border-[#c9a25e]/60'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Milk Option */}
                  <div>
                    <label className="block text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90 mb-2">
                      Milk & Cream Choice
                    </label>
                    <select
                      value={milkOption}
                      onChange={(e) => setMilkOption(e.target.value as any)}
                      className="w-full bg-[#0d0a07] border border-[#c9a25e]/30 px-3 py-2.5 text-xs text-[#f3ead9] outline-none focus:border-[#c9a25e]"
                    >
                      <option>Organic Whole Milk</option>
                      <option>Oat Milk</option>
                      <option>Almond Cream</option>
                      <option>Pistachio Foam</option>
                      <option>None / Black</option>
                    </select>
                  </div>

                  {/* 24k Gold Flakes Add-on */}
                  <div
                    onClick={() => setAddGoldLeaf(!addGoldLeaf)}
                    className={`flex items-center justify-between p-3 border cursor-pointer transition ${
                      addGoldLeaf
                        ? 'border-[#c9a25e] bg-[#c9a25e]/10'
                        : 'border-[#c9a25e]/20 bg-[#0d0a07]/50 hover:border-[#c9a25e]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className={addGoldLeaf ? 'text-[#e8c98a]' : 'text-[#f3ead9]/40'} />
                      <div>
                        <p className="text-xs font-medium text-[#faf5ea]">Edible 24k Gold Leaf Flakes</p>
                        <p className="text-[11px] text-[#f3ead9]/50">Hand-finished atop the crema foam</p>
                      </div>
                    </div>
                    <span className="text-xs gold-text font-serif">+{formatPrice(3.5)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Quantity and Add to Tray */}
            <div className="mt-8 pt-4 border-t border-[#c9a25e]/20 flex items-center justify-between gap-4">
              <div className="flex items-center border border-[#c9a25e]/30 bg-[#0d0a07]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#f3ead9]/70 hover:text-[#e8c98a] transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-serif text-[#faf5ea]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#f3ead9]/70 hover:text-[#e8c98a] transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.22em] uppercase font-medium hover:bg-[#e8c98a] transition flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(201,162,94,0.3)]"
              >
                <span>Add to Tasting Tray</span>
                <span className="font-serif text-sm">({formatPrice(itemTotal)})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

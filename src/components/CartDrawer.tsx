import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, CheckCircle2, Sparkles, Clock, MapPin, Gift, CreditCard, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, formatPrice, cartTotalUsd } = useShop();

  const [orderType, setOrderType] = useState<'dine-in' | 'pickup'>('dine-in');
  const [tableNumber, setTableNumber] = useState('Table 04 - Velvet Salon');
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(20);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any | null>(null);

  const giftPrice = giftPackaging ? 6.0 : 0;
  const subtotal = cartTotalUsd + giftPrice;
  const tipAmount = (subtotal * tipPercentage) / 100;
  const tax = subtotal * 0.0825;
  const total = subtotal + tipAmount + tax;

  const handlePlaceOrder = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setOrderPlaced({
        orderNumber: `MN-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        items: [...cart],
        type: orderType,
        table: orderType === 'dine-in' ? tableNumber : 'Roastery Bar Pickup',
        total: total,
        estimatedTime: orderType === 'dine-in' ? '6-8 minutes' : '12-15 minutes',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setIsCheckingOut(false);
      clearCart();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[90] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsCartOpen(false);
              setOrderPlaced(null);
            }}
            className="absolute inset-0 bg-[#0d0a07]/80 backdrop-blur-sm"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-y-0 right-0 max-w-full w-full sm:w-[480px] bg-[#14100b] border-l border-[#c9a25e]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#c9a25e]/20 flex items-center justify-between bg-[#0d0a07]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full border border-[#c9a25e]/40 flex items-center justify-center bg-[#c9a25e]/10">
                  <ShoppingBag size={18} className="text-[#e8c98a]" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl text-[#faf5ea]">Tasting Tray</h3>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#c9a25e]/70">
                    {cart.length} unique selection{cart.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderPlaced(null);
                }}
                className="text-[#f3ead9]/50 hover:text-[#e8c98a] p-2 transition"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {orderPlaced ? (
                /* Order Confirmation Ticket */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#9ed9a3]/10 border border-[#9ed9a3]/40 flex items-center justify-center mx-auto text-[#9ed9a3]">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="font-serif text-3xl text-[#faf5ea]">Ritual in Progress</h4>
                  <p className="text-xs text-[#f3ead9]/70 font-light max-w-xs mx-auto">
                    Your barista has received your selections. Every cup is ground fresh on demand.
                  </p>

                  {/* Receipt Box */}
                  <div className="bg-[#0d0a07] border border-[#c9a25e]/30 p-5 text-left space-y-3 font-mono text-xs">
                    <div className="flex justify-between text-[#c9a25e]">
                      <span>ORDER TICKET</span>
                      <span>{orderPlaced.orderNumber}</span>
                    </div>
                    <div className="border-b border-[#c9a25e]/20 pb-2">
                      <p className="text-[#faf5ea] font-serif text-sm">Maison Noir Roastery</p>
                      <p className="text-[10px] text-[#f3ead9]/50">Poured at {orderPlaced.date}</p>
                    </div>

                    <div className="space-y-1.5 py-1">
                      <div className="flex justify-between text-[#f3ead9]/80">
                        <span>Service Method:</span>
                        <span className="text-[#e8c98a]">{orderPlaced.table}</span>
                      </div>
                      <div className="flex justify-between text-[#f3ead9]/80">
                        <span>Estimated Ready:</span>
                        <span className="text-[#e8c98a]">{orderPlaced.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between text-[#faf5ea] font-semibold pt-2 border-t border-[#c9a25e]/20">
                        <span>Total Charged:</span>
                        <span className="gold-text">{formatPrice(orderPlaced.total)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOrderPlaced(null);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3.5 border border-[#c9a25e]/50 text-[#e8c98a] text-xs tracking-[0.2em] uppercase hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                  >
                    Close Tray
                  </button>
                </motion.div>
              ) : cart.length === 0 ? (
                /* Empty Cart */
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border border-[#c9a25e]/20 flex items-center justify-center mx-auto text-[#c9a25e]/40">
                    <ShoppingBag size={28} />
                  </div>
                  <h4 className="font-serif text-2xl text-[#faf5ea]">Your Tray is Empty</h4>
                  <p className="text-xs text-[#f3ead9]/55 max-w-xs mx-auto leading-relaxed">
                    Explore our single-origin lots, signature cold brews and fresh pastries to begin your tasting.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-6 py-3 border border-[#c9a25e]/50 text-[#e8c98a] text-xs tracking-[0.2em] uppercase hover:bg-[#c9a25e] hover:text-[#0d0a07] transition"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                <div className="space-y-4">
                  {cart.map((ci) => (
                    <motion.div
                      key={ci.cartId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-[#0d0a07] border border-[#c9a25e]/20 flex gap-3.5 relative group"
                    >
                      <img
                        src={ci.item.image_url || '/images/menu-latte.jpg'}
                        alt={ci.item.name}
                        className="w-16 h-16 object-cover shrink-0 border border-[#c9a25e]/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-base text-[#faf5ea] truncate">{ci.item.name}</h4>
                          <span className="font-serif text-sm gold-text whitespace-nowrap">
                            {formatPrice(ci.totalPrice)}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#c9a25e]/80 mt-0.5">
                          {ci.temperature} • {ci.milkOption}
                        </p>

                        {ci.addGoldLeaf && (
                          <p className="text-[10px] text-[#e8c98a] flex items-center gap-1 mt-0.5">
                            <Sparkles size={10} /> 24k Gold Leaf Flakes
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-[#c9a25e]/30 bg-[#14100b]">
                            <button
                              onClick={() => updateQuantity(ci.cartId, ci.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#f3ead9]/60 hover:text-[#e8c98a]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs text-[#faf5ea] font-serif">{ci.quantity}</span>
                            <button
                              onClick={() => updateQuantity(ci.cartId, ci.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#f3ead9]/60 hover:text-[#e8c98a]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(ci.cartId)}
                            className="text-[#f3ead9]/40 hover:text-[#e8a08a] transition p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Service Mode Selector */}
                  <div className="pt-3 border-t border-[#c9a25e]/20 space-y-3">
                    <label className="text-[11px] tracking-[0.25em] uppercase text-[#c9a25e]/90 block">
                      Service Experience
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('dine-in')}
                        className={`py-2 px-3 text-xs tracking-wider border flex items-center justify-center gap-2 transition ${
                          orderType === 'dine-in'
                            ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-medium'
                            : 'border-[#c9a25e]/25 text-[#f3ead9]/70 hover:border-[#c9a25e]/50'
                        }`}
                      >
                        <Clock size={13} /> Dine-in Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('pickup')}
                        className={`py-2 px-3 text-xs tracking-wider border flex items-center justify-center gap-2 transition ${
                          orderType === 'pickup'
                            ? 'bg-[#c9a25e] text-[#0d0a07] border-[#c9a25e] font-medium'
                            : 'border-[#c9a25e]/25 text-[#f3ead9]/70 hover:border-[#c9a25e]/50'
                        }`}
                      >
                        <MapPin size={13} /> Roastery Pickup
                      </button>
                    </div>

                    {orderType === 'dine-in' && (
                      <input
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g. Table 04 / Velvet Booth"
                        className="w-full bg-[#0d0a07] border border-[#c9a25e]/30 px-3 py-2 text-xs text-[#f3ead9] outline-none focus:border-[#c9a25e]"
                      />
                    )}
                  </div>

                  {/* Gift Packaging Toggle */}
                  <div
                    onClick={() => setGiftPackaging(!giftPackaging)}
                    className={`flex items-center justify-between p-3 border cursor-pointer transition ${
                      giftPackaging
                        ? 'border-[#c9a25e] bg-[#c9a25e]/10'
                        : 'border-[#c9a25e]/20 bg-[#0d0a07]/60 hover:border-[#c9a25e]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Gift size={16} className={giftPackaging ? 'text-[#e8c98a]' : 'text-[#f3ead9]/40'} />
                      <div>
                        <p className="text-xs font-medium text-[#faf5ea]">Maison Noir Brass Gift Box</p>
                        <p className="text-[10px] text-[#f3ead9]/50">Wax-sealed with barista cupping card</p>
                      </div>
                    </div>
                    <span className="text-xs gold-text font-serif">+{formatPrice(6.0)}</span>
                  </div>

                  {/* Tip Selection */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#c9a25e]/80 flex justify-between">
                      <span>Barista Ritual Gratuity</span>
                      <span>{tipPercentage}% ({formatPrice(tipAmount)})</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[15, 18, 20, 25].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setTipPercentage(pct)}
                          className={`py-1.5 text-xs border transition ${
                            tipPercentage === pct
                              ? 'border-[#c9a25e] bg-[#c9a25e]/20 text-[#e8c98a]'
                              : 'border-[#c9a25e]/20 text-[#f3ead9]/60 hover:border-[#c9a25e]/40'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && !orderPlaced && (
              <div className="p-6 bg-[#0d0a07] border-t border-[#c9a25e]/25 space-y-4">
                <div className="space-y-1.5 text-xs text-[#f3ead9]/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gratuity</span>
                    <span>{formatPrice(tipAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base text-[#faf5ea] font-serif pt-2 border-t border-[#c9a25e]/20">
                    <span>Total Experience</span>
                    <span className="gold-text text-xl">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-[#c9a25e] text-[#0d0a07] text-[12px] tracking-[0.24em] uppercase font-medium hover:bg-[#e8c98a] transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(201,162,94,0.3)]"
                >
                  {isCheckingOut ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  {isCheckingOut ? 'Transmitting Order...' : 'Confirm Tasting Order'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

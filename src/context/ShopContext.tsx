import React, { createContext, useContext, useState, useEffect } from 'react';
import { startAmbientSound, stopAmbientSound, getAudioContext } from '../utils/audio';

export type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_featured: boolean;
  badge: string | null;
  origin?: string;
  altitude?: string;
  process?: string;
  roastLevel?: number; // 1 to 5
  acidity?: number; // 1 to 5
  body?: number; // 1 to 5
  sweetness?: number; // 1 to 5
  aroma?: number; // 1 to 5
  tastingNotes?: string[];
};

export type CartItem = {
  cartId: string;
  item: MenuItem;
  quantity: number;
  temperature: 'Hot' | 'Iced' | 'Tableside Siphon';
  milkOption: 'None / Black' | 'Organic Whole Milk' | 'Oat Milk' | 'Almond Cream' | 'Pistachio Foam';
  grindOption: 'Whole Bean (Pack)' | 'Standard Pour' | 'Chemex Coarse' | 'Espresso Fine';
  addGoldLeaf: boolean;
  unitPrice: number;
  totalPrice: number;
};

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED' | 'INR';

type CurrencyConfig = {
  symbol: string;
  rate: number;
  decimals: number;
  prefix: boolean;
};

const currencyConfigs: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', rate: 1.0, decimals: 2, prefix: true },
  EUR: { symbol: '€', rate: 0.92, decimals: 2, prefix: false },
  GBP: { symbol: '£', rate: 0.79, decimals: 2, prefix: true },
  JPY: { symbol: '¥', rate: 152.0, decimals: 0, prefix: true },
  AED: { symbol: 'AED ', rate: 3.67, decimals: 2, prefix: true },
  INR: { symbol: '₹', rate: 84.0, decimals: 0, prefix: true },
};

interface ShopContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usd: number) => string;
  cart: CartItem[];
  addToCart: (item: MenuItem, options?: Partial<CartItem>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalUsd: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSommelierOpen: boolean;
  setIsSommelierOpen: (open: boolean) => void;
  selectedItemForDetail: MenuItem | null;
  setSelectedItemForDetail: (item: MenuItem | null) => void;
  isAudioOn: boolean;
  audioMode: 'vinyl' | 'espresso' | 'rain';
  setAudioMode: (mode: 'vinyl' | 'espresso' | 'rain') => void;
  toggleAudio: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maison_noir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MenuItem | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(true); // Automatically active on enter
  const [audioMode, setAudioMode] = useState<'vinyl' | 'espresso' | 'rain'>('vinyl');

  // Auto-play music on website entrance + unlock on first user gesture if browser restricts
  useEffect(() => {
    const tryAutoplay = () => {
      const ok = startAmbientSound('vinyl', 0.28);
      if (ok) {
        setIsAudioOn(true);
      }
    };

    tryAutoplay();

    const handleFirstGesture = () => {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      tryAutoplay();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('scroll', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('maison_noir_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const toggleAudio = () => {
    if (isAudioOn) {
      stopAmbientSound();
      setIsAudioOn(false);
    } else {
      const ok = startAmbientSound(audioMode, 0.28);
      setIsAudioOn(ok);
    }
  };

  const handleSetAudioMode = (mode: 'vinyl' | 'espresso' | 'rain') => {
    setAudioMode(mode);
    if (isAudioOn) {
      startAmbientSound(mode, 0.28);
    }
  };

  const formatPrice = (usd: number): string => {
    const config = currencyConfigs[currency] || currencyConfigs.INR;
    const converted = usd * config.rate;
    const formattedNum = config.decimals === 0 ? Math.round(converted).toLocaleString() : converted.toFixed(config.decimals);
    return config.prefix ? `${config.symbol}${formattedNum}` : `${formattedNum} ${config.symbol}`;
  };

  const addToCart = (item: MenuItem, options?: Partial<CartItem>) => {
    const temp = options?.temperature || (item.category === 'Cold & Iced' ? 'Iced' : 'Hot');
    const milk = options?.milkOption || 'Organic Whole Milk';
    const grind = options?.grindOption || 'Standard Pour';
    const addGold = options?.addGoldLeaf || false;
    const quantity = options?.quantity || 1;

    const goldAddonPrice = addGold ? 3.5 : 0;
    const unitPrice = item.price + goldAddonPrice;
    const totalPrice = unitPrice * quantity;

    const cartId = `${item.id}-${temp}-${milk}-${grind}-${addGold}`;

    setCart((prev) => {
      const existing = prev.find((ci) => ci.cartId === cartId);
      if (existing) {
        return prev.map((ci) =>
          ci.cartId === cartId
            ? {
                ...ci,
                quantity: ci.quantity + quantity,
                totalPrice: (ci.quantity + quantity) * unitPrice,
              }
            : ci
        );
      }
      return [
        ...prev,
        {
          cartId,
          item,
          quantity,
          temperature: temp,
          milkOption: milk,
          grindOption: grind,
          addGoldLeaf: addGold,
          unitPrice,
          totalPrice,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) =>
        ci.cartId === cartId
          ? { ...ci, quantity, totalPrice: quantity * ci.unitPrice }
          : ci
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotalUsd = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <ShopContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotalUsd,
        isCartOpen,
        setIsCartOpen,
        isSommelierOpen,
        setIsSommelierOpen,
        selectedItemForDetail,
        setSelectedItemForDetail,
        isAudioOn,
        audioMode,
        setAudioMode: handleSetAudioMode,
        toggleAudio,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

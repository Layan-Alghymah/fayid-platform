import { useState, useEffect, useCallback } from 'react';
import { supabase, mapSupabaseToProduct, type Product as MappedProduct } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  quantity: number;
  product: MappedProduct;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

interface CartState {
  items: { productId: number; quantity: number }[];
}

const STORAGE_KEY = 'fayid_cart';

function loadCartState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    return JSON.parse(raw) as CartState;
  } catch {
    return { items: [] };
  }
}

function saveCartState(state: CartState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function fetchProduct(id: number): Promise<MappedProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
  if (error || !data) return null;
  return mapSupabaseToProduct(data);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const [cartState, setCartState] = useState<CartState>(loadCartState);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  // Build enriched cart whenever cartState changes
  const refreshCart = useCallback(async () => {
    setLoading(true);
    const items: CartItem[] = [];
    let total = 0;

    for (const entry of cartState.items) {
      const product = await fetchProduct(entry.productId);
      if (product) {
        items.push({ productId: entry.productId, quantity: entry.quantity, product });
        total += product.price * entry.quantity;
      }
    }

    setCart({ items, total });
    setLoading(false);
  }, [cartState]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback((productId: number, quantity: number = 1) => {
    setCartState(prev => {
      const existing = prev.items.find(i => i.productId === productId);
      let newItems: typeof prev.items;
      if (existing) {
        newItems = prev.items.map(i =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [...prev.items, { productId, quantity }];
      }
      const next = { items: newItems };
      saveCartState(next);
      return next;
    });
  }, []);

  const updateCartItem = useCallback((productId: number, quantity: number) => {
    setCartState(prev => {
      const newItems = prev.items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      ).filter(i => i.quantity > 0);
      const next = { items: newItems };
      saveCartState(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartState(prev => {
      const next = { items: prev.items.filter(i => i.productId !== productId) };
      saveCartState(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    const next = { items: [] };
    saveCartState(next);
    setCartState(next);
  }, []);

  return {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}

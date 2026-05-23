import { useState, useEffect, useCallback } from 'react';
import { supabase, mapSupabaseToProduct, type Product as MappedProduct } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  quantity: number;
  selectedSize?: string;
  snapOption?: string;
  product: MappedProduct;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

interface CartStateItem {
  productId: number;
  quantity: number;
  selectedSize?: string;
  snapOption?: string;
}

interface CartState {
  items: CartStateItem[];
}

const STORAGE_KEY = 'fayid_cart';

function loadCartState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    // Validate shape — must have an array of items with numeric productId and quantity
    if (
      !parsed ||
      !Array.isArray(parsed.items) ||
      parsed.items.some(
        (i: unknown) =>
          typeof (i as any)?.productId !== "number" ||
          typeof (i as any)?.quantity !== "number"
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return { items: [] };
    }
    return parsed as CartState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
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
  const [loading, setLoading] = useState(true); // true until first fetch completes

  // Build enriched cart whenever cartState changes
  const refreshCart = useCallback(async () => {
    setLoading(true);
    const items: CartItem[] = [];
    let total = 0;

    for (const entry of cartState.items) {
      const product = await fetchProduct(entry.productId);
      if (product) {
        items.push({
          productId: entry.productId,
          quantity: entry.quantity,
          selectedSize: entry.selectedSize,
          snapOption: entry.snapOption,
          product,
        });
        total += product.price * entry.quantity;
      }
    }

    setCart({ items, total });
    setLoading(false);
  }, [cartState]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback((
    productId: number,
    quantity: number = 1,
    options?: { selectedSize?: string; snapOption?: string }
  ) => {
    setCartState(prev => {
      const existing = prev.items.find(i => i.productId === productId);
      let newItems: CartStateItem[];
      if (existing) {
        newItems = prev.items.map(i =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity, ...(options ?? {}) }
            : i
        );
      } else {
        newItems = [...prev.items, { productId, quantity, ...(options ?? {}) }];
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

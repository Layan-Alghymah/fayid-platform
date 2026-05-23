import { useQuery } from '@tanstack/react-query';
import { supabase, mapSupabaseToProduct, type Product } from '@/lib/supabase';

interface Filters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// ─── useProducts ─────────────────────────────────────────────────────────────

export function useProducts(filters?: Filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      // !inner ensures products without an active supplier are excluded (INNER JOIN).
      // anon can SELECT suppliers (RLS allows it), so the join works.
      let query = supabase
        .from('products')
        .select('*, suppliers!inner(is_active)')
        .eq('is_active', true)
        .eq('suppliers.is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;
      if (error) throw error;

      let products = (data ?? []).map(mapSupabaseToProduct);

      // Client-side filtering for search and price range
      if (filters?.search) {
        const term = filters.search.toLowerCase();
        products = products.filter(
          p =>
            p.name.toLowerCase().includes(term) ||
            (p.description && p.description.toLowerCase().includes(term)) ||
            (p.brand && p.brand.toLowerCase().includes(term)) ||
            p.category.toLowerCase().includes(term)
        );
      }
      if (filters?.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }

      return { products, total: products.length };
    },
  });
}

// ─── useProduct ──────────────────────────────────────────────────────────────

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) return null;
      return mapSupabaseToProduct(data);
    },
  });
}

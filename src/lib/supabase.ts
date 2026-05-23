import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[fayid] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client uses service role key — bypasses RLS for admin operations.
// Set VITE_SUPABASE_SERVICE_KEY in your .env to enable write operations.
const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY ?? supabaseAnonKey;
export const adminSupabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

export type SupabaseProduct = {
  id: number;
  supplier_id: number | null;
  supplier_name: string | null;
  name: string;
  description: string | null;
  category: string;
  price: number;
  original_price: number;
  quantity: number;
  image_url: string | null;
  images?: string[] | null;
  discount_reason: string | null;
  sizes: string[] | null;
  brand: string | null;
  is_active: boolean;
  created_at: string;
  // Extended product type fields (require ALTER TABLE — see SQL in docs)
  unit?: string | null;
  product_type?: string | null;
  available_sizes?: string[] | null;
  has_abaya_snap_option?: boolean | null;
  max_quantity_per_order?: number | null;
};

export type Supplier = {
  id: number;
  name: string;
  email: string | null;
  whatsapp: string | null;
  city: string | null;
  type: string | null;
  is_active: boolean;
  logo_url?: string | null;
  created_at?: string;
};

// UI Product type (matches the old API client Product schema)
export type Product = {
  id: number;
  supplierId?: number;
  supplierName?: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  originalPrice: number;
  quantity: number;
  imageUrl: string | null;
  images?: string[];
  discountReason: string | null;
  sizes?: string[];
  brand?: string | null;
  isActive?: boolean;
  createdAt?: string;
  // Extended fields
  unit?: string;
  productType?: string;
  availableSizes?: string[];
  hasAbayaSnapOption?: boolean;
  maxQuantityPerOrder?: number;
};

// Map Supabase snake_case to the camelCase Product format expected by UI
export function mapSupabaseToProduct(p: SupabaseProduct): Product {
  return {
    id: p.id,
    supplierId: p.supplier_id ?? undefined,
    supplierName: p.supplier_name ?? undefined,
    name: p.name,
    description: p.description ?? null,
    category: p.category,
    price: p.price,
    originalPrice: p.original_price,
    quantity: p.quantity,
    imageUrl: p.image_url ?? null,
    images: p.images ?? undefined,
    discountReason: p.discount_reason ?? null,
    sizes: p.sizes ?? undefined,
    brand: p.brand ?? null,
    isActive: p.is_active,
    createdAt: p.created_at,
    unit: p.unit ?? undefined,
    productType: p.product_type ?? undefined,
    availableSizes: p.available_sizes ?? undefined,
    hasAbayaSnapOption: p.has_abaya_snap_option ?? undefined,
    maxQuantityPerOrder: p.max_quantity_per_order ?? undefined,
  };
}
